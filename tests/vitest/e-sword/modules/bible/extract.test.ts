import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { beforeAll, describe, expect, it } from "vitest";
import { extract } from "../../../../../src/loaders/e-sword-loaders/modules/bible/extract";
import type { ESwordFile } from "../../../../../src/loaders/e-sword-loaders/types";

interface BibleCounts {
  books: number;
  chapters: number;
  rows: number;
  verses: number;
}

describe("e-sword extract", () => {
  const absolute = path.resolve("src/assets/e-sword/hrb.bbli");
  const file: ESwordFile = {
    absolute,
    base: path.basename(absolute),
    dir: path.dirname(absolute),
    ext: path.extname(absolute),
    name: path.basename(absolute, path.extname(absolute)),
  };
  let expected: BibleCounts;

  beforeAll(() => {
    const database = new DatabaseSync(file.absolute, {
      open: true,
      readOnly: true,
    });

    const count = (sql: string) => {
      return (database.prepare(sql).get() as { count: number }).count;
    };

    try {
      expected = {
        books: count("SELECT COUNT(DISTINCT Book) AS count FROM Bible"),
        chapters: count(`
          SELECT COUNT(*) AS count
          FROM (SELECT DISTINCT Book, Chapter FROM Bible)
        `),
        rows: count("SELECT COUNT(*) AS count FROM Bible"),
        verses: count(`
          SELECT COUNT(*) AS count
          FROM (SELECT DISTINCT Book, Chapter, Verse FROM Bible)
        `),
      };
    } finally {
      database.close();
    }
  });

  it("extracts data 'bible'", () => {
    const data = extract(file, "bible");
    const books = Object.values(data);

    // Check the number of books extracted
    expect(books).toHaveLength(expected.books);

    // Check the total number of chapters extracted
    const totalChapters = books.reduce((sum, book) => {
      return sum + book.totalChapterCount;
    }, 0);
    expect(totalChapters).toBe(expected.chapters);

    // Check the total number of verses extracted
    const totalVerses = books.reduce((sum, book) => {
      return sum + book.totalChapterVerseCount;
    }, 0);
    expect(totalVerses).toBe(expected.verses);

    // Check genesis book and chapter details
    const genesis = data.Genesis;
    expect(genesis?.bookId).toBe(1);
    expect(genesis?.bookName).toBe("Genesis");
    expect(genesis?.totalChapterCount).toBe(50);

    // Check the first chapter of Genesis
    expect(genesis?.chapters[1]?.totalVerseCount).toBe(31);
    expect(genesis?.chapters[1]?.verses[1]).toBeTruthy();
    expect(genesis?.chapters[1]?.verses[20]).toBeTruthy();

    // Check the last chapter of Genesis
    expect(genesis?.chapters[50]?.totalVerseCount).toBe(26);
    expect(genesis?.chapters[50]?.verses[1]).toBeTruthy();
    expect(genesis?.chapters[50]?.verses[26]).toBeTruthy();

    // Check revelation book and chapter details
    const revelation = data.Revelation;
    expect(revelation?.bookId).toBe(66);
    expect(revelation?.bookName).toBe("Revelation");
    expect(revelation?.totalChapterCount).toBe(22);

    // Check the first chapter of Revelation
    expect(revelation?.chapters[1]?.totalVerseCount).toBe(20);
    expect(revelation?.chapters[1]?.verses[1]).toBeTruthy();
    expect(revelation?.chapters[1]?.verses[20]).toBeTruthy();

    // Check the last chapter of Revelation
    expect(revelation?.chapters[22]?.totalVerseCount).toBe(21);
    expect(revelation?.chapters[22]?.verses[1]).toBeTruthy();
    expect(revelation?.chapters[22]?.verses[21]).toBeTruthy();
  });

  it("extracts data 'book'", () => {
    const data = extract(file, "book");

    // Check the number of books extracted
    expect(data).toHaveLength(expected.books);

    // Check the total number of chapters extracted
    const totalChapters = data.reduce((sum, book) => {
      return sum + book.totalChapterCount;
    }, 0);
    expect(totalChapters).toBe(expected.chapters);

    // Check the total number of verses extracted
    const totalVerses = data.reduce((sum, book) => {
      return sum + book.totalChapterVerseCount;
    }, 0);
    expect(totalVerses).toBe(expected.verses);

    // Check the details of Genesis book
    const genesis = data.find((book) => book.bookId === 1);
    expect(genesis?.bookId).toBe(1);
    expect(genesis?.bookName).toBe("Genesis");
    expect(genesis?.totalChapterCount).toBe(50);

    // Check the first chapter of Genesis
    expect(genesis?.chapters[1]?.totalVerseCount).toBe(31);
    expect(genesis?.chapters[1]?.verses[1]).toBeTruthy();
    expect(genesis?.chapters[1]?.verses[20]).toBeTruthy();

    // Check the last chapter of Genesis
    expect(genesis?.chapters[50]?.totalVerseCount).toBe(26);
    expect(genesis?.chapters[50]?.verses[1]).toBeTruthy();
    expect(genesis?.chapters[50]?.verses[26]).toBeTruthy();

    // Check the details of Revelation book
    const revelation = data.find((book) => book.bookId === 66);
    expect(revelation?.bookId).toBe(66);
    expect(revelation?.bookName).toBe("Revelation");
    expect(revelation?.totalChapterCount).toBe(22);

    // Check the first chapter of Revelation
    expect(revelation?.chapters[1]?.totalVerseCount).toBe(20);
    expect(revelation?.chapters[1]?.verses[1]).toBeTruthy();
    expect(revelation?.chapters[1]?.verses[20]).toBeTruthy();

    // Check the last chapter of Revelation
    expect(revelation?.chapters[22]?.totalVerseCount).toBe(21);
    expect(revelation?.chapters[22]?.verses[1]).toBeTruthy();
    expect(revelation?.chapters[22]?.verses[21]).toBeTruthy();
  });

  it("extracts data 'chapter'", () => {
    const data = extract(file, "chapter");

    // Check the total number of chapters extracted
    expect(data).toHaveLength(expected.chapters);

    // Check the total number of verses extracted
    const totalVerses = data.reduce((sum, chapter) => {
      return sum + chapter.totalVerseCount;
    }, 0);
    expect(totalVerses).toBe(expected.verses);

    // Check the first chapter of Genesis
    const genesisChapter1 = data.find((object) => {
      return object.bookId === 1 && object.chapterId === 1;
    });
    expect(genesisChapter1?.totalVerseCount).toBe(31);
    expect(genesisChapter1?.verses[1]).toBeTruthy();
    expect(genesisChapter1?.verses[31]).toBeTruthy();

    // Check the last chapter of Genesis
    const genesisChapter50 = data.find((object) => {
      return object.bookId === 1 && object.chapterId === 50;
    });
    expect(genesisChapter50?.totalVerseCount).toBe(26);
    expect(genesisChapter50?.verses[1]).toBeTruthy();
    expect(genesisChapter50?.verses[26]).toBeTruthy();

    const revelationChapter1 = data.find((object) => {
      return object.bookId === 66 && object.chapterId === 1;
    });
    expect(revelationChapter1?.totalVerseCount).toBe(20);
    expect(revelationChapter1?.verses[1]).toBeTruthy();
    expect(revelationChapter1?.verses[20]).toBeTruthy();

    // Check the last chapter of Revelation
    const revelationChapter22 = data.find((object) => {
      return object.bookId === 66 && object.chapterId === 22;
    });
    expect(revelationChapter22?.totalVerseCount).toBe(21);
    expect(revelationChapter22?.verses[1]).toBeTruthy();
    expect(revelationChapter22?.verses[21]).toBeTruthy();
  });
});
