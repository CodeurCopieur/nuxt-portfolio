export const APP_LOCALES = ['fr', 'en', 'es'] as const

export type AppLocale = (typeof APP_LOCALES)[number]

export const LOCALE_OPTIONS: Array<{ id: AppLocale, label: string, name: string }> = [
  { id: 'fr', label: 'FR', name: 'Français' },
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'es', label: 'ES', name: 'Español' }
]

export function isAppLocale(value: unknown): value is AppLocale {
  return value === 'fr' || value === 'en' || value === 'es'
}

/** Première langue reconnue dans un en-tête Accept-Language. */
export function pickLocale(header: string | null | undefined): AppLocale {
  const tags = (header || '')
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase() || '')
    .filter(Boolean)

  for (const tag of tags) {
    if (tag.startsWith('es')) return 'es'
    if (tag.startsWith('en')) return 'en'
    if (tag.startsWith('fr')) return 'fr'
  }

  return 'fr'
}
