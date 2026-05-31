#!/bin/bash
set -e
cd /Users/apple/ai-webplan

export SILICONFLOW_API_KEY="sk-qkylyzadhlpqzycdhyivdukdioegolzqncmbypkhjcjzahsx"
export DASHSCOPE_API_KEY="sk-f2721b188d774704b16c56592122157b"
export FIREWORKS_API_KEY="fw_M4JVevRfKn2G4o8WkoXgxs"

echo "=== LLM Rankings Update: $1 ==="
echo "Started: $(date)"

if [ "$1" = "daily" ]; then
    echo "Daily mode: rankings only"
    python3 crawler/run.py --rankings-only
elif [ "$1" = "weekly" ]; then
    echo "Weekly mode: full crawl"
    python3 crawler/run.py
else
    echo "Usage: $0 daily|weekly"
    exit 1
fi

echo "Building..."
npx astro build

echo "Deploying to Cloudflare..."
npx wrangler pages deploy dist/ --project-name=llm-rankings --commit-dirty=true

echo "Done: $(date)"
