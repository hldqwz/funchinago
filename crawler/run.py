"""
LLM Rankings 数据爬虫 — 主入口
运行:
  python3 crawler/run.py              # 全量爬取
  python3 crawler/run.py --rankings-only  # 仅更新排名（每日）

数据来源：OpenRouter + 硅基流动 + 阿里百炼 + Fireworks + Groq
输出: src/data/models.json
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).parent))

from crawl_models import fetch_model_metadata
from crawl_rankings import scrape_rankings
from crawl_groq import fetch_models as fetch_groq_models
from crawl_siliconflow import fetch_models as fetch_siliconflow_models
from crawl_bailian import fetch_models as fetch_bailian_models
from crawl_fireworks import fetch_models as fetch_fireworks_models
from model_mapping import match_to_canonical

OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data"
OUTPUT_PATH = OUTPUT_DIR / "models.json"


def merge_rankings(models_or: list[dict], rankings: list[dict]) -> list[dict]:
    rank_map = {}
    for r in rankings:
        slug = r.get("slug", "")
        if slug:
            rank_map[slug] = r

    matched_count = 0
    for m in models_or:
        mid = m.get("id", "")
        rank_data = rank_map.get(mid)
        if not rank_data:
            norm = mid.replace("/", "-").lower().strip()
            for slug, data in rank_map.items():
                slug_norm = slug.replace("/", "-").lower().strip()
                if norm == slug_norm or norm.endswith(slug_norm) or slug_norm.endswith(norm):
                    rank_data = data
                    break

        if rank_data:
            m["rank"] = rank_data.get("rank")
            m["usage_tokens"] = rank_data.get("usage_tokens")
            m["trend"] = rank_data.get("trend")
            matched_count += 1

    print(f"  ✅ 成功匹配 {matched_count}/{len(rankings)} 条排名")
    return models_or


def save_output(merged: list[dict], stats: dict):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_data = {
        "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_models": len(merged),
        "ranked_models": sum(1 for m in merged if m.get("platforms", {}).get("openrouter", {}).get("rank")),
        "platform_stats": stats,
        "models": merged,
    }
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"  ✅ 完成! 输出: {OUTPUT_PATH}")
    print(f"  📊 共 {output_data['total_models']} 个模型组")
    for name, count in sorted(stats.items()):
        if name != "multi_platform":
            print(f"     {name:>14}: {count:>4} 个")
    print(f"     跨平台重叠:   {stats.get('multi_platform', 0):>4} 个")
    print(f"     有排名数据:   {output_data['ranked_models']:>4} 个")
    print(f"{'=' * 60}")


def rankings_only():
    """每日模式：仅更新 OpenRouter 排名，保留其他平台数据不变"""
    print("=" * 60)
    print("  每日排名更新")
    print("=" * 60)

    # 1. 获取 OpenRouter 最新模型列表
    print("[1/3] OpenRouter API — 获取模型元数据...")
    try:
        models_or = fetch_model_metadata()
        print(f"  ✅ {len(models_or)} 个模型")
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        sys.exit(1)

    # 2. 爬取排名
    print("\n[2/3] OpenRouter Rankings — 爬取排名...")
    try:
        rankings = scrape_rankings()
        print(f"  ✅ {len(rankings)} 条排名")
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        sys.exit(1)

    models_or = merge_rankings(models_or, rankings)

    # 3. 加载现有数据，只替换 OpenRouter 部分
    print("\n[3/3] 合并到现有数据...")
    existing = {}
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)

    # 构建 OpenRouter 的查找表
    or_index = {m.get("id", "").lower().strip(): m for m in models_or}

    # 更新现有模型
    updated = []
    or_count = 0
    for model in existing.get("models", []):
        or_data = model.get("platforms", {}).get("openrouter")
        if or_data:
            or_id = or_data.get("model_id", "").lower().strip()
            new_or = or_index.get(or_id)
            if new_or:
                model["platforms"]["openrouter"]["rank"] = new_or.get("rank")
                model["platforms"]["openrouter"]["usage_tokens"] = new_or.get("usage_tokens")
                model["platforms"]["openrouter"]["trend"] = new_or.get("trend")
                model["platforms"]["openrouter"]["pricing"] = new_or.get("pricing", {})
                or_count += 1
        updated.append(model)

    # 添加新出现的 OpenRouter 模型
    existing_ids = set()
    for m in updated:
        od = m.get("platforms", {}).get("openrouter", {})
        if od:
            existing_ids.add(od.get("model_id", "").lower().strip())

    new_count = 0
    for m in models_or:
        mid = m.get("id", "").lower().strip()
        if mid not in existing_ids:
            canon_key = mid.replace("/", "-").replace(".", "-").replace(":", "-")
            updated.append({
                "canonical_name": canon_key,
                "name": m.get("name", m["id"]),
                "description": m.get("description", ""),
                "platforms": {
                    "openrouter": {
                        "model_id": m.get("id", ""),
                        "pricing": m.get("pricing", {}),
                        "context_length": m.get("context_length", 0),
                        "architecture": m.get("architecture", {}),
                        "top_provider": m.get("top_provider", {}),
                        "rank": m.get("rank"),
                        "usage_tokens": m.get("usage_tokens"),
                        "trend": m.get("trend"),
                    }
                }
            })
            existing_ids.add(mid)
            new_count += 1

    print(f"  ✅ 更新 {or_count} 个, 新增 {new_count} 个")

    stats = existing.get("platform_stats", {})
    stats["openrouter"] = len(models_or)
    stats["multi_platform"] = sum(1 for m in updated if len(m.get("platforms", {})) >= 2)
    save_output(updated, stats)


def full_crawl():
    """周度模式：全平台爬取"""
    print("=" * 60)
    print("  全球大模型调用排名 — 数据爬虫 v3")
    print("  数据源: OpenRouter + 硅基流动 + 阿里百炼 + Fireworks")
    print("=" * 60)

    # 1. OpenRouter
    print("[1/5] OpenRouter API — 获取模型元数据...")
    try:
        models_or = fetch_model_metadata()
        print(f"  ✅ {len(models_or)} 个模型")
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        models_or = []

    # 2. Rankings
    print("\n[2/5] OpenRouter Rankings — 爬取排名...")
    try:
        rankings = scrape_rankings()
        print(f"  ✅ {len(rankings)} 条排名")
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        rankings = []

    models_or = merge_rankings(models_or, rankings)

    # 3. 硅基流动
    print("\n[3/5] 硅基流动 API...")
    try:
        models_sf = fetch_siliconflow_models()
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        models_sf = []

    # 4. 阿里百炼
    print("\n[4/5] 阿里百炼 API...")
    try:
        models_bl = fetch_bailian_models()
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        models_bl = []

    # 5. Fireworks
    print("\n[5/5] Fireworks API...")
    try:
        models_fw = fetch_fireworks_models()
    except Exception as e:
        print(f"  ❌ 失败: {e}")
        models_fw = []

    # 合并
    print("\n正在跨平台匹配...")
    merged = match_to_canonical(models_or, [], models_sf, models_bl, models_fw)

    stats = {
        "openrouter": sum(1 for m in merged if "openrouter" in m["platforms"]),
        "groq": sum(1 for m in merged if "groq" in m["platforms"]),
        "siliconflow": sum(1 for m in merged if "siliconflow" in m["platforms"]),
        "bailian": sum(1 for m in merged if "bailian" in m["platforms"]),
        "fireworks": sum(1 for m in merged if "fireworks" in m["platforms"]),
        "multi_platform": sum(1 for m in merged if len(m["platforms"]) >= 2),
    }
    save_output(merged, stats)


if __name__ == "__main__":
    if "--rankings-only" in sys.argv:
        rankings_only()
    else:
        full_crawl()
