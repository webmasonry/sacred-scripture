import { defineCollection } from "astro:content";
import { ESword } from "./loaders/e-sword-loaders";

export const collections = {
  bible: defineCollection({
    loader: ESword.loader({
      extractBy: "bible",
      filePath: "./src/assets/e-sword/hrb.bbli",
    }),
  }),
};
