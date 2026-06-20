import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { ThemeProviderContext, type Theme } from '@/components/theme'

type ThemeProviderProps = {
   children: ReactNode
   defaultTheme?: Theme
   storageKey?: string
}

function getStoredTheme(storageKey: string, defaultTheme: Theme) {
   return (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme
}

function getSystemTheme() {
   return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme' }: ThemeProviderProps) {
   const [theme, setThemeState] = useState<Theme>(() => getStoredTheme(storageKey, defaultTheme))

   useEffect(() => {
      const root = window.document.documentElement
      const appliedTheme = theme === 'system' ? getSystemTheme() : theme

      root.classList.remove('light', 'dark')
      root.classList.add(appliedTheme)
   }, [theme])

   const value = useMemo(
      () => ({
         theme,
         setTheme: (nextTheme: Theme) => {
            localStorage.setItem(storageKey, nextTheme)
            setThemeState(nextTheme)
         },
      }),
      [storageKey, theme]
   )

   return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}
