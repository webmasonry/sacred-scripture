import type { DataStore } from "astro/loaders";
import type { ESwordExtractBy, ESwordFile } from "../../types";
import type { BibleModule } from ".";

function loadByBible(
  data: BibleModule.Bible,
  file: ESwordFile,
  store: DataStore,
): void {
  store.set({
    data,
    id: `${file.name}-bible`,
  });
}

function loadByBook(
  data: BibleModule.BibleByBooks[],
  file: ESwordFile,
  store: DataStore,
): void {
  for (const book of data) {
    store.set({
      data: book,
      id: `${file.name}-${book.bookName}`,
    });
  }
}

function loadByChapter(
  data: BibleModule.BibleByChapters[],
  file: ESwordFile,
  store: DataStore,
): void {
  for (const chapter of data) {
    store.set({
      data: chapter,
      id: `${file.name}-${chapter.bookName}-${chapter.chapterId}`,
    });
  }
}

type LoadByData<G extends ESwordExtractBy> = G extends "bible"
  ? BibleModule.Bible
  : G extends "book"
    ? BibleModule.BibleByBooks[]
    : G extends "chapter"
      ? BibleModule.BibleByChapters[]
      : never;

export function load<G extends ESwordExtractBy>(
  data: LoadByData<G>,
  groupby: G,
  file: ESwordFile,
  store: DataStore,
): void {
  store.clear();
  switch (groupby) {
    case "bible":
      loadByBible(data as BibleModule.Bible, file, store);
      break;
    case "chapter":
      loadByChapter(data as BibleModule.BibleByChapters[], file, store);
      break;
    case "book":
      loadByBook(data as BibleModule.BibleByBooks[], file, store);
      break;
    default:
      throw new Error(`Unsupported load type: ${groupby}`);
  }
}
