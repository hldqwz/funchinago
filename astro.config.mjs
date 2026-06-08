import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // 买完正式域名后，可运行:
  // npm run set-site-url -- https://你的域名
  site: "https://funchinago.com",
  integrations: [
    sitemap({
      filter: (page) =>
        page.includes("/china-travel/") ||
        page.includes("/tools/china-"),
    }),
  ],
  output: "static",
  build: {
    format: "directory",
  },
});
