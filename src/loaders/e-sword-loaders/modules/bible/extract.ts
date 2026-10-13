import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { BookNames } from "../../book-names";
import type { ESwordFile } from "../../types";
import type { BibleModule } from ".";

function createMetadata(
  rows: BibleModule.BibleTableRow[],
): Omit<BibleModule.BibleMetadata, "type"> {
  const metadata: Omit<BibleModule.BibleMetadata, "type"> = {
    bookNames: [],
    chapterNumbersByBook: {},
  };

  for (const row of rows) {
    // Get the book name based on the book number from the row.
    const bookName = BookNames[row.Book - 1];
    // Skip rows that do not have a valid book name
    // 1 -> 66 : (Genesis -> Revelation)
    if (!bookName) continue;
    // Skip rows that do not have a valid chapter
    if (!row.Chapter) continue;
    // Skip rows that do not have a valid verse.
    if (!row.Verse) continue;

    // Get the chapter numbers for the current book from the metadata.
    let chapterNumbers = metadata.chapterNumbersByBook[bookName];

    // If the chapter numbers array does not exist for the current book,
    // initialize it.
    if (!chapterNumbers) {
      chapterNumbers = [];
      metadata.bookNames.push(bookName);
      metadata.chapterNumbersByBook[bookName] = chapterNumbers;
    }

    // Add the chapter number to the array if it does not already exist.
    if (!chapterNumbers.includes(row.Chapter)) {
      chapterNumbers.push(row.Chapter);
    }
  }

  return metadata;
}

function debugWrite(data: unknown, name: string) {
  const outputDir = path.resolve(
    process.cwd(),
    "tmp",
    "e-sword-loader",
    "bible",
  );
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `${name}.json`);
  fs.writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function extractByBible(
  file: ESwordFile,
  database: DatabaseSync,
): BibleModule.BibleEntry[] {
  const stmt = database.prepare(`
      SELECT *
      FROM Bible
      ORDER BY Book, Chapter, Verse;
  `);
  const rows = stmt.all() as BibleModule.BibleTableRow[];
  const data: BibleModule.BibleEntry[] = [
    { type: "metadata", ...createMetadata(rows) },
  ];
  const chapters = new Map<string, BibleModule.BibleChapter>();

  for (const row of rows) {
    // Get the book name based on the book number from the row.
    const bookName = BookNames[row.Book - 1];
    // Skip rows that do not have a valid book name
    // 1 -> 66 : (Genesis -> Revelation)
    if (!bookName) continue;
    // Skip rows that do not have a valid chapter
    if (!row.Chapter) continue;
    // Skip rows that do not have a valid verse.
    if (!row.Verse) continue;

    const chapterKey = `${row.Book}-${row.Chapter}`;
    let chapter = chapters.get(chapterKey);
    if (!chapter) {
      chapter = {
        bookId: row.Book,
        bookName,
        chapterId: row.Chapter,
        totalVerseCount: 0,
        type: "chapter",
        verses: {},
      };
      chapters.set(chapterKey, chapter);
      data.push(chapter);
    }

    // Add the verse to the chapter if it does not already exist.
    if (chapter.verses[row.Verse] === undefined) {
      chapter.verses[row.Verse] = row.Scripture;
      chapter.totalVerseCount++;
    }
  }

  // Write the extracted data to a debug file if in development mode.
  if (import.meta.env.MODE === "development") {
    debugWrite(data, `${file.name}`);
  }

  return data;
}

export function extract(file: ESwordFile) {
  // Initialize the database variable.
  let database: DatabaseSync | undefined;

  // Attempt to open the database and extract the Bible data.
  try {
    // Open the database synchronously with read-only access.
    database = new DatabaseSync(file.absolute, {
      open: true,
      readOnly: true,
    });
    if (!database) throw new Error(`Database not initialized`);

    // Extract the Bible data using the opened database.
    return extractByBible(file, database);
  } catch (error) {
    // Handle any errors that occur during the extraction process.
    throw new Error(`Failed to extract data from file: ${file.absolute}`, {
      cause: error,
    });
  } finally {
    // Close the database if it was successfully opened.
    if (database) database.close();
  }
}
