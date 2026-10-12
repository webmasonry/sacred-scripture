import { defineCollection } from "astro:content";
import { ESword } from "./loaders/e-sword-loaders";

export const collections = {
  hrb: defineCollection({
    loader: ESword.loader({
      extractBy: "chapter",
      filePath: "./src/assets/e-sword/hrb.bbli",
    }),
  }),
};
