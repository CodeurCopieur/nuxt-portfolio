export type ThemeMode = 'dark' | 'light'

const THEME_STORAGE_KEY = 'rf-theme'

function readStoredMode(): ThemeMode | null {
  if (!import.meta.client) return null
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

export function useThemeMode() {
  const mode = useState<ThemeMode>('theme-mode', () => 'dark')

  function apply(next: ThemeMode) {
    mode.value = next
    document.documentElement.classList.toggle('rf-light', next === 'light')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* stockage indisponible */
    }
  }

  function toggle() {
    apply(mode.value === 'light' ? 'dark' : 'light')
  }

  onMounted(() => {
    const domLight = document.documentElement.classList.contains('rf-light')
    const stored = readStoredMode()
    const initial: ThemeMode = domLight || stored === 'light'
      ? 'light'
      : stored === 'dark'
        ? 'dark'
        : 'dark'
    if (initial !== mode.value) {
      mode.value = initial
      document.documentElement.classList.toggle('rf-light', initial === 'light')
    }
  })

  return { mode, toggle }
}
