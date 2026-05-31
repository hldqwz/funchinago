// src/types.ts — 数据类型定义（三平台版）

export interface PlatformPricing {
  prompt: string;
  completion: string;
  prompt_per_m?: number;
  completion_per_m?: number;
  cached_input?: string;
  image?: string;
  request?: string;
}

export interface PlatformData {
  model_id: string;
  pricing: PlatformPricing;
  context_length: number;
  // OpenRouter 特有
  architecture?: { modality?: string; tokenizer?: string };
  top_provider?: { name: string; context_length?: number };
  rank?: number | null;
  usage_tokens?: number | null;
  trend?: string;
  usage_display?: string;
  // Together AI 特有
  organization?: string;
  // 硅基流动特有
  owned_by?: string;
}

export interface ModelData {
  canonical_name: string;
  name: string;
  description: string;
  platforms: {
    openrouter?: PlatformData;
    groq?: PlatformData;
    siliconflow?: PlatformData;
    bailian?: PlatformData;
    fireworks?: PlatformData;
  };
}

export interface PlatformStats {
  openrouter: number;
  groq: number;
  siliconflow: number;
  bailian: number;
  fireworks: number;
  multi_platform: number;
}

export interface ModelsFile {
  updated_at: string;
  total_models: number;
  ranked_models: number;
  platform_stats: PlatformStats;
  models: ModelData[];
}
