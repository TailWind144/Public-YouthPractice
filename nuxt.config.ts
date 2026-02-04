import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ArcoResolver } from "unplugin-vue-components/resolvers"
import { vitePluginForArco } from "@arco-plugins/vite-vue"

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      homeBase: "/home",
    },
  },
  devtools: { enabled: false },
  compatibilityDate: "2024-11-01",
  app: {
    // layoutTransition: { name: "layout", mode: "out-in" },
    // pageTransition: { name: "page", mode: "out-in" },
  },
  pages: true,
  experimental: {
    viewTransition: true,
  },
  css: ["./assets/css/main.css", "./assets/css/font.css"],
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  tailwindcss: {
    config: "./tailwind.config.js",
  },
  vite: {
    plugins: [
      AutoImport({
        resolvers: [ArcoResolver()],
      }),
      Components({
        resolvers: [
          ArcoResolver({
            sideEffect: true,
          }),
        ],
      }),
      vitePluginForArco({
        style: "css",
      }),
    ],
    build: {
      target: ["es2022", "edge89", "firefox89", "chrome89", "safari15"],
    },
  },
  nitro: {
    output: {
      dir: ".output",
      publicDir: ".output/public",
    },
    esbuild: {
      options: {
        target: "es2022",
      },
    },
  },
  build: {
    transpile: ["@hapi/hoek", "@sideway"], // 强制转译 @hapi/hoek 为 CommonJS
  },
})
