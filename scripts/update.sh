#!/bin/bash
set -e
cd /Users/apple/ai-webplan

# API keys must be set in environment before running this script.
# GitHub Actions uses secrets. For local dev: export XXX_API_KEY=xxx first.

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
