import type { ESwordExtractBy } from "../../types";
import type { BibleModule } from ".";

export type ExtractData<G extends ESwordExtractBy> = G extends "bible"
  ? BibleModule.Bible
  : G extends "book"
    ? BibleModule.BibleByBooks[]
    : G extends "chapter"
      ? BibleModule.BibleByChapters[]
      : never;
