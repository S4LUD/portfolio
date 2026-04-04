import { LaptopMinimal, MoonStar, SunMedium } from 'lucide-react'
import { memo } from 'react'

const themeOptions = [
  { value: 'light', label: 'Light', icon: SunMedium },
  { value: 'dark', label: 'Dark', icon: MoonStar },
  { value: 'system', label: 'System', icon: LaptopMinimal },
]

function ThemeToggle({ value, onChange }) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-[var(--panel-border)] bg-[var(--toolbar-bg)] p-1 shadow-[0_10px_24px_var(--soft-shadow)]"
      aria-label="Theme preference"
    >
      {themeOptions.map(({ value: optionValue, label, icon }) => {
        const isActive = value === optionValue
        const ThemeIcon = icon

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 text-[0.82rem] font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-[var(--theme-toggle-active-bg)] text-[var(--theme-toggle-active-text)] shadow-[0_8px_18px_var(--soft-shadow)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--theme-toggle-hover-bg)] hover:text-[var(--text-strong)]'
            }`}
            aria-pressed={isActive}
            title={label}
          >
            <ThemeIcon className="h-4 w-4" />
            <span className="max-sm:sr-only">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default memo(ThemeToggle)
