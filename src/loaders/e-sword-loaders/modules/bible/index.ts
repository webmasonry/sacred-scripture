import path from "node:path";
import url from "node:url";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { BookNameEnum, BookNameUnion } from "../../book-names";
import type { ESwordExtractBy } from "../../types";
import { extract } from "./extract";
import { load } from "./load";

type SchemaByExtract = {
  bible: typeof BibleModule.schemas.Bible;
  book: typeof BibleModule.schemas.BibleByBooks;
  chapter: typeof BibleModule.schemas.BibleByChapters;
};

function loader<ExtractBy extends ESwordExtractBy>(
  filePath: string,
  extractBy: ExtractBy,
): Loader & { schema: SchemaByExtract[ExtractBy] } {
  const schemas = {
    bible: BibleModule.schemas.Bible,
    book: BibleModule.schemas.BibleByBooks,
    chapter: BibleModule.schemas.BibleByChapters,
  };

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
      const data = extract(file, extractBy);
      load(data, extractBy, file, store);
    },
    name: "esword-bbl-loader",
    schema: schemas[extractBy],
  } satisfies Loader & { schema: SchemaByExtract[ExtractBy] };
}

export const BibleModule = {
  loader: loader,
  schemas: {
    Bible: z.partialRecord(
      BookNameEnum,
      z.object({
        bookId: z.number(),
        bookName: BookNameUnion,
        chapters: z.record(
          z.number(),
          z.object({
            totalVerseCount: z.number(),
            verses: z.record(z.number(), z.string()),
          }),
        ),
        totalChapterCount: z.number(),
        totalChapterVerseCount: z.number(),
      }),
    ),
    BibleByBooks: z.object({
      bookId: z.number(),
      bookName: BookNameUnion,
      chapters: z.record(
        z.number(),
        z.object({
          totalVerseCount: z.number(),
          verses: z.record(z.number(), z.string()),
        }),
      ),
      totalChapterCount: z.number(),
      totalChapterVerseCount: z.number(),
    }),
    BibleByChapters: z.object({
      bookId: z.number(),
      bookName: BookNameUnion,
      chapterId: z.number(),
      totalVerseCount: z.number(),
      verses: z.record(z.number(), z.string()),
    }),
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
  export type Bible = z.infer<typeof BibleModule.schemas.Bible>;
  export type BibleByBooks = z.infer<typeof BibleModule.schemas.BibleByBooks>;
  export type BibleByChapters = z.infer<
    typeof BibleModule.schemas.BibleByChapters
  >;

  export type BibleTableRow = z.infer<typeof BibleModule.schemas.BibleTableRow>;

  export type DetailTableRow = z.infer<
    typeof BibleModule.schemas.DetailTableRow
  >;
}
