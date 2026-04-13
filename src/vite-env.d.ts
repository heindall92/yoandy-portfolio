/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BIFROST_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
