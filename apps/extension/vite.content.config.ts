import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                content: resolve(__dirname, 'src/content.ts')
            },
            output: {
                entryFileNames: '[name].js',
                sourcemap: true,
                format: 'iife',
                inlineDynamicImports: true
            }
        },
        emptyOutDir: false
    }
});
