import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src/jobflow',
  base: '/jobflow/',
  build: { outDir: '../../dist/jobflow' },
  css: {
    postcss: './postcss.config.js', // Ensure this points to your Tailwind config
  },
});