import { ref, onMounted } from 'vue'

export type ThemeMode = 'light' | 'dark'

const isDark = ref(true)

export const useTheme = () => {
  const initTheme = () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('etv-theme') as ThemeMode | null
    if (stored === 'light' || stored === 'dark') {
      isDark.value = stored === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('etv-theme', isDark.value ? 'dark' : 'light')
    }
    applyTheme()
  }

  const setTheme = (mode: ThemeMode) => {
    isDark.value = mode === 'dark'
    if (typeof window !== 'undefined') {
      localStorage.setItem('etv-theme', mode)
    }
    applyTheme()
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme
  }
}
