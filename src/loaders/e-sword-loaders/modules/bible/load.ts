import type { DataStore } from "astro/loaders";
import type { ESwordFile } from "../../types";
import type { BibleModule } from ".";

function loadByBible(
  data: BibleModule.BibleEntry[],
  file: ESwordFile,
  store: DataStore,
): void {
  for (const entry of data) {
    const id =
      entry.type === "metadata"
        ? `${file.name}-metadata`
        : `${file.name}-${entry.bookName.toLowerCase()}-${entry.chapterId}`;
    store.set({ data: entry, id });
  }
}

export function load(
  data: BibleModule.BibleEntry[],
  file: ESwordFile,
  store: DataStore,
): void {
  store.clear();
  loadByBible(data, file, store);
}
