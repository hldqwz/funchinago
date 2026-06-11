import fs from "node:fs";
import path from "node:path";

const rawUrl = process.argv[2];

if (!rawUrl) {
  console.error("用法: node scripts/set-site-url.mjs https://你的域名");
  process.exit(1);
}

let finalUrl;

try {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "https:") {
    throw new Error("域名必须使用 https://");
  }
  parsed.pathname = "";
  parsed.hash = "";
  parsed.search = "";
  finalUrl = parsed.toString().replace(/\/$/, "");
} catch (error) {
  console.error(`域名格式不正确: ${error.message}`);
  process.exit(1);
}

const rootDir = process.cwd();
const astroConfigPath = path.join(rootDir, "astro.config.mjs");

const astroConfig = fs.readFileSync(astroConfigPath, "utf8");
const nextAstroConfig = astroConfig.replace(
  /const defaultChinaSiteUrl = process\.env\.CHINA_SITE_URL \?\? "https:\/\/[^"]+"/,
  `const defaultChinaSiteUrl = process.env.CHINA_SITE_URL ?? "${finalUrl}"`
);

if (!/const defaultChinaSiteUrl = process\.env\.CHINA_SITE_URL \?\? "https:\/\/[^"]+"/.test(astroConfig)) {
  console.error("未能找到 astro.config.mjs 中的 defaultChinaSiteUrl 配置");
  process.exit(1);
}

fs.writeFileSync(astroConfigPath, nextAstroConfig);

console.log("已更新以下文件:");
console.log(`- ${astroConfigPath}`);
console.log(`当前站点域名: ${finalUrl}`);
