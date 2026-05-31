"""
跨平台模型匹配引擎
将 OpenRouter、Groq、硅基流动 的模型按规范名称归并。

匹配策略：
  1. 手动维护的已知映射表 (CANONICAL_MAP) — 唯一用于跨平台合并
  2. 不在映射表中的模型直接用原始 ID 做 key
"""

# ── 手动映射表：{ canonical_key: { platform: platform_model_id } } ──
CANONICAL_MAP: dict[str, dict[str, str]] = {
    # ── DeepSeek ──
    "deepseek-v4-flash": {
        "openrouter": "deepseek/deepseek-v4-flash",
    },
    "deepseek-v4-pro": {
        "openrouter": "deepseek/deepseek-v4-pro",
    },
    "deepseek-v3": {
        "openrouter": "deepseek/deepseek-v3",
    },
    "deepseek-r1": {
        "openrouter": "deepseek/deepseek-r1",
    },
    "deepseek-coder-v2": {
        "openrouter": "deepseek/deepseek-coder-v2",
    },

    # ── Claude ──
    "claude-sonnet-4-6": {
        "openrouter": "anthropic/claude-sonnet-4-6",
    },
    "claude-opus-4-7": {
        "openrouter": "anthropic/claude-opus-4.7",
    },
    "claude-haiku-4-5": {
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

    # ── Qwen ──
    "qwen3-7b-max": {
        "openrouter": "qwen/qwen3-7b-max",
    },
    "qwen3-coder": {
        "openrouter": "qwen/qwen3-coder",
    },

    # ── Llama ──
    "llama-4-maverick": {
        "openrouter": "meta-llama/llama-4-maverick",
    },
    "llama-4-scout": {
        "openrouter": "meta-llama/llama-4-scout",
    },
    "llama-3-3-70b": {
        "openrouter": "meta-llama/llama-3-3-70b-instruct",
    },

    # ── Mistral ──
    "mistral-large": {
        "openrouter": "mistralai/mistral-large",
    },

    # ── GLM ──
    "glm-5": {
        "openrouter": "glm/glm-5",
    },

    # ── Kimi ──
    "kimi-k2-6": {
        "openrouter": "moonshot/kimi-k2-6",
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
                       models_groq: list[dict],
                       models_siliconflow: list[dict],
                       models_bailian: list[dict],
                       models_fireworks: list[dict]) -> list[dict]:
    """
    将四个平台的模型列表合并为标准格式。

    返回合并后的模型列表，每项包含 platforms 字典。
    """
    or_index = {normalize_id(m["id"]): m for m in models_openrouter}
    gr_index = {normalize_id(m["id"]): m for m in models_groq}
    sf_index = {normalize_id(m["id"]): m for m in models_siliconflow}
    bl_index = {normalize_id(m["id"]): m for m in models_bailian}

    platform_by_canonical: dict[str, dict[str, str]] = {}
    for canon_key, platforms in CANONICAL_MAP.items():
        platform_by_canonical[canon_key] = {}
        for platform, platform_id in platforms.items():
            platform_by_canonical[canon_key][platform] = platform_id

    canonical_by_platform_id: dict[str, str] = {}
    for canon_key, platforms in CANONICAL_MAP.items():
        for platform, platform_id in platforms.items():
            norm_id = normalize_id(platform_id)
            canonical_by_platform_id[norm_id] = canon_key

    matched: dict[str, dict] = {}
    seen_ids: set[str] = set()

    for m in models_openrouter:
        mid = normalize_id(m["id"])
        canon_key = canonical_by_platform_id.get(mid)

        if not canon_key:
            canon_key = mid.replace("/", "-").replace(".", "-").replace(":", "-")

        if canon_key not in matched:
            matched[canon_key] = {
                "canonical_name": canon_key,
                "name": m.get("name", m["id"]),
                "description": m.get("description", ""),
                "platforms": {},
            }

        if "openrouter" not in matched[canon_key]["platforms"]:
            matched[canon_key]["platforms"]["openrouter"] = _or_to_platform(m)
            seen_ids.add(mid)

    platform_handlers = [
        ("groq", models_groq, _groq_to_platform),
        ("siliconflow", models_siliconflow, _sf_to_platform),
        ("bailian", models_bailian, _bailian_to_platform),
        ("fireworks", models_fireworks, _fw_to_platform),
    ]
    for platform_name, models_list, to_platform_fn in platform_handlers:
        for m in models_list:
            mid = normalize_id(m["id"])
            canon_key = canonical_by_platform_id.get(mid)

            if not canon_key:
                for existing_key in list(matched.keys()):
                    if mid.endswith(existing_key) or existing_key.endswith(mid.replace("/", "-")):
                        canon_key = existing_key
                        break

            if not canon_key:
                canon_key = mid.replace("/", "-").replace(".", "-").replace(":", "-")

            if canon_key not in matched:
                matched[canon_key] = {
                    "canonical_name": canon_key,
                    "name": m.get("name", m["id"]),
                    "description": "",
                    "platforms": {},
                }

            if platform_name not in matched[canon_key]["platforms"]:
                matched[canon_key]["platforms"][platform_name] = to_platform_fn(m)

    result = list(matched.values())
    result.sort(key=lambda x: (
        "openrouter" not in x["platforms"],
        -(x["platforms"].get("openrouter", {}).get("rank") or 9999),
        x["canonical_name"],
    ))

    return result


def _or_to_platform(m: dict) -> dict:
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


def _groq_to_platform(m: dict) -> dict:
    pricing = m.get("pricing", {})
    return {
        "model_id": m.get("id", ""),
        "pricing": {
            "prompt": str(pricing.get("prompt", 0)),
            "completion": str(pricing.get("completion", 0)),
            "prompt_per_m": pricing.get("prompt_per_m", 0),
            "completion_per_m": pricing.get("completion_per_m", 0),
        },
        "context_length": m.get("context_length", 0),
        "owned_by": m.get("owned_by", ""),
    }


def _sf_to_platform(m: dict) -> dict:
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


def _bailian_to_platform(m: dict) -> dict:
    return {
        "model_id": m.get("id", ""),
        "pricing": {},
        "context_length": 0,
        "owned_by": m.get("owned_by", ""),
    }


def _fw_to_platform(m: dict) -> dict:
    return {
        "model_id": m.get("id", ""),
        "pricing": {},
        "context_length": m.get("context_length", 0),
        "owned_by": m.get("owned_by", ""),
    }
