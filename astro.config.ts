import tailwindcss from "@tailwindcss/vite";
import webmasonrycssDebugger from "@webmasonry/astro-css-debugger";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  compressHTML: true,
  fonts: [
    {
      cssVariable: "--font-cinzel",
      display: "swap",
      fallbacks: ["Georgia", "serif"],
      name: "Cinzel Variable",
      optimizedFallbacks: true,
      options: { package: "@fontsource-variable/cinzel" },
      provider: fontProviders.npm({ remote: false }),
      styles: ["normal"],
      subsets: ["latin"],
      weights: ["400 900"],
    },
    {
      cssVariable: "--font-inter",
      display: "swap",
      fallbacks: ["Arial", "sans-serif"],
      name: "Inter Variable",
      optimizedFallbacks: true,
      options: { package: "@fontsource-variable/inter" },
      provider: fontProviders.npm({ remote: false }),
      styles: ["normal"],
      subsets: ["latin"],
      weights: ["100 900"],
    },
  ],
  integrations: [
    webmasonrycssDebugger(),
    icon({
      iconDir: "./src/assets/icons",
    }),
  ],
  output: "static",
  trailingSlash: "always",
  vite: {
    build: {
      minify: true,
    },
    plugins: [tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
  },
});
