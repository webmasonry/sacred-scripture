import { DatabaseSync } from "node:sqlite";
import { BookNames } from "../../book-names";
import type { ESwordExtractBy, ESwordFile } from "../../types";
import type { BibleModule } from ".";
import type { ExtractData } from "./types";

function extractByBible(database: DatabaseSync): BibleModule.Bible {
  const data: BibleModule.Bible = {};
  const stmt = database.prepare(`
      SELECT *
      FROM Bible
      ORDER BY Book, Chapter, Verse;
  `);
  const rows = stmt.all() as BibleModule.BibleTableRow[];

  for (const row of rows) {
    const bookName = BookNames[row.Book - 1];
    if (!bookName) continue;
    if (!row.Chapter || !row.Verse) continue;

    if (!data[bookName]) {
      data[bookName] = {
        bookId: row.Book,
        bookName: bookName,
        chapters: {},
        totalChapterCount: 0,
        totalChapterVerseCount: 0,
      };
    }

    let chapter = data[bookName].chapters[row.Chapter];
    if (!chapter) {
      chapter = {
        totalVerseCount: 0,
        verses: {},
      };
      data[bookName].chapters[row.Chapter] = chapter;
      data[bookName].totalChapterCount++;
    }

    if (chapter.verses[row.Verse] === undefined) {
      chapter.verses[row.Verse] = row.Scripture;
      chapter.totalVerseCount++;
      data[bookName].totalChapterVerseCount++;
    }
  }

  return data;
}

function extractByBook(database: DatabaseSync): BibleModule.BibleByBooks[] {
  const data = [] as BibleModule.BibleByBooks[];
  const stmt = database.prepare(`
      SELECT *
      FROM Bible
      ORDER BY Book, Chapter, Verse;
  `);
  const rows = stmt.all() as BibleModule.BibleTableRow[];

  for (const row of rows) {
    const bookName = BookNames[row.Book - 1];
    if (!bookName) continue;
    if (!row.Chapter || !row.Verse) continue;

    let book = data.find((b) => b.bookId === row.Book);
    if (!book) {
      book = {
        bookId: row.Book,
        bookName,
        chapters: {},
        totalChapterCount: 0,
        totalChapterVerseCount: 0,
      };
      data.push(book);
    }

    let chapter = book.chapters[row.Chapter];
    if (!chapter) {
      chapter = {
        totalVerseCount: 0,
        verses: {},
      };
      book.chapters[row.Chapter] = chapter;
      book.totalChapterCount++;
    }

    if (chapter.verses[row.Verse] === undefined) {
      chapter.verses[row.Verse] = row.Scripture;
      chapter.totalVerseCount++;
      book.totalChapterVerseCount++;
    }
  }

  return data;
}

function extractByChapter(
  database: DatabaseSync,
): BibleModule.BibleByChapters[] {
  const data = [] as BibleModule.BibleByChapters[];
  const stmt = database.prepare(`
      SELECT *
      FROM Bible
      ORDER BY Book, Chapter, Verse;
  `);
  const rows = stmt.all() as BibleModule.BibleTableRow[];

  for (const row of rows) {
    const bookName = BookNames[row.Book - 1];
    if (!bookName) continue;
    if (!row.Chapter || !row.Verse) continue;

    let chapter = data.find(
      (c) => c.bookId === row.Book && c.chapterId === row.Chapter,
    );
    if (!chapter) {
      chapter = {
        bookId: row.Book,
        bookName,
        chapterId: row.Chapter,
        totalVerseCount: 0,
        verses: {},
      };
      data.push(chapter);
    }

    if (chapter.verses[row.Verse] === undefined) {
      chapter.verses[row.Verse] = row.Scripture;
      chapter.totalVerseCount++;
    }
  }

  return data;
}

export function extract<G extends ESwordExtractBy>(
  file: ESwordFile,
  groupby: G,
): ExtractData<G> {
  let database: DatabaseSync | undefined;
  try {
    database = new DatabaseSync(file.absolute, {
      open: true,
      readOnly: true,
    });
    if (!database) throw new Error(`Database not initialized`);
    switch (groupby) {
      case "bible":
        return extractByBible(database) as ExtractData<G>;
      case "book":
        return extractByBook(database) as ExtractData<G>;
      case "chapter":
        return extractByChapter(database) as ExtractData<G>;
      default:
        throw new Error(`Unsupported group by option: ${groupby}`);
    }
  } catch (error) {
    throw new Error(`Failed to extract data from file: ${file.absolute}`, {
      cause: error,
    });
  } finally {
    if (database) database.close();
  }
}
