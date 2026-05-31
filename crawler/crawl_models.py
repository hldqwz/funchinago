"""
从 OpenRouter REST API 获取模型元数据
接口: GET https://openrouter.ai/api/v1/models
无需认证即可获取公开模型列表
"""

import requests

OPENROUTER_API = "https://openrouter.ai/api/v1/models"


def fetch_model_metadata() -> list[dict]:
    """
    获取所有可用模型的元数据。
    返回字段包括: id, name, description, context_length,
                 architecture, pricing, top_provider 等
    """
    headers = {
        "User-Agent": "LLM-Rankings-Crawler/1.0",
        "Accept": "application/json",
    }

    resp = requests.get(OPENROUTER_API, headers=headers, timeout=30)
    resp.raise_for_status()

    data = resp.json()
    models = data.get("data", [])

    # 只保留我们关心的字段，减小 JSON 体积
    slim = []
    for m in models:
        slim.append({
            "id": m.get("id", ""),
            "name": m.get("name", ""),
            "description": m.get("description", ""),
            "context_length": m.get("context_length", 0),
            "architecture": {
                "modality": m.get("architecture", {}).get("modality", ""),
                "tokenizer": m.get("architecture", {}).get("tokenizer", ""),
            },
            "pricing": {
                "prompt": m.get("pricing", {}).get("prompt", "0"),
                "completion": m.get("pricing", {}).get("completion", "0"),
                "image": m.get("pricing", {}).get("image", "0"),
                "request": m.get("pricing", {}).get("request", "0"),
            },
            "top_provider": {
                "name": m.get("top_provider", {}).get("name", ""),
                "context_length": m.get("top_provider", {}).get("context_length", 0),
                "max_completion_tokens": m.get("top_provider", {}).get("max_completion_tokens"),
            },
        })

    return slim
