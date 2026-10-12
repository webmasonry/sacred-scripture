export interface ESwordFile {
  absolute: string;
  base: string;
  dir: string;
  ext: string;
  name: string;
}

export type ESwordFileExtension = ".bbli" | ".bblx";

export type ESwordExtractBy = "bible" | "book" | "chapter";
