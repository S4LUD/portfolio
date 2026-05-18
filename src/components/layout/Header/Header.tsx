import { memo } from 'react'
import logo from '../../../assets/logo.png'
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle'
import { contentWidthClass } from '../../ui/shared/uiClasses'

function Header({ themePreference, onThemeChange }) {
  return (
    <header
      className={`relative mb-7 flex items-center justify-between gap-4 pt-4 max-sm:pt-3 ${contentWidthClass}`}
    >
      <div className="grid h-13 w-13 place-items-center overflow-hidden">
        <img src={logo} alt="Logo" className="h-11 w-11 object-contain" />
      </div>
      <div className="ml-auto">
        <ThemeToggle value={themePreference} onChange={onThemeChange} />
      </div>
    </header>
  )
}

export default memo(Header)
