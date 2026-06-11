import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Use './' for static-host friendly relative paths; works on GitHub Pages subpaths too.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
