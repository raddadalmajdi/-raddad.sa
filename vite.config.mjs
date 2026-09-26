import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'js-built',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                app: resolve(__dirname, 'src/app.js'),
                login: resolve(__dirname, 'src/login.js'),
                client: resolve(__dirname, 'src/client.js'),
                admin: resolve(__dirname, 'src/admin.js'),
            },
            output: {
                entryFileNames: '[name].bundle.js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                format: 'es',
            },
        },
    },
});
