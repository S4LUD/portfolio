import { ChevronDown, LaptopMinimal, MoonStar, SunMedium } from 'lucide-react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { toolbarPanelClass } from '../shared/uiClasses'

const themeOptions = [
  { value: 'light', label: 'Light', icon: SunMedium },
  { value: 'dark', label: 'Dark', icon: MoonStar },
  { value: 'system', label: 'System', icon: LaptopMinimal },
]

function ThemeToggle({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const activeOption = useMemo(
    () => themeOptions.find((option) => option.value === value) ?? themeOptions[2],
    [value],
  )

  const inactiveOptions = useMemo(
    () => themeOptions.filter((option) => option.value !== activeOption.value),
    [activeOption.value],
  )

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const focusTarget = menuRef.current?.querySelector('[role="menuitem"]')
    focusTarget?.focus()

    return undefined
  }, [open])

  const handleMenuKeyDown = (event) => {
    if (!menuRef.current) {
      return
    }

    const menuItems = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'))
    const currentIndex = menuItems.indexOf(document.activeElement)

    if (!menuItems.length) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % menuItems.length
      menuItems[nextIndex]?.focus()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1
      menuItems[nextIndex]?.focus()
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      menuItems[0]?.focus()
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      menuItems[menuItems.length - 1]?.focus()
    }
  }

  const ActiveIcon = activeOption.icon

  return (
    <div ref={rootRef} className="relative inline-flex" aria-label="Theme preference">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--toolbar-bg)] px-4 text-[0.84rem] font-semibold text-[var(--theme-toggle-active-text)] shadow-[0_10px_24px_var(--soft-shadow)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hero-bg)]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="theme-toggle-menu"
        aria-label={`Current theme preference: ${activeOption.label}. ${open ? 'Close' : 'Open'} theme options.`}
      >
        <ActiveIcon className="h-4 w-4" />
        <span>{activeOption.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          id="theme-toggle-menu"
          ref={menuRef}
          role="menu"
          aria-label="Select theme"
          onKeyDown={handleMenuKeyDown}
          className={`absolute top-[calc(100%+0.6rem)] right-0 z-30 min-w-[11rem] rounded-[20px] p-1.5 backdrop-blur-[12px] ${toolbarPanelClass}`}
        >
          {inactiveOptions.map(({ value: optionValue, label, icon }) => {
            const OptionIcon = icon

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onChange(optionValue)
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-[16px] px-3 text-left text-[0.84rem] font-semibold text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] hover:text-[var(--text-strong)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
                role="menuitem"
                aria-label={`Switch to ${label} theme`}
              >
                <OptionIcon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default memo(ThemeToggle)
