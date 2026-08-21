// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl =
  process.env.NUXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo',
    'nuxt-schema-org'
  ],
  css: ['@/assets/css/base.css'],
  site: {
    url: siteUrl,
    name: 'Widdy Louis',
    description:
      'Widdy Louis — développeur front-end freelance. Interfaces web performantes, accessibles et animées (Nuxt, Vue).',
    defaultLocale: 'fr'
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      meta: [
        {
          name: 'description',
          content:
            'Widdy Louis — développeur front-end freelance. Interfaces web performantes, accessibles et animées (Nuxt, Vue).'
        },
        { name: 'theme-color', content: '#0b1a3a' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        {
          innerHTML:
            "(function(){try{if(localStorage.getItem('rf-theme')==='light'){document.documentElement.classList.add('rf-light')}}catch(e){}})()",
          tagPriority: 'critical'
        }
      ]
    }
  },
  robots: {
    disallow: ['/admin', '/api/admin', '/old']
  },
  sitemap: {
    exclude: ['/admin/**', '/api/**', '/old', '/old/**']
  },
  ogImage: {
    enabled: false
  },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  tailwindcss: { viewer: false },
  vite: {
    optimizeDeps: {
      include: ['leaflet', 'locomotive-scroll', 'scrollmagic', '@barba/core']
    },
    build: {
      cssCodeSplit: true
    }
  },
  experimental: { payloadExtraction: true },
  nitro: {
    preset: 'vercel',
    externals: {
      inline: ['defu']
    }
  },
  routeRules: {
    '/admin/filtres': { redirect: '/admin/experiences' },
    '/admin/a-propos': { redirect: '/admin/meta' },
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
    },
    '/': {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    },
    // Ancienne version conservée pour archive : accessible mais hors index
    '/old': {
      robots: false,
      headers: { 'X-Robots-Tag': 'noindex, follow' }
    },
    '/old/**': {
      robots: false,
      headers: { 'X-Robots-Tag': 'noindex, follow' }
    },
    // La refonte est passée à la racine — on préserve les URLs déjà indexées
    '/refonte': { redirect: { to: '/', statusCode: 301 } },
    '/refonte/projets': { redirect: { to: '/projets', statusCode: 301 } },
    '/refonte/projets/**': { redirect: { to: '/projets/**', statusCode: 301 } },
    '/refonte/prestations': { redirect: { to: '/prestations', statusCode: 301 } },
    '/refonte/contact': { redirect: { to: '/contact', statusCode: 301 } },
    '/refonte/mentions-legales': { redirect: { to: '/mentions-legales', statusCode: 301 } },
    '/refonte/cgu': { redirect: { to: '/cgu', statusCode: 301 } },
    '/refonte/confidentialite': { redirect: { to: '/confidentialite', statusCode: 301 } },
    '/refonte/plan-du-site': { redirect: { to: '/plan-du-site', statusCode: 301 } }
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    adminAllowedEmails: process.env.ADMIN_ALLOWED_EMAILS || 'wigame446@gmail.com',
    adminSetupSecret: process.env.ADMIN_SETUP_SECRET || '',
    public: {
      siteUrl,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      adminAllowedEmails: process.env.ADMIN_ALLOWED_EMAILS || 'wigame446@gmail.com'
    }
  }
})
