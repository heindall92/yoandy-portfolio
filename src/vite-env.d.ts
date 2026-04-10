/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOTP_SECRET: string;
  readonly VITE_BIFROST_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
