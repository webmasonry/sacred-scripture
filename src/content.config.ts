import { defineCollection } from "astro:content";
import { ESword } from "./loaders/e-sword-loaders";

export const collections = {
  // "erv-bible": defineCollection({
  //   loader: ESword.loader({
  //     extractBy: "chapter",
  //     filePath: "./src/assets/e-sword/erv.bbli",
  //   }),
  // }),
  "hrb-bible": defineCollection({
    loader: ESword.loader({
      extractBy: "chapter",
      filePath: "./src/assets/e-sword/hrb.bbli",
    }),
  }),
  // "hrb-commentary": defineCollection({
  //   loader: ESword.loader({
  //     filePath: "./src/assets/e-sword/hrb.cmtx",
  //   }),
  // }),
  // "hrb-devotion": defineCollection({
  //   loader: ESword.loader({
  //     filePath: "./src/assets/e-sword/hrb.mapx",
  //   }),
  // }),
  // "hrb-dictionary": defineCollection({
  //   loader: ESword.loader({
  //     filePath: "./src/assets/e-sword/hrb.mapx",
  //   }),
  // }),
  // "hrb-graphics": defineCollection({
  //   loader: ESword.loader({
  //     filePath: "./src/assets/e-sword/hrb.mapx",
  //   }),
  // }),
};
