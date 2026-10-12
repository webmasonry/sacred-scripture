import type { Runtime } from "@astrojs/cloudflare";
import type { AstroLoggerLevel } from "astro";

declare namespace App {
  interface Locals extends Runtime<Env> {}
}

interface ImportMetaEnv {
  readonly CI: boolean;
  readonly DOMAIN: string;
  readonly LOGGER_LEVEL: AstroLoggerLevel;
}

// biome-ignore lint/correctness/noUnusedVariables: ambient declaration
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
