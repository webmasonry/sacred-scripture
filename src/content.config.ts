import { defineCollection } from "astro:content";
import { ESword } from "./loaders/e-sword-loaders";

export const collections = {
  "erv-bible": defineCollection({
    loader: ESword.loader({
      filePath: "./src/assets/e-sword/erv.bbli",
    }),
  }),
  "hrb-bible": defineCollection({
    loader: ESword.loader({
      filePath: "./src/assets/e-sword/hrb.bbli",
    }),
  }),
};
