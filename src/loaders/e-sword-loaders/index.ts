import path from "node:path";
import { BibleModule } from "./modules/bible";
import type { ESwordExtractBy } from "./types";

interface ESwordOptions<ExtractBy extends ESwordExtractBy> {
  extractBy: ExtractBy;
  filePath: string;
}

function eswordLoader<ExtractBy extends ESwordExtractBy>(
  eswordOptions: ESwordOptions<ExtractBy>,
) {
  switch (path.extname(eswordOptions.filePath)) {
    case ".bbli":
    case ".bblx":
      return BibleModule.loader(
        eswordOptions.filePath,
        eswordOptions.extractBy,
      );
    default:
      throw new Error(
        `Unsupported e-Sword file extension: ${path.extname(eswordOptions.filePath)}`,
      );
  }
}

export const ESword = {
  loader: eswordLoader,
} as const;

export namespace ESword {}
