import { execFileSync } from "node:child_process";

const rawUrl = process.argv[2];

if (!rawUrl) {
  console.error("用法: node scripts/verify-site-url.mjs https://你的正式域名");
  process.exit(1);
}

let baseUrl;

try {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "https:") {
    throw new Error("域名必须使用 https://");
  }
  parsed.pathname = "";
  parsed.search = "";
  parsed.hash = "";
  baseUrl = parsed.toString().replace(/\/$/, "");
} catch (error) {
  console.error(`域名格式不正确: ${error.message}`);
  process.exit(1);
}

const pages = [
  "/",
  "/china-travel/",
  "/china-travel/travel/",
  "/china-travel/cities/",
  "/china-travel/life-culture/",
  "/china-travel/tools/",
  "/china-travel/articles/",
  "/china-travel/sources/",
  "/china-travel/articles/china-travel-checklist-before-you-fly/",
  "/china-travel/articles/how-to-pay-in-china-tourist/",
];

const checks = [];

function readPage(url) {
  return execFileSync("curl", ["-sL", url], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 8,
  });
}

function readStatus(url) {
  const headers = execFileSync("curl", ["-I", "-L", "-s", url], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });

  const lines = headers.trim().split("\n").filter(Boolean);
  const httpLine = [...lines].reverse().find((line) => line.startsWith("HTTP/"));
  if (!httpLine) return 0;
  const match = httpLine.match(/^HTTP\/\S+\s+(\d+)/);
  return match ? Number(match[1]) : 0;
}

for (const page of pages) {
  const url = `${baseUrl}${page}`;
  const status = readStatus(url);
  const html = readPage(url);
  const canonicalOk = html.includes(`<link rel="canonical" href="${url}"`);
  const titleOk = html.includes("<title>");

  checks.push({
    url,
    status,
    canonicalOk,
    titleOk,
  });
}

const sitemapUrl = `${baseUrl}/sitemap-index.xml`;
const sitemapStatus = readStatus(sitemapUrl);
const sitemapText = readPage(sitemapUrl);
const sitemapOk = sitemapStatus === 200 && sitemapText.includes(baseUrl);

console.log("站点复查结果:");

for (const item of checks) {
  const statusLabel = item.status === 200 ? "正常" : `异常(${item.status})`;
  const canonicalLabel = item.canonicalOk ? "canonical正常" : "canonical待检查";
  const titleLabel = item.titleOk ? "title正常" : "title待检查";
  console.log(`- ${item.url} -> ${statusLabel} / ${canonicalLabel} / ${titleLabel}`);
}

console.log(`- ${sitemapUrl} -> ${sitemapOk ? "sitemap正常" : "sitemap待检查"}`);
