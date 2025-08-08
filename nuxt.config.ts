// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  // Avoid auto-importing from `utils` to prevent duplicate export names
  // like `calculatePriceBreakdown` from multiple files.
  imports: {
    dirs: ['composables']
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' }
    ]
  },
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    experimental: {
      wasm: true
    }
  },
  app: {
    head: {
      meta: [
        { name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
})