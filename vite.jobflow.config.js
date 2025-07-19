import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/jobflow', // Adjust if needed
  build: {
    outDir: '../../dist/jobflow', // For Netlify multi-app
  },
});