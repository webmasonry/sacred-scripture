import { defineConfig } from "astro/config";
import webmasonrycssDebugger from "@webmasonry/astro-css-debugger";

export default defineConfig({
  integrations: [webmasonrycssDebugger()],
  trailingSlash: "always",
});
