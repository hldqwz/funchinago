"""
从 Together AI API 获取模型列表和定价
接口: GET https://api.together.xyz/v1/models
需要 API Key（可从环境变量 TOGETHER_API_KEY 读取）
免费注册送 $25 credit，无需绑卡
"""

import os
import requests

API_URL = "https://api.together.xyz/v1/models"


def fetch_models() -> list[dict]:
    """
    获取 Together AI 的所有可用模型，返回精简数据。
    Together AI 的 pricing 字段中 input/output 已是 每百万token 价格（美元）。
    """
    api_key = os.environ.get("TOGETHER_API_KEY", "")
    if not api_key:
        print("  ⚠️ 未设置 TOGETHER_API_KEY，跳过 Together AI 数据抓取")
        print("  💡 免费注册: https://api.together.ai/settings/api-keys")
        return []

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }

    resp = requests.get(API_URL, headers=headers, timeout=30)
    if resp.status_code == 401:
        print("  ❌ Together AI API Key 无效")
        return []
    resp.raise_for_status()

    data = resp.json()
    models = data if isinstance(data, list) else data.get("data", [])

    result = []
    for m in models:
        pricing = m.get("pricing", {})
        result.append({
            "id": m.get("id", ""),
            "name": m.get("display_name", m.get("id", "")),
            "type": m.get("type", "chat"),
            "organization": m.get("organization", ""),
            "context_length": m.get("context_length", 0),
            "pricing": {
                "input": pricing.get("input", 0),
                "output": pricing.get("output", 0),
                "cached_input": pricing.get("cached_input", 0),
            },
        })

    print(f"  ✅ Together AI: {len(result)} 个模型")
    if api_key:
        print(f"  🔑 已使用 API Key ({api_key[:8]}...)")
    return result
