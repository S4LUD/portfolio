import { memo, useEffect, useState } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { surfaceClass, toneClasses } from '../shared/uiClasses'

function WorkflowShowcase({ workflow, className = '', imageSrc, imageSources, children }) {
  const hasCustomContent = Boolean(children)
  const slides = imageSources?.length ? imageSources : imageSrc ? [imageSrc] : []
  const hasSlides = slides.length > 0
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 15000)

    return () => window.clearInterval(intervalId)
  }, [isPaused, slides.length])

  return (
    <article
      className={`relative border border-[var(--panel-border)] bg-[var(--workflow-panel-bg)] p-4 ${surfaceClass} ${className}`.trim()}
    >
      <div className="flex items-center justify-between px-2 pb-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-[0.36rem] w-[0.36rem] rounded-full bg-[var(--toolbar-dot)]" />
          <span className="h-[0.36rem] w-[0.36rem] rounded-full bg-[var(--toolbar-dot)]" />
          <span className="h-[0.36rem] w-[0.36rem] rounded-full bg-[var(--toolbar-dot)]" />
        </div>
        <div className="flex items-center gap-2 text-[var(--toolbar-dot)]" aria-hidden="true">
          <Minus className="h-3.5 w-3.5 stroke-[2.2]" />
          <Square className="h-3.5 w-3.5 stroke-[1.8]" />
          <X className="h-3.5 w-3.5 stroke-[2.1]" />
        </div>
      </div>
      <div className="mx-[-1rem] border-b border-[var(--panel-border)]" />

      <div
        className={`relative mt-4 overflow-hidden ${
          hasCustomContent
            ? ''
            : hasSlides
              ? ''
              : workflow.tall
                ? 'min-h-[23rem] max-sm:min-h-64'
                : 'min-h-[19rem] max-sm:min-h-64'
        }`}
      >
        {hasCustomContent ? children : null}

        {hasSlides ? (
          <div
            className="relative z-[1] h-auto md:h-[20rem]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex h-auto transition-transform duration-700 ease-out md:h-full"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slideSrc, index) => (
                <div key={`${slideSrc}-${index}`} className="flex h-auto w-full shrink-0 items-center md:h-full">
                  <img
                    src={slideSrc}
                    alt={`Workflow preview ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    sizes="(max-width: 767px) 100vw, 58vw"
                    className="block h-auto w-full object-contain object-center md:h-full"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {hasSlides || hasCustomContent ? null : (
          <svg
            className="absolute inset-0 z-[1] h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {workflow.lines.map((line, index) => (
              <line
                key={`${line.x1}-${line.y1}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                pathLength="100"
                className="stroke-[var(--workflow-line)] stroke-[0.8] stroke-linecap-round opacity-85"
              />
            ))}
          </svg>
        )}

        {hasSlides || hasCustomContent
          ? null
          : workflow.nodes.map((node) => (
              <div
                key={`${node.label}-${node.x}-${node.y}`}
                className={`absolute z-[2] inline-flex min-h-[3.8rem] min-w-[7.3rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[0.15rem] rounded-[18px] px-4 py-[0.9rem] text-center text-[0.92rem] leading-[1.05] font-extrabold text-white shadow-[0_16px_28px_rgba(105,126,168,0.2)] max-sm:min-h-12 max-sm:min-w-[5.5rem] max-sm:rounded-2xl max-sm:px-2 max-sm:py-[0.65rem] max-sm:text-[0.68rem] ${toneClasses[node.tone]}`}
                style={{ left: node.x, top: node.y }}
              >
                {node.label.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
                ))}
      </div>

      {hasSlides && slides.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((slideSrc, index) => (
            <span
              key={`${slideSrc}-dot-${index}`}
              aria-hidden="true"
              className={`h-2.5 rounded-full transition-all duration-200 ${
                activeSlide === index ? 'w-6 bg-[var(--accent-strong)]' : 'w-2.5 bg-[var(--indicator-muted)]'
              }`}
            />
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default memo(WorkflowShowcase)
