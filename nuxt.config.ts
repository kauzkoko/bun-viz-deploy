// https://nuxt.com/docs/api/configuration/nuxt-config
import { searchForWorkspaceRoot } from "vite";
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  modules: ["@unocss/nuxt", "@vueuse/nuxt", "@vite-pwa/nuxt"],
  vite: {
    server: { fs: { allow: [searchForWorkspaceRoot(process.cwd())] } },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Nuxt Vite PWA",
      short_name: "NuxtVitePWA",
      theme_color: "#ffffff",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
  app: {
    head: {
      script: [
        {
          src: "/p5.min.js",
        },
      ],
    },
  },
});
