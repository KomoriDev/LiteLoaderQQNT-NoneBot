// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig } from "electron-vite";
import { defineConfig as defineViteConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCp from "vite-plugin-cp";
import viteChecker from "vite-plugin-checker";
import viteZipPack from "unplugin-zip-pack/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// manifest.json
var manifest_default = {
  manifest_version: 4,
  type: "extension",
  name: "NoneBot",
  slug: "liteloader_nonebot",
  description: "\u5728 QQ \u4E0A\u7BA1\u7406\u4F60\u7684 NoneBot \u5E94\u7528 / Manage your NoneBot App on QQ",
  version: "0.1.0",
  icon: "public/icon.svg",
  thumb: "public/thumb.svg",
  authors: [
    {
      name: "KomoriDev",
      link: "https://github.com/KomoriDev"
    }
  ],
  platform: ["win32", "linux", "darwin"],
  injects: {
    main: "./main/index.js",
    preload: "./preload/index.js",
    renderer: "./renderer/index.js"
  },
  repository: {
    repo: "KomoriDev/LiteLoaderQQNT-NoneBot",
    branch: "master",
    release: {
      tag: "0.1.0",
      file: "liteloader_nonebot.zip"
    }
  }
};

// electron.vite.config.ts
var __electron_vite_injected_dirname = "D:\\LiteLoaderQQNT-NoneBot";
var SRC_DIR = resolve(__electron_vite_injected_dirname, "./src");
var RENDER_DIR = resolve(__electron_vite_injected_dirname, "./src/renderer");
var OUTPUT_DIR = resolve(__electron_vite_injected_dirname, "./dist");
var BaseConfig = defineViteConfig({
  root: __electron_vite_injected_dirname,
  resolve: {
    alias: {
      "@": SRC_DIR,
      "@@": RENDER_DIR
    }
  }
});
var ConfigBuilder = (type) => defineViteConfig({
  ...BaseConfig,
  plugins: [
    viteChecker({
      typescript: true,
      eslint: {
        lintCommand: "eslint . --ext .vue,.js,.ts --ignore-path .gitignore"
      }
    })
  ],
  build: {
    minify: true,
    outDir: resolve(OUTPUT_DIR, `./${type}`),
    lib: {
      entry: resolve(SRC_DIR, `./${type}/index.ts`),
      formats: ["cjs"],
      fileName: () => "index.js"
    }
  }
});
var electron_vite_config_default = defineConfig({
  main: ConfigBuilder("main"),
  preload: ConfigBuilder("preload"),
  renderer: defineViteConfig({
    ...BaseConfig,
    plugins: [
      vue(),
      viteChecker({
        typescript: true,
        eslint: {
          lintCommand: "eslint . --ext .vue,.js,.ts --ignore-path .gitignore"
        }
      }),
      viteCp({
        targets: [
          { src: "./manifest.json", dest: "dist" },
          { src: "./src/public", dest: "dist/public" },
          { src: "./src/template", dest: "dist/template", flatten: false },
          { src: "./src/template/.python-version", dest: "dist/template" }
        ]
      }),
      viteZipPack({
        in: OUTPUT_DIR,
        out: resolve(__electron_vite_injected_dirname, `./${manifest_default.slug}.zip`)
      }),
      cssInjectedByJsPlugin()
    ],
    build: {
      minify: "esbuild",
      cssCodeSplit: true,
      outDir: resolve(OUTPUT_DIR, "./renderer"),
      lib: {
        entry: resolve(SRC_DIR, "./renderer/index.ts"),
        formats: ["es"],
        fileName: () => "index.js"
      },
      rollupOptions: {
        input: resolve(SRC_DIR, "./renderer/index.ts")
      }
    },
    define: {
      "process.env": {}
    }
  })
});
export {
  electron_vite_config_default as default
};
