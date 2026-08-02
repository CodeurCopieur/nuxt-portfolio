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
  nitro: { 
    preset: 'vercel',
    externals: {
      inline: ['defu']
    }
  },
  routeRules: {
    '/admin/**': {
      robots: false,
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      }
    },
    '/api/admin/**': {
      cors: false
    }
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    adminAllowedEmails: process.env.ADMIN_ALLOWED_EMAILS || 'wigame446@gmail.com',
    adminSetupSecret: process.env.ADMIN_SETUP_SECRET || '',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      adminAllowedEmails: process.env.ADMIN_ALLOWED_EMAILS || 'wigame446@gmail.com'
    }
  }
})