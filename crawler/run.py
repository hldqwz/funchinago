"""
OpenRouter 数据爬虫 — 主入口（三平台版）
运行: python3 crawler/run.py
输出: src/data/models.json

数据来源：
  - OpenRouter REST API → 355+ 模型元数据 + 排名页爬取
  - Together AI API → 200+ 模型及定价
  - 硅基流动 API → 200+ 模型及定价
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone

# 添加 crawler 目录到路径
sys.path.insert(0, str(Path(__file__).parent))

from crawl_models import fetch_model_metadata
from crawl_rankings import scrape_rankings
from crawl_together import fetch_models as fetch_together_models
from crawl_siliconflow import fetch_models as fetch_siliconflow_models
from model_mapping import match_to_canonical


def merge_rankings(models_or: list[dict], rankings: list[dict]) -> list[dict]:
    """将排名合并到 OpenRouter 模型数据中（增强匹配）"""
    rank_map = {}
    for r in rankings:
        slug = r.get("slug", "")
        if slug:
            rank_map[slug] = r

    print(f"  📋 排名 slugs: {[r.get('slug') for r in rankings]}")

    matched_count = 0
    for m in models_or:
        mid = m.get("id", "")
        # 精确匹配
        rank_data = rank_map.get(mid)
        # 如果精确匹配不到，尝试各种格式
        if not rank_data:
            # 尝试标准化匹配（去掉大小写差异、特殊字符）
            norm = mid.replace("/", "-").lower().strip()
            for slug, data in rank_map.items():
                slug_norm = slug.replace("/", "-").lower().strip()
                if norm == slug_norm or norm.endswith(slug_norm) or slug_norm.endswith(norm):
                    rank_data = data
                    print(f"  🔗 模糊匹配: '{mid}' → '{slug}'")
                    break

        if rank_data:
            m["rank"] = rank_data.get("rank")
            m["usage_tokens"] = rank_data.get("usage_tokens")
            m["trend"] = rank_data.get("trend")
            matched_count += 1

    print(f"  ✅ 成功匹配 {matched_count}/{len(rankings)} 条排名")
    return models_or


def main():
    print("=" * 60)
    print("  全球大模型调用排名 — 数据爬虫 v2")
    print("  数据源: OpenRouter + Together AI + 硅基流动")
    print("=" * 60)

    # 带 API Key 的环境变量提示
    if not os.environ.get("TOGETHER_API_KEY"):
        print("\n💡 设置 TOGETHER_API_KEY 可获取 Together AI 数据")
        print("   注册: https://api.together.ai/settings/api-keys")
    if not os.environ.get("SILICONFLOW_API_KEY"):
        print("💡 设置 SILICONFLOW_API_KEY 可获取硅基流动数据")
        print("   注册: https://siliconflow.cn")
    print()

    # 1. OpenRouter 元数据
    print("[1/5] OpenRouter API — 获取模型元数据...")
    try:
        models_or = fetch_model_metadata()
        print(f"  ✅ {len(models_or)} 个模型")
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        models_or = []

    # 2. OpenRouter 排名
    print("\n[2/5] OpenRouter Rankings — 爬取排名数据...")
    try:
        rankings = scrape_rankings()
        print(f"  ✅ {len(rankings)} 条排名")
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        print("  💡 需要 playwright install chromium")
        rankings = []

    # 合并排名到 OR 数据
    models_or = merge_rankings(models_or, rankings)

    # 3. Together AI
    print("\n[3/5] Together AI API — 获取模型及定价...")
    try:
        models_tj = fetch_together_models()
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        models_tj = []

    # 4. 硅基流动
    print("\n[4/5] 硅基流动 API — 获取模型及定价...")
    try:
        models_sf = fetch_siliconflow_models()
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        models_sf = []

    # 5. 跨平台匹配 & 合并
    print("\n[5/5] 正在跨平台匹配模型...")
    merged = match_to_canonical(models_or, models_tj, models_sf)

    # 统计数据
    on_or = sum(1 for m in merged if "openrouter" in m["platforms"])
    on_tj = sum(1 for m in merged if "together" in m["platforms"])
    on_sf = sum(1 for m in merged if "siliconflow" in m["platforms"])
    multi = sum(1 for m in merged if len(m["platforms"]) >= 2)

    total_on_any = len(merged)

    # 写出 JSON
    output_dir = Path(__file__).parent.parent / "src" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "models.json"

    output_data = {
        "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_models": total_on_any,
        "ranked_models": sum(1 for m in merged if m.get("platforms", {}).get("openrouter", {}).get("rank")),
        "platform_stats": {
            "openrouter": on_or,
            "together": on_tj,
            "siliconflow": on_sf,
            "multi_platform": multi,
        },
        "models": merged,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"  ✅ 完成! 输出: {output_path}")
    print(f"  📊 共 {total_on_any} 个模型组")
    print(f"     OpenRouter:   {on_or:>4} 个")
    print(f"     Together AI:  {on_tj:>4} 个")
    print(f"     硅基流动:     {on_sf:>4} 个")
    print(f"     跨平台重叠:   {multi:>4} 个")
    print(f"     有排名数据:   {output_data['ranked_models']:>4} 个")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
