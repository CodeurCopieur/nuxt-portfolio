import { isAppLocale, pickLocale, type AppLocale } from '@/utils/locale'

export default defineNuxtPlugin({
  name: 'portfolio-locale',
  enforce: 'post',
  setup() {
    const cookie = useCookie<AppLocale | null>('portfolio-locale', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax'
    })

    const queryLang = useRoute().query.lang
    if (isAppLocale(queryLang)) cookie.value = queryLang
    else if (!isAppLocale(cookie.value) && import.meta.server) {
      cookie.value = pickLocale(useRequestHeaders(['accept-language'])['accept-language'])
    }

    const { locale } = useLocale()
    updateSiteConfig({
      currentLocale: locale
    })
    useHead(() => ({
      htmlAttrs: { lang: locale.value }
    }))
  }
})
