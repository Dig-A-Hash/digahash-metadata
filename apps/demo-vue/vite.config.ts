import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@digahash/metadata-core': fileURLToPath(new URL('../../packages/metadata-core/src/index.ts', import.meta.url)),
      '@digahash/metadata-vue': fileURLToPath(new URL('../../packages/metadata-vue/src/index.ts', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 4174
  }
});
