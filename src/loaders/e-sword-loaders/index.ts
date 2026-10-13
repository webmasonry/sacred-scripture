import path from "node:path";
import { BibleModule } from "./modules/bible";

interface ESwordOptions {
  filePath: string;
}

function eswordLoader(eswordOptions: ESwordOptions) {
  switch (path.extname(eswordOptions.filePath)) {
    case ".bbli":
    case ".bblx":
      return BibleModule.loader(eswordOptions.filePath);
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
