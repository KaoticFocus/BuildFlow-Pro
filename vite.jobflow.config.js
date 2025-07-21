import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/jobflow',
  base: '/jobflow/',
  build: {
    outDir: '../../dist/jobflow',
  },
  css: {
    postcss: './postcss.config.cjs',  // Update to .cjs if explicitly needed (optional in most cases)
  },
});