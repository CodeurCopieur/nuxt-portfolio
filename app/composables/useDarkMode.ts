// composables/useDarkMode.ts
export function useDarkMode() {
    const isDark = useState('isDark', () => false)
    const toggle = () => {
      isDark.value = !isDark.value
      const root = document.documentElement
      root.classList.toggle('dark', isDark.value)
    }
    onMounted(() => {
      // option: lire/écrire localStorage
      if (localStorage.getItem('theme') === 'dark') {
        isDark.value = true
        document.documentElement.classList.add('dark')
      }
      watch(isDark, v => localStorage.setItem('theme', v ? 'dark' : 'light'))
    })
    return { isDark, toggle }
  }
  