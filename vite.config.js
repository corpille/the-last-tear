export default {
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
