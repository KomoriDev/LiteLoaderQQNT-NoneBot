import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import { defineConfig as defineViteConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import viteCp from 'vite-plugin-cp';
import viteChecker from 'vite-plugin-checker';
import viteZipPack from 'unplugin-zip-pack/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

import PluginManifest from './manifest.json';

const SRC_DIR = resolve(__dirname, './src');
const RENDER_DIR = resolve(__dirname, './src/renderer');
const OUTPUT_DIR = resolve(__dirname, './dist');

const BaseConfig = defineViteConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@': SRC_DIR,
      '@@': RENDER_DIR,
    },
  },
});

const ConfigBuilder = (type: 'main' | 'preload') =>
  defineViteConfig({
    ...BaseConfig,

    plugins: [
      viteChecker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint --fix src/**/* --ext .js,.ts',
        },
      }),
    ],
    build: {
      minify: true,
      outDir: resolve(OUTPUT_DIR, `./${type}`),
      lib: {
        entry: resolve(SRC_DIR, `./${type}/index.ts`),
        formats: ['cjs'],
        fileName: () => 'index.js',
      },
    },
  });

export default defineConfig({
  main: ConfigBuilder('main'),
  preload: ConfigBuilder('preload'),
  renderer: defineViteConfig({
    ...BaseConfig,

    plugins: [
      vue(),
      viteChecker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint --fix src/**/* --ext .js,.ts',
        },
      }),
      viteCp({
        targets: [
          { src: './manifest.json', dest: 'dist' },
          { src: './src/public', dest: 'dist/public' },
          { src: './src/template', dest: 'dist/template' },
          { src: './src/template/src', dest: 'dist/template/src' },
        ],
      }),
      viteZipPack({
        in: OUTPUT_DIR,
        out: resolve(__dirname, `./${PluginManifest.slug}.zip`),
      }),
      cssInjectedByJsPlugin(),
    ],
    build: {
      minify: 'esbuild',
      cssCodeSplit: true,
      outDir: resolve(OUTPUT_DIR, './renderer'),
      lib: {
        entry: resolve(SRC_DIR, './renderer/index.ts'),
        formats: ['es'],
        fileName: () => 'index.js',
      },
      rollupOptions: {
        input: resolve(SRC_DIR, './renderer/index.ts'),
      },
    },
    define: {
      'process.env': {},
    },
  }),
});
