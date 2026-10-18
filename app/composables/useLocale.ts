import { LOCALE_OPTIONS, isAppLocale, type AppLocale } from '@/utils/locale'

export function useLocale() {
  const cookie = useCookie<AppLocale | null>('portfolio-locale', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })

  const locale = computed<AppLocale>(() => (isAppLocale(cookie.value) ? cookie.value : 'fr'))

  function setLocale(next: AppLocale) {
    cookie.value = next
  }

  return { locale, setLocale, locales: LOCALE_OPTIONS }
}
