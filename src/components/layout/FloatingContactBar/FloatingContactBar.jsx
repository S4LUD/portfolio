import { memo } from 'react'
import { surfaceClass } from '../../ui/shared/uiClasses'

function FloatingContactBar({ onOpenContact }) {
  return (
    <footer
      className={`${surfaceClass} fixed bottom-4 left-1/2 z-20 flex w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2 items-center justify-between gap-4 p-[1rem_1.2rem] max-sm:bottom-2 max-sm:grid max-sm:w-[calc(100vw-1rem)] max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:items-center max-sm:gap-3 max-sm:p-4`}
    >
      <div>
        <p className="m-0 font-extrabold text-[#40506e]">Lance Ivan Salud</p>
        <p className="mt-[0.35rem] mb-0 text-[0.94rem] text-[#7183a2]">
          Software Engineer | Automation Specialist
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenContact}
        className="ml-auto inline-flex min-h-[2.9rem] items-center justify-center rounded-full bg-linear-to-br from-[#6b98ff] to-[#4d72e8] px-5 text-white no-underline shadow-[0_10px_20px_rgba(92,130,229,0.28)] transition-transform duration-200 hover:-translate-y-px max-sm:ml-0 max-sm:self-center max-sm:justify-self-end"
      >
        Get In Touch
      </button>
    </footer>
  )
}

export default memo(FloatingContactBar)
