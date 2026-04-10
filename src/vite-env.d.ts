/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOTP_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
