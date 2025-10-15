// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo',
    'nuxt-schema-org'
  ],
  css: ['@/assets/css/base.css'],
  app: {
    head: {
      title: 'Widdy Louis — Développeur Front-End',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'description', content: 'Portfolio Nuxt 3 — Front-End, animations légères, accessibilité, performance.' }
      ]
    }
  },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  tailwindcss: { viewer: false },
  experimental: { payloadExtraction: true },
  nitro: { preset: 'vercel' }
})