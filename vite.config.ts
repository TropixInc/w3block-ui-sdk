import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';

const _dirname =
  typeof __dirname === 'undefined'
    ? dirname(fileURLToPath(import.meta.url))
    : __dirname;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(_dirname, 'src/index.tsx'),
      name: 'pixway-ui-sdk',
      fileName: 'pixway-ui-sdk',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'next-auth'],
      output: {
        sourcemap: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'next-auth': 'NextAuth',
        },
      },
    },
  },
  plugins: [
    react(),
    svgr(),
    dts({
      insertTypesEntry: true,
    }),
  ],
});
