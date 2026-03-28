/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIPPER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
