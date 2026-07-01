import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FloatingContactBar from './components/layout/FloatingContactBar/FloatingContactBar'
import StickyNav from './components/layout/StickyNav/StickyNav'
import HeroSection from './components/sections/HeroSection/HeroSection'
import ContactSection from './components/sections/ContactSection/ContactSection'
import ProjectsSection from './components/sections/ProjectsSection/ProjectsSection'
import SkillsSection from './components/sections/SkillsSection/SkillsSection'
import TimelineSection from './components/sections/TimelineSection/TimelineSection'
import { ArrowUp } from 'lucide-react'

const THEME_STORAGE_KEY = 'portfolio-theme-preference'

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [floatingBarHeight, setFloatingBarHeight] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
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
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 2)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--app-bg)] text-[var(--text-strong)]">
      <StickyNav />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4 focus:text-[#33415c] focus:shadow-lg focus:outline-hidden focus:ring-3 focus:ring-[var(--accent-strong)]"
      >
        Skip to main content
      </a>

      <section
        id="main-content"
        className="relative z-10 flex flex-col gap-8 sm:gap-10 md:gap-12"
        style={{
          paddingBottom: `calc(env(safe-area-inset-bottom) + ${floatingBarHeight}px + 4rem)`,
        }}
      >
        <HeroSection themePreference={themePreference} onThemeChange={updateThemePreference} />
        <ProjectsSection />
        <SkillsSection />
        <TimelineSection />
        <ContactSection sectionRef={contactSectionRef} />
        <FloatingContactBar
          onOpenContact={openContact}
          onHeightChange={handleFloatingBarHeightChange}
        />
      </section>

      {showBackToTop ? (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed right-4 bottom-20 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--toolbar-bg)] text-[var(--text-soft)] shadow-[0_10px_24px_var(--soft-shadow)] backdrop-blur-[10px] transition-all duration-200 hover:-translate-y-1 hover:text-[var(--text-strong)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] max-sm:right-3 max-sm:bottom-18"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      ) : null}
    </main>
  )
}

export default App
