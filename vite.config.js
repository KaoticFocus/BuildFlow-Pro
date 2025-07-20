import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src', // Assumes RenoRecap entry is under src/ (adjust if in apps/remorecap/src)
  build: {
    outDir: '../dist/remorecap', // Outputs to dist/remorecap for Netlify redirects
  },
});