import { memo } from 'react'
import { marqueeStacks } from '../../../data/portfolioData'
import { contentWidthClass } from '../shared/uiClasses'

function StackChip({ item }) {
  const src = `https://cdn.simpleicons.org/${item.icon}`

  return (
    <div
      className="flex h-12 shrink-0 items-center justify-center text-[#4f648d] transition-transform duration-200 hover:-translate-y-0.5"
      title={item.label}
      aria-label={item.label}
    >
      <img src={src} alt={item.label} className="h-9 w-auto max-w-none object-contain" draggable="false" />
    </div>
  )
}

function StackMarquee() {
  const loopItems = [...marqueeStacks, ...marqueeStacks]

  return (
    <section className="relative z-[9] -mt-1 pb-7 max-sm:pb-5">
      <div className={`${contentWidthClass}`}>
        <div
          className="relative overflow-hidden py-4 max-sm:py-3"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="stack-marquee flex w-max items-center gap-7 px-2 hover:[animation-play-state:paused] max-sm:gap-5">
            {loopItems.map((item, index) => (
              <StackChip key={`${item.label}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(StackMarquee)
