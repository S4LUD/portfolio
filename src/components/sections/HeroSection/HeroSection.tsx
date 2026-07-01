import { memo, useEffect, useState } from 'react'
import sampleFlow1 from '../../../assets/sample_flow_1.png'
import sampleFlow2 from '../../../assets/sample_flow_2.png'
import { heroStats } from '../../../data/portfolioData'
import Header from '../../layout/Header/Header'
import NestedPanel from '../../ui/NestedPanel/NestedPanel'
import WorkflowShowcase from '../../ui/WorkflowShowcase/WorkflowShowcase'
import { contentWidthClass } from '../../ui/shared/uiClasses'
import { useInView } from '../../../hooks/useInView'

const taglines = [
  'Ship-ready software for healthcare, business, and automation.',
  'Mobile apps · Web platforms · Automation workflows.',
]

function CyclingTagline() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % taglines.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-grid relative overflow-hidden" style={{ minHeight: '1.8em' }}>
      {taglines.map((line, index) => (
        <span
          key={line}
          className="col-start-1 row-start-1 transition-all duration-500"
          style={{
            opacity: index === activeIndex ? 1 : 0,
            transform: index === activeIndex ? 'translateY(0)' : index < activeIndex ? 'translateY(-8px)' : 'translateY(8px)',
            pointerEvents: index === activeIndex ? 'auto' : 'none',
          }}
        >
          {line}
        </span>
      ))}
    </span>
  )
}

function HeroSection({ themePreference, onThemeChange }) {
  const [contentRef, contentInView] = useInView({ threshold: 0.2 })

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-0 hero-gradient"
      style={{
        backgroundColor: 'var(--hero-bg)',
        backgroundImage: `linear-gradient(var(--hero-overlay), var(--hero-overlay))`,
      }}
    >
      <Header themePreference={themePreference} onThemeChange={onThemeChange} />

      <section
        ref={contentRef}
        className={`relative grid items-start gap-5 rounded-[22px] px-3 sm:px-4 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.45fr)] md:rounded-[28px] md:px-5 ${contentWidthClass}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-18 bottom-0 z-0 hidden md:block">
          <NestedPanel className="absolute left-[28%] top-[42%] h-[58%] w-[26%] rounded-[22px] border border-[var(--nested-panel-border)] bg-[var(--nested-panel-bg)] backdrop-blur-[6px]" />
          <NestedPanel
            className="absolute left-[16%] top-[64%] h-[34%] w-[22%] rounded-[20px] border border-[var(--nested-panel-border)] bg-[var(--nested-panel-bg-soft)] backdrop-blur-[5px]"
            toolbarHeight="h-8"
            dotSize="h-[0.3rem] w-[0.3rem]"
          />
          <NestedPanel
            className="absolute left-[18%] bottom-[-18%] h-[26%] w-[16%] rounded-[18px] border border-[var(--nested-panel-border)] bg-[var(--nested-panel-bg-faint)] backdrop-blur-[5px]"
            toolbarHeight="h-8"
            dotSize="h-[0.3rem] w-[0.3rem]"
          />
        </div>

        <div className="relative z-[1] flex flex-col justify-center py-4 sm:py-5 md:py-8">

          <h1
            className="reveal m-0 mt-3 max-w-none text-[2.8rem] leading-[0.95] font-bold tracking-[-0.05em] text-[var(--text-strong)] sm:text-[3.15rem] md:max-w-[8ch] md:text-[clamp(2.5rem,5vw,4.3rem)]"
            data-revealed={contentInView}
            style={{ transitionDelay: '100ms' }}
          >
            Lance Ivan Salud
          </h1>

          <p
            className="reveal mt-4 mb-4 max-w-[28rem] text-[1.02rem] leading-7 text-[var(--text-muted)]"
            data-revealed={contentInView}
            style={{ transitionDelay: '200ms' }}
          >
            <CyclingTagline />
          </p>

          <ul className="mb-5 grid list-none gap-2.5 p-0">
            {heroStats.map((stat, index) => (
              <li
                key={stat}
                className="reveal relative pl-4 text-[0.95rem] leading-6 text-[var(--text-soft)] before:absolute before:top-[0.55rem] before:left-0 before:h-[0.4rem] before:w-[0.4rem] before:rounded-full before:bg-linear-to-br before:from-[#79d9b5] before:to-[#5d87ff] before:content-['']"
                data-revealed={contentInView}
                style={{ transitionDelay: `${300 + index * 120}ms` }}
              >
                {stat}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="reveal"
          data-revealed={contentInView}
          style={{ transitionDelay: '500ms' }}
        >
          <WorkflowShowcase
            imageSources={[sampleFlow1, sampleFlow2]}
            className="relative z-[1] w-full self-start p-4 md:p-[1.1rem]"
          />
        </div>
      </section>
    </section>
  )
}

export default memo(HeroSection)
