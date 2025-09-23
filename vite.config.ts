import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        plugins: [react()],
        define: {
            // Variables d'environnement pour Gemini
            'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || 'disabled'),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || 'disabled'),
            // Variables globales pour éviter les erreurs mobile
            'process.env': JSON.stringify({}),
            'process.browser': JSON.stringify(true),
            'global': 'globalThis',
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        },
        // Configuration pour Capacitor
        server: {
            host: true,
            port: 5173
        },
        build: {
            outDir: 'dist',
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks: undefined
                }
            }
        }
    };
});
