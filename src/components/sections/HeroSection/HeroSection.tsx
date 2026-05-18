import { memo } from 'react'
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
      className="relative overflow-hidden pt-0 backdrop-blur-[6px]"
      style={{
        backgroundColor: 'var(--hero-bg)',
        backgroundImage: `linear-gradient(var(--hero-overlay), var(--hero-overlay))`,
      }}
    >
      <Header themePreference={themePreference} onThemeChange={onThemeChange} />

      <section
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
          <h1 className="m-0 max-w-none text-[2.8rem] leading-[0.95] font-bold tracking-[-0.05em] text-[var(--text-strong)] sm:text-[3.15rem] md:max-w-[8ch] md:text-[clamp(2.5rem,5vw,4.3rem)]">
            Web, Mobile & Automation
          </h1>
          <p className="mt-4 mb-4 max-w-[28rem] text-[1.02rem] leading-7 text-[var(--text-muted)]">
            Need a website, app, or automation? Let&apos;s build it.
          </p>

          <ul className="mb-5 grid list-none gap-2.5 p-0">
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
          className="relative z-[1] w-full self-start p-4 md:p-[1.1rem]"
        />
      </section>
    </section>
  )
}

export default memo(HeroSection)
