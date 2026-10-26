// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

const emptyAppManifest = fileURLToPath(
  new URL('./stubs/empty-app-manifest.mjs', import.meta.url)
)

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
    'nuxt-schema-org',
    '@vercel/analytics/nuxt',
    '@vite-pwa/nuxt'
  ],
  css: ['@/assets/css/base.css'],
  site: {
    url: siteUrl,
    name: 'Widdy Louis',
    description:
      'Développeur front-end freelance à Paris. Interfaces Nuxt et Vue pour la banque, le luxe et la presse : rapides, accessibles et animées. 7 ans d’expérience.',
    defaultLocale: 'fr'
  },
  app: {
    head: {
      titleTemplate: '%s',
      meta: [
        {
          name: 'description',
          content:
            'Développeur front-end freelance à Paris. Interfaces Nuxt et Vue pour la banque, le luxe et la presse : rapides, accessibles et animées. 7 ans d’expérience.'
        },
        { name: 'theme-color', content: '#0b1a3a' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'LW' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
      script: [
        {
          innerHTML:
            "(function(){try{var h=document.documentElement;if(localStorage.getItem('rf-theme')==='light'){h.classList.add('rf-light')}var raw=localStorage.getItem('rf-a11y');if(!raw)return;var s=JSON.parse(raw);if(s.contrast)h.classList.add('rf-a11y-contrast');if(s.bigText)h.classList.add('rf-a11y-text');if(s.underline)h.classList.add('rf-a11y-links');if(s.motion)h.classList.add('rf-a11y-motion');if(s.cvd&&s.cvd!=='standard')h.setAttribute('data-rf-cvd',s.cvd)}catch(e){}})()",
          tagPriority: 'critical'
        }
      ]
    }
  },
  robots: {
    disallow: ['/admin', '/api/admin', '/old', '/game']
  },
  sitemap: {
    exclude: ['/admin/**', '/api/**', '/old', '/old/**', '/game', '/game/**'],
    sources: ['/api/__sitemap__/urls']
  },
  ogImage: {
    enabled: false
  },
  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,
    manifest: {
      id: '/',
      name: 'Widdy Louis',
      short_name: 'LW',
      description:
        'Widdy Louis — développeur front-end freelance. Interfaces web performantes, accessibles et animées (Nuxt, Vue).',
      lang: 'fr',
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait-primary',
      background_color: '#0b1a3a',
      theme_color: '#0b1a3a',
      categories: ['portfolio', 'productivity'],
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2,webmanifest}'],
      globIgnores: ['**/music/**', '**/admin/**'],
      navigateFallbackDenylist: [/^\/admin/, /^\/api/, /^\/old/]
    },
    client: {
      installPrompt: false,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      type: 'module'
    }
  },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  tailwindcss: { viewer: false },
  vite: {
    optimizeDeps: {
      include: ['leaflet', 'locomotive-scroll', 'scrollmagic', '@barba/core'],
      exclude: ['#app-manifest']
    },
    resolve: {
      alias: {
        // Vite analyse cet import virtuel avant l’alias interne de Nuxt.
        '#app-manifest': emptyAppManifest
      }
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
    '/game': {
      robots: false,
      headers: { 'X-Robots-Tag': 'noindex, follow' }
    },
    '/game/**': {
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
