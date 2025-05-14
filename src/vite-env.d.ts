/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_API_BASE_URL: string;
  readonly APP_LOCAL_STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
