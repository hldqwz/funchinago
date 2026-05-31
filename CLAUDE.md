# 全球大模型调用排名 (Global LLM Usage Rankings)

## 项目目标
构建大模型用量排名网站 → 博客/个人内容推广 → Google AdSense 变现

## 技术栈（已确定）
- **Astro SSG** — 静态站点生成，SEO 友好
- **Cloudflare Pages** — 免费部署
- **数据管道** — Cron 定时任务 → 爬数据 → 生成 JSON → 触发 CF Pages 重建

## 数据来源
- **OpenRouter REST API** (`/api/v1/models`) — 355 个模型，丰富元数据（name, description, context_length, architecture, pricing, top_provider），**无用量/排名数据**
- **OpenRouter /rankings 页面** — 包含实际用量排名，但是 Next.js 客户端 SPA，需 JS 渲染
- **爬虫方案** — Scrapling (github.com/D4Vinci/Scrapling)，需 headless browser

## 排名维度
- 整体使用量排名
- 按类别（对话/代码/图片/视频）
- 性价比排名
- 增长率（本周上升最快）
- 地区热力图（用 Google Trends 地理数据代理）

## SEO 策略
- 模型名称作为长尾搜索关键词
- 博客深度内容
- 跨站推广

## 当前阻塞
1. Scrapling 安装超时（网络问题，可能需清华镜像 `pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple scrapling`）
2. 项目代码尚未开始

## 用户偏好
- 非技术背景，需要技术解释
- 偏好先讨论方案，确认后再动手执行
- 不要跳过讨论直接写代码
