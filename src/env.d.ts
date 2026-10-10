import type { Runtime } from "@astrojs/cloudflare";

declare namespace App {
  interface Locals extends Runtime<Env> {}
}

interface ImportMetaEnv {
  readonly CI: boolean;
  readonly DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

