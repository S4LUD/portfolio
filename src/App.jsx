import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FloatingContactBar from './components/layout/FloatingContactBar/FloatingContactBar'
import HeroSection from './components/sections/HeroSection/HeroSection'
import ContactSection from './components/sections/ContactSection/ContactSection'
import ProjectsSection from './components/sections/ProjectsSection/ProjectsSection'
import { trackPortfolioView } from './lib/supabase/pageViews'

const THEME_STORAGE_KEY = 'portfolio-theme-preference'

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [floatingBarHeight, setFloatingBarHeight] = useState(0)
  const [contactNotice, setContactNotice] = useState({ type: '', message: '' })
  const contactSectionRef = useRef(null)
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
  const openContact = useCallback(() => {
    contactSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])
  const handleContactSuccess = useCallback((message) => {
    setContactNotice({ type: 'success', message })
  }, [])
  const updateThemePreference = useCallback((nextTheme) => {
    setThemePreference(nextTheme)
  }, [])
  const handleFloatingBarHeightChange = useCallback((nextHeight) => {
    setFloatingBarHeight(nextHeight)
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

  useEffect(() => {
    if (!contactNotice.message) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setContactNotice({ type: '', message: '' })
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [contactNotice.message])

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault()
    }

    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  useEffect(() => {
    trackPortfolioView().catch(() => {})
  }, [])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--app-bg)] text-[var(--text-strong)]">
      <section
        className="relative z-10 flex flex-col gap-8 sm:gap-10 md:gap-12"
        style={{
          paddingBottom: `calc(env(safe-area-inset-bottom) + ${floatingBarHeight}px + 4rem)`,
        }}
      >
        <HeroSection themePreference={themePreference} onThemeChange={updateThemePreference} />
        <ProjectsSection />
        <ContactSection sectionRef={contactSectionRef} onSubmitSuccess={handleContactSuccess} />
        <FloatingContactBar
          onOpenContact={openContact}
          onHeightChange={handleFloatingBarHeightChange}
        />
      </section>
      {contactNotice.message ? (
        <div
          aria-live="polite"
          className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+6.25rem)] z-30 max-w-[min(28rem,calc(100vw-2rem))] rounded-[18px] border border-[rgba(102,177,127,0.24)] bg-[var(--modal-bg)] px-4 py-3 text-[0.92rem] font-semibold text-[#2f7d51] shadow-[0_18px_36px_var(--panel-shadow),inset_0_1px_0_rgba(255,255,255,0.72)] max-sm:right-2 max-sm:left-2 max-sm:bottom-[calc(env(safe-area-inset-bottom)+5.5rem)]"
        >
          {contactNotice.message}
        </div>
      ) : null}
    </main>
  )
}

export default App
