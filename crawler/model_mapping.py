"""
跨平台模型匹配引擎
将 OpenRouter、Together AI、硅基流动 的模型按规范名称归并。

匹配策略：
  1. 手动维护的已知映射表 (CANONICAL_MAP) — 唯一用于跨平台合并
  2. 不在映射表中的模型直接用原始 ID 做 key
"""

# ── 手动映射表：{ canonical_key: { platform: platform_model_id } } ──
# canonical_key 是统一标识，用于跨平台合并。
# 格式统一为小写，用短横线连接。
CANONICAL_MAP: dict[str, dict[str, str]] = {
    # ── DeepSeek ──
    "deepseek-v4-flash": {
        "openrouter": "deepseek/deepseek-v4-flash",
    },
    "deepseek-v4-pro": {
        "openrouter": "deepseek/deepseek-v4-pro",
        "together": "deepseek-ai/DeepSeek-V4-Pro",
    },
    "deepseek-v3": {
        "openrouter": "deepseek/deepseek-v3",
        "together": "deepseek-ai/DeepSeek-V3",
    },
    "deepseek-r1": {
        "openrouter": "deepseek/deepseek-r1",
        "together": "deepseek-ai/DeepSeek-R1",
    },
    "deepseek-coder-v2": {
        "openrouter": "deepseek/deepseek-coder-v2",
    },

    # ── Claude ──
    "claude-sonnet-4": {
        "openrouter": "anthropic/claude-sonnet-4",
    },
    "claude-opus-4": {
        "openrouter": "anthropic/claude-opus-4",
    },
    "claude-haiku-4": {
        "openrouter": "anthropic/claude-3-5-haiku",
    },

    # ── GPT ──
    "gpt-4o": {
        "openrouter": "openai/gpt-4o",
    },
    "gpt-4o-mini": {
        "openrouter": "openai/gpt-4o-mini",
    },
    "gpt-4-1": {
        "openrouter": "openai/gpt-4-1",
    },
    "o3-mini": {
        "openrouter": "openai/o3-mini",
    },
    "gpt-oss-120b": {
        "together": "NousResearch/GPT-OSS-120B",
    },

    # ── Qwen ──
    "qwen3-7b-max": {
        "openrouter": "qwen/qwen3-7b-max",
        "together": "Qwen/Qwen3.7-Max",
    },
    "qwen3-6-plus": {
        "openrouter": "qwen/qwen3-6-plus",
        "together": "Qwen/Qwen3.6-Plus",
    },
    "qwen3-coder": {
        "openrouter": "qwen/qwen3-coder",
    },
    "qwen3-9b": {
        "together": "Qwen/Qwen3.5-9B",
    },

    # ── Llama ──
    "llama-4-maverick": {
        "openrouter": "meta-llama/llama-4-maverick",
        "together": "meta-llama/Llama-4-Maverick-17B-128E-Instruct",
    },
    "llama-4-scout": {
        "openrouter": "meta-llama/llama-4-scout",
        "together": "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    },
    "llama-3-3-70b": {
        "openrouter": "meta-llama/llama-3-3-70b-instruct",
        "together": "meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo",
    },

    # ── Mistral ──
    "mistral-large": {
        "openrouter": "mistralai/mistral-large",
    },
    "mistral-small-3-1": {
        "together": "mistralai/Mistral-Small-3.1-24B-Instruct-2503",
    },

    # ── Gemma ──
    "gemma-4-31b": {
        "together": "google/gemma-4-31B-it",
    },
    "gemma-4-26b": {
        "together": "google/gemma-4-26B-A4B-it",
    },

    # ── GLM ──
    "glm-5": {
        "openrouter": "glm/glm-5",
        "together": "glm/GLM-5",
    },

    # ── Kimi ──
    "kimi-k2-6": {
        "openrouter": "moonshot/kimi-k2-6",
        "together": "moonshot/Kimi-K2.5",
    },

    # ── MiniMax ──
    "minimax-m2-7": {
        "together": "minimax/MiniMax-M2.7",
    },

    # ── Grok ──
    "grok-3": {
        "openrouter": "x-ai/grok-3",
    },

    # ── Gemini ──
    "gemini-3-pro": {
        "openrouter": "google/gemini-3-pro",
    },
    "gemini-3-flash": {
        "openrouter": "google/gemini-3-flash",
    },
    "gemma-3-27b": {
        "openrouter": "google/gemma-3-27b-it",
    },
}


def normalize_id(model_id: str) -> str:
    """标准化模型 ID 用于匹配：转小写、去多余空格"""
    return model_id.strip().lower()


def match_to_canonical(models_openrouter: list[dict],
                       models_together: list[dict],
                       models_siliconflow: list[dict]) -> list[dict]:
    """
    将三个平台的模型列表合并为标准格式。

    返回合并后的模型列表，每项包含 platforms 字典。
    策略：CANONICAL_MAP 优先级最高用于跨平台匹配；
          不在映射表中的模型直接用原始 ID 做 key，不做模糊匹配，
          避免错误覆盖。
    """
    # 建立各平台的 ID→模型查找表
    or_index = {normalize_id(m["id"]): m for m in models_openrouter}
    tj_index = {normalize_id(m["id"]): m for m in models_together}
    sf_index = {normalize_id(m["id"]): m for m in models_siliconflow}

    # 建立反向索引：canonical_key → (platform → model_id)
    # 只用于跨平台合并，不参与纯 OpenRouter 模型的 key 生成
    platform_by_canonical: dict[str, dict[str, str]] = {}
    for canon_key, platforms in CANONICAL_MAP.items():
        platform_by_canonical[canon_key] = {}
        for platform, platform_id in platforms.items():
            platform_by_canonical[canon_key][platform] = platform_id

    # 建立反向：platform_id → canonical_key
    canonical_by_platform_id: dict[str, str] = {}
    for canon_key, platforms in CANONICAL_MAP.items():
        for platform, platform_id in platforms.items():
            norm_id = normalize_id(platform_id)
            canonical_by_platform_id[norm_id] = canon_key

    matched: dict[str, dict] = {}  # canonical_key → merged model
    seen_ids: set[str] = set()  # 避免重复处理同一模型

    # 处理所有模型：先精确映射，再回退到原始 ID
    for m in models_openrouter:
        mid = normalize_id(m["id"])
        canon_key = canonical_by_platform_id.get(mid)

        if not canon_key:
            # 不在映射表中的：直接用原始 ID（转义后）作为 key
            canon_key = mid.replace("/", "-").replace(".", "-").replace(":", "-")

        if canon_key not in matched:
            matched[canon_key] = {
                "canonical_name": canon_key,
                "name": m.get("name", m["id"]),
                "description": m.get("description", ""),
                "platforms": {},
            }

        # 只在首次遇到时赋值，避免被同名 key 覆盖
        if "openrouter" not in matched[canon_key]["platforms"]:
            matched[canon_key]["platforms"]["openrouter"] = _or_to_platform(m)
            seen_ids.add(mid)

    # 处理 Together AI 和 硅基流动 的模型
    # 先通过 CANONICAL_MAP 匹配已有的 canonical key
    # 匹配不到的创建新条目
    for platform_name, models_list in [("together", models_together), ("siliconflow", models_siliconflow)]:
        for m in models_list:
            mid = normalize_id(m["id"])
            canon_key = canonical_by_platform_id.get(mid)

            if not canon_key:
                # 尝试模糊匹配已有 canonical key
                for existing_key in list(matched.keys()):
                    if mid.endswith(existing_key) or existing_key.endswith(mid.replace("/", "-")):
                        canon_key = existing_key
                        break

            if not canon_key:
                # 创建新条目
                canon_key = mid.replace("/", "-").replace(".", "-").replace(":", "-")

            if canon_key not in matched:
                matched[canon_key] = {
                    "canonical_name": canon_key,
                    "name": m.get("name", m["id"]),
                    "description": "",
                    "platforms": {},
                }

            plat_key = "together" if platform_name == "together" else "siliconflow"
            if plat_key not in matched[canon_key]["platforms"]:
                if platform_name == "together":
                    matched[canon_key]["platforms"]["together"] = _tj_to_platform(m)
                else:
                    matched[canon_key]["platforms"]["siliconflow"] = _sf_to_platform(m)

    result = list(matched.values())
    result.sort(key=lambda x: (
        "openrouter" not in x["platforms"],
        -(x["platforms"].get("openrouter", {}).get("rank") or 9999),
        x["canonical_name"],
    ))

    return result


def _or_to_platform(m: dict) -> dict:
    """OpenRouter 模型 → 平台标准格式"""
    return {
        "model_id": m.get("id", ""),
        "pricing": m.get("pricing", {}),
        "context_length": m.get("context_length", 0),
        "architecture": m.get("architecture", {}),
        "top_provider": m.get("top_provider", {}),
        "rank": m.get("rank"),
        "usage_tokens": m.get("usage_tokens"),
        "trend": m.get("trend"),
        "usage_display": m.get("usage_display", ""),
    }


def _tj_to_platform(m: dict) -> dict:
    """Together AI 模型 → 平台标准格式"""
    pricing = m.get("pricing", {})
    return {
        "model_id": m.get("id", ""),
        "pricing": {
            "prompt": str(pricing.get("input", 0)),
            "completion": str(pricing.get("output", 0)),
            "cached_input": str(pricing.get("cached_input", 0)),
            # Together 的 input/output 已经是 每百万token 价格
            "prompt_per_m": pricing.get("input", 0),
            "completion_per_m": pricing.get("output", 0),
        },
        "context_length": m.get("context_length", 0),
        "organization": m.get("organization", ""),
    }


def _sf_to_platform(m: dict) -> dict:
    """硅基流动模型 → 平台标准格式"""
    pricing = m.get("pricing", {})
    return {
        "model_id": m.get("id", ""),
        "pricing": {
            "prompt": pricing.get("prompt", "0"),
            "completion": pricing.get("completion", "0"),
            "prompt_per_m": pricing.get("prompt_per_m", 0),
            "completion_per_m": pricing.get("completion_per_m", 0),
        },
        "context_length": m.get("context_length", 0),
        "owned_by": m.get("owned_by", ""),
    }
