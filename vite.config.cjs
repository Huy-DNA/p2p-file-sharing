const { defineConfig } = require('vite');
const dts = require('vite-dts').default;

module.exports = defineConfig({
  build: {
  },
  plugins: [dts()],
  test: {
    globals: true,
  },
});
