import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const storageKey = "theme-preference"

const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light"
  }

  const stored = window.localStorage.getItem(storageKey)
  if (stored === "light" || stored === "dark") {
    return stored
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getPreferredTheme())

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem(storageKey, theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
