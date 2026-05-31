"""
从阿里百炼 DashScope API 获取模型列表
接口: GET https://dashscope.aliyuncs.com/compatible-mode/v1/models
需要 API Key（从环境变量 DASHSCOPE_API_KEY 读取）
"""

import os
import requests

API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/models"


def fetch_models() -> list[dict]:
    api_key = os.environ.get("DASHSCOPE_API_KEY", "")
    if not api_key:
        print("  ⚠️ 未设置 DASHSCOPE_API_KEY，跳过百炼数据")
        return []

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }

    resp = requests.get(API_URL, headers=headers, timeout=30)
    if resp.status_code == 401:
        print("  ❌ 百炼 API Key 无效")
        return []
    resp.raise_for_status()

    data = resp.json()
    models = data.get("data", [])

    result = []
    for m in models:
        result.append({
            "id": m.get("id", ""),
            "name": m.get("id", ""),
            "object": m.get("object", ""),
            "created": m.get("created", 0),
            "owned_by": m.get("owned_by", ""),
        })

    print(f"  ✅ 阿里百炼: {len(result)} 个模型")
    print(f"  🔑 已使用 API Key ({api_key[:8]}...)")
    return result
