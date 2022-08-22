import { viteSingleFile } from 'vite-plugin-singlefile';

export default {
  plugins: [viteSingleFile()],
  server: {
    port: 8000,
  },
  json: {
    stringify: true,
  },
  build: {
    target: 'esnext',
    polyfillModulePreload: false,
  },
  cssCodeSplit: false,
  minify: 'terser',
  reportCompressedSize: true,
};
