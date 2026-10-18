import { uiCopy } from '@/i18n/ui'

export function useUi() {
  const { locale } = useLocale()
  const ui = computed(() => uiCopy[locale.value])
  return { ui, locale }
}
