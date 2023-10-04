import react from '@vitejs/plugin-react';
import path from 'path';
import url from 'url';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import viteCompression from 'vite-plugin-compression';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(url.fileURLToPath(import.meta.url))
    : __dirname;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(_dirname, 'src/index.tsx'),
      name: 'w3block-ui-sdk',
      formats: ['es', 'umd'],
      fileName: 'w3block-ui-sdk',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'next-auth',
        'react-query',
        'html5-qrcode',
      ],
      output: {
        sourcemap: false,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-query': 'react-query',
        },
      },
    },
  },
  plugins: [
    react(),
    svgr(),
    viteCompression(),
    splitVendorChunkPlugin(),
    dts({
      insertTypesEntry: true,
    }),
  ],
});
