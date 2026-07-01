import { memo, useEffect, useState } from 'react'

interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'hero', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

function StickyNav() {
  const [activeSection, setActiveSection] = useState('hero')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past the hero area (~viewport height)
      setVisible(window.scrollY > window.innerHeight * 0.7)

      // Determine active section via intersection — simpler: use scroll offsets
      const scrollY = window.scrollY + 120

      // Find all section elements and check which one is most visible
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el && scrollY >= el.offsetTop) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <nav
      aria-label="Section navigation"
      className="fixed top-3 left-1/2 z-30 -translate-x-1/2 rounded-full border border-[var(--panel-border)] bg-[var(--toolbar-bg)] px-2 py-1 shadow-[0_14px_30px_var(--panel-shadow)] backdrop-blur-[14px] transition-opacity duration-300"
    >
      <ul className="m-0 flex list-none items-center gap-0.5 p-0">
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(id)
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`inline-flex min-h-8 items-center rounded-full px-3 text-[0.78rem] font-semibold no-underline transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] ${
                  isActive
                    ? 'bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)] shadow-[inset_0_1px_0_var(--project-panel-inset)]'
                    : 'text-[var(--text-faint)] hover:text-[var(--text-soft)]'
                }`}
                aria-current={isActive ? 'true' : undefined}
              >
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default memo(StickyNav)
