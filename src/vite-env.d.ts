/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOTP_SECRET: string;
  readonly VITE_BIFROST_KEY: string;
  readonly VITE_BIFROST_TOTP_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
