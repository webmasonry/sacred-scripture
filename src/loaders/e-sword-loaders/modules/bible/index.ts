import path from "node:path";
import url from "node:url";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { BookNameEnum, BookNameUnion } from "../../book-names";
import { extract } from "./extract";
import { load } from "./load";

function loader(
  filePath: string,
): Loader & { schema: typeof BibleModule.schemas.BibleEntry } {
  return {
    load: async ({ config, store }) => {
      const absolutePath = path.join(url.fileURLToPath(config.root), filePath);
      const file = {
        absolute: absolutePath,
        base: path.basename(absolutePath),
        dir: path.dirname(absolutePath),
        ext: path.extname(absolutePath),
        name: path.basename(absolutePath, path.extname(absolutePath)),
      };
      const data = extract(file);
      load(data, file, store);
    },
    name: "esword-bbl-loader",
    schema: BibleModule.schemas.BibleEntry,
  } satisfies Loader & { schema: typeof BibleModule.schemas.BibleEntry };
}

export const BibleModule = {
  loader: loader,
  schemas: {
    BibleEntry: z.discriminatedUnion("type", [
      z.object({
        bookNames: z.array(BookNameUnion),
        chapterNumbersByBook: z.partialRecord(
          BookNameEnum,
          z.array(z.number()),
        ),
        type: z.literal("metadata"),
      }),
      z.object({
        bookId: z.number(),
        bookName: BookNameUnion,
        chapterId: z.number(),
        totalVerseCount: z.number(),
        type: z.literal("chapter"),
        verses: z.record(z.number(), z.string()),
      }),
    ]),
    BibleTableRow: z.object({
      Book: z.number(),
      Chapter: z.number(),
      Scripture: z.string(),
      Verse: z.number(),
    }),
    DetailTableRow: z.object({
      Abbreviation: z.string(),
      Apocrypha: z.boolean(),
      Comments: z.string(),
      Description: z.string(),
      Font: z.string(),
      NT: z.number(),
      OT: z.number(),
      RightToLeft: z.number(),
      Strong: z.string(),
      Version: z.number(),
    }),
  },
} as const;

export namespace BibleModule {
  export type BibleEntry = z.infer<typeof BibleModule.schemas.BibleEntry>;
  export type BibleMetadata = Extract<BibleEntry, { type: "metadata" }>;
  export type BibleChapter = Extract<BibleEntry, { type: "chapter" }>;
  export type BibleTableRow = z.infer<typeof BibleModule.schemas.BibleTableRow>;
  export type DetailTableRow = z.infer<
    typeof BibleModule.schemas.DetailTableRow
  >;
}
