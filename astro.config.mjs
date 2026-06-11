import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://funchinago.com",
  integrations: [
    sitemap({
      filter: (page) =>
        page === "https://funchinago.com/" ||
        page.includes("/china-travel/") ||
        page.includes("/tools/china-"),
    }),
  ],
  output: "static",
  build: {
    format: "directory",
  },
});
