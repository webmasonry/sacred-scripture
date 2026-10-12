import webmasonrycssDebugger from "@webmasonry/astro-css-debugger";
import { defineConfig } from "astro/config";

export default defineConfig({
  compressHTML: false,
  integrations: [webmasonrycssDebugger()],
  trailingSlash: "always",
  vite: {
    build: {
      minify: false,
    },
  },
});
