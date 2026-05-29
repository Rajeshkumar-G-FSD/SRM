import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// ESM-safe __dirname (works regardless of "type":"module" in package.json)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Images live in /public at the repo root, one level above this file
  publicDir: path.resolve(__dirname, '../public'),
});
