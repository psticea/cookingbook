/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPINSIGHTS_CONNECTION_STRING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
