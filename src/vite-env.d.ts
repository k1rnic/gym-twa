/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_API_BASE_URL: string;
  readonly APP_TUNNEL_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
