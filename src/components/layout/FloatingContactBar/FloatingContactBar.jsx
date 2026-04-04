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
      className={`${surfaceClass} fixed bottom-4 left-1/2 z-20 flex w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2 items-center justify-between gap-4 p-[0.9rem_1.1rem] shadow-[0_14px_30px_var(--panel-shadow),inset_0_1px_0_var(--panel-inset)] max-sm:bottom-2 max-sm:grid max-sm:w-[calc(100vw-1rem)] max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:items-center max-sm:gap-3 max-sm:p-[0.9rem]`}
    >
      <div>
        <p className="m-0 font-extrabold text-[var(--text-strong)]">Lance Ivan Salud</p>
        <p className="mt-[0.35rem] mb-0 text-[0.94rem] text-[var(--text-muted)]">
          Software Engineer | Automation Specialist
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenContact}
        className="ml-auto inline-flex min-h-[2.9rem] items-center justify-center rounded-full bg-linear-to-br from-[var(--button-primary-from)] to-[var(--button-primary-to)] px-5 text-white no-underline shadow-[0_10px_20px_var(--button-primary-shadow)] transition-transform duration-200 hover:-translate-y-px focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] max-sm:ml-0 max-sm:self-center max-sm:justify-self-end"
        aria-label="Open the Get In Touch contact modal"
      >
        Get In Touch
      </button>
    </footer>
  )
}

export default memo(FloatingContactBar)
