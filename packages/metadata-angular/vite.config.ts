import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DigahashMetadataAngular',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      external: ['@angular/core', '@digahash/metadata-core']
    }
  },
  plugins: [
    dts({
      entryRoot: 'src',
      insertTypesEntry: true
    })
  ]
});
