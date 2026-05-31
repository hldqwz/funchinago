"""
从 Groq API 获取模型列表和定价
接口: GET https://api.groq.com/openai/v1/models
需要 API Key（可从环境变量 GROQ_API_KEY 读取）
免费账号有速率限制
"""

import os
import requests

API_URL = "https://api.groq.com/openai/v1/models"


def fetch_models() -> list[dict]:
    """
    获取 Groq 的所有可用模型及定价。
    Groq API 是 OpenAI 兼容格式。
    """
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        print("  ⚠️ 未设置 GROQ_API_KEY，跳过 Groq 数据抓取")
        print("  💡 免费注册: https://console.groq.com/keys")
        return []

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }

    resp = requests.get(API_URL, headers=headers, timeout=30)
    if resp.status_code == 401:
        print("  ❌ Groq API Key 无效")
        return []
    resp.raise_for_status()

    data = resp.json()
    models = data.get("data", [])

    result = []
    for m in models:
        pricing = m.get("pricing", {})
        result.append({
            "id": m.get("id", ""),
            "name": m.get("id", ""),
            "object": m.get("object", ""),
            "created": m.get("created", 0),
            "owned_by": m.get("owned_by", ""),
            "pricing": {
                "prompt": str(pricing.get("prompt", 0)),
                "completion": str(pricing.get("completion", 0)),
                "prompt_per_m": float(pricing.get("prompt", 0)) * 1_000_000 if pricing.get("prompt", 0) else 0,
                "completion_per_m": float(pricing.get("completion", 0)) * 1_000_000 if pricing.get("completion", 0) else 0,
            },
            "context_length": m.get("context_window", 0) or m.get("max_context_length", 0) or 0,
        })

    print(f"  ✅ Groq: {len(result)} 个模型")
    if api_key:
        print(f"  🔑 已使用 API Key ({api_key[:8]}...)")
    return result
