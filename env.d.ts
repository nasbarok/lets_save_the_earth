/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    // ajoute ici d'autres VITE_* si besoin
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}