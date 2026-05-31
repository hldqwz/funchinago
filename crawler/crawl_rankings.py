"""
爬取 OpenRouter /rankings 页面 — 使用 Playwright headless browser（增强版）
页面是 Next.js SPA，需要 JS 渲染后才能提取数据。
通过滚动加载更多排名数据，支持多策略提取。
"""

from playwright.sync_api import sync_playwright
import json
import time

RANKINGS_URL = "https://openrouter.ai/rankings"


def scrape_rankings() -> list[dict]:
    """
    用 headless browser 打开排名页，滚动加载所有排名后提取数据。
    返回列表，每项包含: slug, rank, name, usage_tokens, trend
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
            viewport={"width": 1440, "height": 900},
        )
        page = context.new_page()

        try:
            print("  🌐 正在打开排名页面...")
            page.goto(RANKINGS_URL, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(3000)  # 等待初始 JS 渲染

            # 尝试多种选择器等待排名数据出现
            selectors = [
                '[data-testid="model-rankings-leaderboard-row"]',
                '[data-testid*="ranking"]',
                '[data-testid*="leaderboard"]',
                'table tbody tr',
                '[role="row"]',
            ]

            found_selector = None
            for sel in selectors:
                try:
                    page.wait_for_selector(sel, timeout=8000)
                    count = page.evaluate(f"document.querySelectorAll('{sel}').length")
                    print(f"  📍 选择器 '{sel}' 找到 {count} 个元素")
                    if count > 0:
                        found_selector = sel
                        break
                except Exception:
                    continue

            if not found_selector:
                # 回退：尝试按链接提取
                print("  ⚠️ 未找到标准排名选择器，尝试按链接提取...")
                page.wait_for_timeout(5000)

            # 自动滚动页面底部以触发懒加载
            print("  📜 滚动加载更多数据...")
            prev_count = 0
            for scroll_round in range(10):
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(1500)

                if found_selector:
                    current_count = page.evaluate(
                        f"document.querySelectorAll('{found_selector}').length"
                    )
                else:
                    current_count = page.evaluate(
                        "document.querySelectorAll('a[href]').length"
                    )

                if current_count == prev_count and scroll_round > 2:
                    print(f"  ✅ 滚动完成，已加载 {current_count} 个元素（{scroll_round + 1} 轮）")
                    break
                prev_count = current_count
            else:
                print(f"  ⚠️ 滚动达到上限，当前 {prev_count} 个元素")

            # 提取排名数据——HTML 提取（escalating）
            print("  🔍 正在提取排名数据...")

            # 策略 1：精确 data-testid 提取
            rankings = page.evaluate("""
                () => {
                    // 尝试多种数据提取策略
                    const results = [];

                    // 策略 A: [data-testid="model-rankings-leaderboard-row"]
                    const rows = document.querySelectorAll('[data-testid="model-rankings-leaderboard-row"]');
                    if (rows.length > 0) {
                        rows.forEach(row => {
                            const modelLink = row.querySelector('a[href*="/"]:not([href^="#"]):not([href^="/?"])');
                            if (!modelLink) return;
                            const href = modelLink.getAttribute('href') || '';
                            const parts = href.split('/').filter(Boolean);
                            if (parts.length !== 2) return;
                            const slug = parts[0] + '/' + parts[1];
                            const name = modelLink.textContent.trim();
                            const rowText = row.textContent.trim();

                            const tokensMatch = rowText.match(/([\\d,.]+)\\s*([TBMK])\\s*tokens?/i);
                            const trendMatch = rowText.match(/([\\d,.]+%)/);
                            const changeMatch = rowText.match(/([+-]?\\d+\\.?\\d*%)/);

                            results.push({
                                rank: results.length + 1,
                                slug: slug,
                                name: name,
                                usage_tokens: parseUsage(tokensMatch),
                                usage_display: tokensMatch ? tokensMatch[0] : '',
                                trend: trendMatch ? trendMatch[1] : (changeMatch ? changeMatch[1] : ''),
                                method: 'data-testid',
                            });
                        });
                        return results;
                    }

                    // 策略 B: table rows
                    const tableRows = document.querySelectorAll('table tbody tr');
                    if (tableRows.length > 0) {
                        tableRows.forEach((row, index) => {
                            const cells = row.querySelectorAll('td');
                            if (cells.length < 2) return;
                            const allLinks = row.querySelectorAll('a[href]');
                            let modelLink = null;
                            for (const link of allLinks) {
                                const h = link.getAttribute('href') || '';
                                if (h.includes('/') && !h.startsWith('#') && !h.startsWith('?')) {
                                    modelLink = link;
                                    break;
                                }
                            }
                            if (!modelLink) return;
                            const href = modelLink.getAttribute('href') || '';
                            const parts = href.split('/').filter(Boolean);
                            const slug = parts.length >= 2 ? parts[0] + '/' + parts[1] : href;
                            const name = modelLink.textContent.trim();
                            const rowText = row.textContent.trim();

                            const tokensMatch = rowText.match(/([\\d,.]+)\\s*([TBMK])\\s*tokens?/i);
                            const trendMatch = rowText.match(/([+-]?\\d+\\.?\\d*%)/);

                            results.push({
                                rank: index + 1,
                                slug: slug,
                                name: name,
                                usage_tokens: parseUsage(tokensMatch),
                                usage_display: tokensMatch ? tokensMatch[0] : '',
                                trend: trendMatch ? trendMatch[1] : '',
                                method: 'table',
                            });
                        });
                        return results;
                    }

                    // 策略 C: 提取所有看起来像排名行的 div
                    const allDivs = document.querySelectorAll('div[class*="row"], div[class*="item"], div[class*="card"]');
                    allDivs.forEach(div => {
                        const link = div.querySelector('a[href*="/"]');
                        if (!link) return;
                        const href = link.getAttribute('href') || '';
                        const parts = href.split('/').filter(Boolean);
                        if (parts.length !== 2) return;
                        const name = link.textContent.trim();
                        if (!name || name.length < 3) return;
                        const text = div.textContent.trim();
                        const tokensMatch = text.match(/([\\d,.]+)\\s*([TBMK])\\s*tokens?/i);

                        // 去重
                        if (results.some(r => r.slug === parts[0] + '/' + parts[1])) return;

                        results.push({
                            rank: results.length + 1,
                            slug: parts[0] + '/' + parts[1],
                            name: name,
                            usage_tokens: parseUsage(tokensMatch),
                            usage_display: tokensMatch ? tokensMatch[0] : '',
                            trend: '',
                            method: 'div-fallback',
                        });
                    });

                    if (results.length === 0) {
                        // 策略 D: 纯链接提取
                        const allLinks = document.querySelectorAll('a[href*="/"]');
                        const seen = new Set();
                        allLinks.forEach(link => {
                            const href = link.getAttribute('href') || '';
                            const parts = href.split('/').filter(Boolean);
                            if (parts.length !== 2) return;
                            const slug = parts[0] + '/' + parts[1];
                            if (seen.has(slug)) return;
                            seen.add(slug);
                            const name = link.textContent.trim();
                            if (!name || name.length < 2) return;
                            results.push({
                                rank: results.length + 1,
                                slug: slug,
                                name: name,
                                usage_tokens: null,
                                usage_display: '',
                                trend: '',
                                method: 'link-only',
                            });
                        });
                    }

                    return results;

                    function parseUsage(match) {
                        if (!match) return null;
                        const num = parseFloat(match[1].replace(/,/g, ''));
                        const unit = match[2].toUpperCase();
                        const multipliers = { 'T': 1e12, 'B': 1e9, 'M': 1e6, 'K': 1e3 };
                        return num * (multipliers[unit] || 1);
                    }
                }
            """)

            print(f"  ✅ 提取到 {len(rankings)} 条排名数据")
            if rankings:
                methods = {}
                for r in rankings:
                    m = r.get("method", "unknown")
                    methods[m] = methods.get(m, 0) + 1
                print(f"  📊 提取方式分布: {methods}")
                print(f"  📊 有使用量数据的: {sum(1 for r in rankings if r.get('usage_tokens'))}")
                # 显示前 3 名
                for r in rankings[:3]:
                    print(f"     #{r['rank']} {r['name']} - {r['usage_display']}")

            # 清理方法字段（前端不需要）
            for r in rankings:
                if "method" in r:
                    del r["method"]

            return rankings

        except Exception as e:
            print(f"  ❌ 爬取排名时出错: {e}")
            # 尝试截图保存
            try:
                page.screenshot(path="/tmp/rankings-error.png")
                print("  📸 已保存截图到 /tmp/rankings-error.png")
            except Exception:
                pass
            return []

        finally:
            browser.close()
