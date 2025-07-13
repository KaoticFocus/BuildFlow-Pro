import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',  // listen on all interfaces
    port: 5173,       // force Vite to use port 5173
    // During local development, proxy Netlify Functions
    ...(mode === 'development' && {
      proxy: {
        '/.netlify/functions': {
          target: 'http://localhost:8888',
          changeOrigin: true,
          secure: false,
        },
      },
    }),
  },
}));