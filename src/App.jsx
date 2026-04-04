import { useCallback, useEffect, useMemo, useState } from 'react'
import FloatingContactBar from './components/layout/FloatingContactBar/FloatingContactBar'
import HeroSection from './components/sections/HeroSection/HeroSection'
import SystemsOverviewSection from './components/sections/SystemsOverviewSection/SystemsOverviewSection'
import ToolsStackSection from './components/sections/ToolsStackSection/ToolsStackSection'
import ContactModal from './components/ui/ContactModal/ContactModal'
import StackMarquee from './components/ui/StackMarquee/StackMarquee'

const THEME_STORAGE_KEY = 'portfolio-theme-preference'

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
      ? storedTheme
      : 'system'
  })
  const resolvedTheme = useMemo(
    () => (themePreference === 'system' ? getSystemTheme() : themePreference),
    [themePreference],
  )
  const openContact = useCallback(() => setIsContactOpen(true), [])
  const closeContact = useCallback(() => setIsContactOpen(false), [])
  const updateThemePreference = useCallback((nextTheme) => {
    setThemePreference(nextTheme)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedTheme
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
  }, [themePreference])

  useEffect(() => {
    if (themePreference !== 'system') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      document.documentElement.dataset.theme = mediaQuery.matches ? 'dark' : 'light'
      document.documentElement.style.colorScheme = mediaQuery.matches ? 'dark' : 'light'
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themePreference])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--app-bg)] text-[var(--text-strong)]">
      <section className="relative z-10">
        <HeroSection themePreference={themePreference} onThemeChange={updateThemePreference} />
        <StackMarquee />
        <SystemsOverviewSection />
        <ToolsStackSection />
        <FloatingContactBar onOpenContact={openContact} />
      </section>
      <ContactModal open={isContactOpen} onClose={closeContact} />
    </main>
  )
}

export default App
