import { memo, useEffect, useRef } from 'react'
import { surfaceClass } from '../../ui/shared/uiClasses'

function FloatingContactBar({ onOpenContact, onHeightChange }) {
  const barRef = useRef(null)

  useEffect(() => {
    if (!barRef.current) {
      return undefined
    }

    const updateHeight = () => {
      onHeightChange?.(barRef.current?.offsetHeight ?? 0)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    resizeObserver.observe(barRef.current)
    window.addEventListener('resize', updateHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeight)
      onHeightChange?.(0)
    }
  }, [onHeightChange])

  return (
    <footer
      ref={barRef}
      className={`${surfaceClass} fixed bottom-2 left-1/2 z-20 grid w-[calc(100vw-1rem)] -translate-x-1/2 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-[0.9rem] shadow-[0_14px_30px_var(--panel-shadow),inset_0_1px_0_var(--panel-inset)] sm:bottom-3 sm:w-[min(1120px,calc(100vw-1.5rem))] md:bottom-4 md:flex md:w-[min(1120px,calc(100vw-2rem))] md:items-center md:justify-between md:gap-4 md:p-[0.9rem_1.1rem]`}
    >
      <div>
        <p className="m-0 font-extrabold text-[var(--text-strong)]">Lance Ivan Salud</p>
        <p className="mt-[0.35rem] mb-0 text-[0.88rem] text-[var(--text-muted)] sm:text-[0.92rem] md:text-[0.94rem]">
          Software Engineer | Automation Specialist
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenContact}
        className="inline-flex min-h-[2.9rem] items-center justify-center rounded-full bg-linear-to-br from-[var(--button-primary-from)] to-[var(--button-primary-to)] px-4 text-center text-white no-underline shadow-[0_10px_20px_var(--button-primary-shadow)] transition-transform duration-200 hover:-translate-y-px focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] sm:px-5 md:ml-auto"
        aria-label="Scroll to the Get In Touch section"
      >
        Get In Touch
      </button>
    </footer>
  )
}

export default memo(FloatingContactBar)
