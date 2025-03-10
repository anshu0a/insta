import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
  base: "/", // Ensures correct asset paths
});
