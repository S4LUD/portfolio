import { memo } from 'react'
import logo from '../../../assets/logo.png'
import sampleFlow1 from '../../../assets/sample_flow_1.png'
import sampleFlow2 from '../../../assets/sample_flow_2.png'
import { heroStats } from '../../../data/portfolioData'
import Header from '../../layout/Header/Header'
import NestedPanel from '../../ui/NestedPanel/NestedPanel'
import WorkflowShowcase from '../../ui/WorkflowShowcase/WorkflowShowcase'
import { contentWidthClass } from '../../ui/shared/uiClasses'

function HeroSection({ themePreference, onThemeChange }) {
  return (
    <section
      className="relative overflow-hidden pt-0 pb-6 backdrop-blur-[6px] max-sm:pb-4"
      style={{
        backgroundColor: 'var(--hero-bg)',
        backgroundImage: `linear-gradient(var(--hero-overlay), var(--hero-overlay)), url(${logo})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '64px',
        backgroundPosition: '0 0',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.011] md:hidden"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '64px',
          backgroundPosition: '0 0',
        }}
      />

      <Header themePreference={themePreference} onThemeChange={onThemeChange} />

      <section
        className={`relative grid items-start grid-cols-[minmax(0,0.92fr)_minmax(0,1.45fr)] gap-[1.2rem] rounded-[28px] px-5 max-md:grid-cols-1 max-sm:rounded-[22px] max-sm:px-3 ${contentWidthClass}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-18 bottom-0 z-0 max-md:hidden">
          <NestedPanel
            className="absolute left-[28%] top-[42%] h-[58%] w-[26%] rounded-[22px] border border-[var(--panel-border)] bg-[var(--nested-panel-bg)] backdrop-blur-[6px]"
            bodyClass="[background-image:radial-gradient(var(--panel-dot-color)_2px,transparent_2px)] [background-size:24px_24px]"
          />
          <NestedPanel
            className="absolute left-[16%] top-[64%] h-[34%] w-[22%] rounded-[20px] border border-[var(--panel-border)] bg-[var(--nested-panel-bg-soft)] backdrop-blur-[5px]"
            bodyClass="[background-image:radial-gradient(var(--panel-dot-color-soft)_2px,transparent_2px)] [background-size:24px_24px]"
            toolbarHeight="h-8"
            dotSize="h-[0.3rem] w-[0.3rem]"
          />
          <NestedPanel
            className="absolute left-[18%] bottom-[-18%] h-[26%] w-[16%] rounded-[18px] border border-[var(--panel-border)] bg-[var(--nested-panel-bg-faint)] backdrop-blur-[5px]"
            bodyClass="[background-image:radial-gradient(var(--panel-dot-color-soft)_2px,transparent_2px)] [background-size:24px_24px]"
            toolbarHeight="h-8"
            dotSize="h-[0.3rem] w-[0.3rem]"
          />
        </div>

        <div className="relative z-[1] flex flex-col justify-center py-[2.1rem] max-sm:py-4">
          <h1 className="m-0 max-w-[8ch] text-[clamp(2.5rem,5vw,4.3rem)] leading-[0.95] font-bold tracking-[-0.05em] text-[var(--text-strong)] max-sm:max-w-none max-sm:text-[2.8rem]">
            Web, Mobile & Automation
          </h1>
          <p className="mt-4 mb-5 max-w-[28rem] text-[1.02rem] leading-7 text-[var(--text-muted)]">
            Need a website, app, or automation? Let&apos;s build it.
          </p>

          <ul className="mb-6 grid list-none gap-[0.65rem] p-0">
            {heroStats.map((stat) => (
              <li
                key={stat}
                className="relative pl-4 text-[0.95rem] leading-6 text-[var(--text-soft)] before:absolute before:top-[0.55rem] before:left-0 before:h-[0.4rem] before:w-[0.4rem] before:rounded-full before:bg-linear-to-br before:from-[#79d9b5] before:to-[#5d87ff] before:content-['']"
              >
                {stat}
              </li>
            ))}
          </ul>
        </div>

        <WorkflowShowcase
          imageSources={[sampleFlow1, sampleFlow2]}
          className="relative z-[1] w-full self-start p-[1.1rem] max-sm:p-4"
        />
      </section>
    </section>
  )
}

export default memo(HeroSection)
