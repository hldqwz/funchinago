"""
从硅基流动 (SiliconFlow) API 获取模型列表和定价
接口: GET https://api.siliconflow.cn/v1/models
需要 API Key（可从环境变量 SILICONFLOW_API_KEY 读取）
免费包含大量模型额度
"""

import os
import requests

API_URL = "https://api.siliconflow.cn/v1/models"


def fetch_models() -> list[dict]:
    """
    获取硅基流动的所有可用模型及定价。
    SiliconFlow 返回的 pricing 字段中 prompt/completion 为 每token 价格（美元），需换算。
    """
    api_key = os.environ.get("SILICONFLOW_API_KEY", "")
    if not api_key:
        print("  ⚠️ 未设置 SILICONFLOW_API_KEY，跳过硅基流动数据抓取")
        print("  💡 注册: https://siliconflow.cn 获取免费额度")
        return []

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }

    resp = requests.get(API_URL, headers=headers, timeout=30)
    if resp.status_code == 401:
        print("  ❌ SiliconFlow API Key 无效")
        return []
    resp.raise_for_status()

    data = resp.json()
    models = data.get("data", [])

    result = []
    for m in models:
        pricing = m.get("pricing", {})
        # SiliconFlow 的 prompt/completion 是每 token 价格
        prompt_raw = pricing.get("prompt", "0")
        completion_raw = pricing.get("completion", "0")

        result.append({
            "id": m.get("id", ""),
            "name": m.get("id", ""),  # SiliconFlow 的模型列表没有 display_name
            "object": m.get("object", ""),
            "created": m.get("created", 0),
            "owned_by": m.get("owned_by", ""),
            "pricing": {
                # 保存原始每 token 价格，也换算为每百万 token 价格
                "prompt": prompt_raw,
                "completion": completion_raw,
                "prompt_per_m": float(prompt_raw) * 1_000_000 if prompt_raw != "0" else 0,
                "completion_per_m": float(completion_raw) * 1_000_000 if completion_raw != "0" else 0,
            },
            "context_length": _extract_context(m),
        })

    print(f"  ✅ 硅基流动: {len(result)} 个模型")
    if api_key:
        print(f"  🔑 已使用 API Key ({api_key[:8]}...)")
    return result


def _extract_context(m: dict) -> int:
    """尝试从模型对象中提取上下文长度"""
    return m.get("context_length", 0) or m.get("max_context_length", 0) or 0
