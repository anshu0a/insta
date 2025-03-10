import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Default output folder
    emptyOutDir: true, // Ensures clean build
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
  base: "./", // Ensures correct asset paths
});
