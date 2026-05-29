import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Serve /public from the repo root so /images/ezgif-frame-XXX.jpg resolves
  publicDir: path.resolve(__dirname, '../public'),
});
