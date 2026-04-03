import logo from '../../../assets/logo.png'
import {
  caseStudyPoints,
  detailWorkflow,
  overviewCards,
} from '../../../data/portfolioData'
import WorkflowShowcase from '../../ui/WorkflowShowcase/WorkflowShowcase'
import { contentWidthClass, sectionTitleClass, surfaceClass } from '../../ui/shared/uiClasses'

function SystemsOverviewSection() {
  return (
    <section
      className="relative overflow-hidden pt-7 pb-56 max-sm:pt-5 max-sm:pb-48"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.99), rgba(255, 255, 255, 0.99)), url(${logo})`,
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

      <section
        className={`relative mb-6 grid grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-[1.2rem] rounded-[28px] px-5 max-md:grid-cols-1 max-sm:rounded-[22px] max-sm:px-3 ${contentWidthClass}`}
      >
        <div className="grid gap-4">
          <div className="py-1">
            <p className="mb-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[#5b79aa]">
              Systems Overview
            </p>
            <h2 className={`${sectionTitleClass} max-w-[36rem]`}>
              Building scalable systems to automate complex workflows and integrate diverse
              platforms.
            </h2>
          </div>

          <div className="grid gap-[0.9rem]">
            {overviewCards.map((card) => (
              <article key={card.title} className={`${surfaceClass} p-[1.1rem_1.15rem] max-sm:p-4`}>
                <div>
                  <h3 className="m-0 text-[1.1rem] font-bold text-[#32425f]">{card.title}</h3>
                  <p className="mt-[0.35rem] mb-0 text-[0.94rem] text-[#7183a2]">{card.meta}</p>
                  <div className="mt-[0.85rem] flex flex-wrap gap-[0.45rem]">
                    {card.stack.map((item) => (
                      <span
                        key={item}
                        className="inline-flex min-h-8 items-center justify-center rounded-full bg-[rgba(239,244,255,0.96)] px-[0.8rem] text-[0.82rem] font-bold text-[#5d739a] shadow-[0_6px_18px_rgba(185,198,226,0.16)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                  <span className="text-[0.85rem] text-[#8190ab]">{card.note}</span>
                  <a
                    href="/"
                    onClick={(event) => event.preventDefault()}
                    className="inline-flex min-h-[2.2rem] items-center justify-center rounded-full bg-[#eef4ff] px-[0.95rem] font-bold text-[#6180bd] no-underline transition-transform duration-200 hover:-translate-y-px"
                  >
                    View Flow
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <WorkflowShowcase workflow={detailWorkflow} />

          <article className={`${surfaceClass} p-[1.35rem] max-sm:p-4`}>
            <p className="mb-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[#5b79aa]">
              Case Study
            </p>
            <h3 className="mt-[0.15rem] mb-[0.85rem] text-[1.25rem] font-bold text-[#32425f]">
              Intake to outreach in one connected path
            </h3>
            <ul className="m-0 grid gap-[0.7rem] pl-[1.1rem] leading-6 text-[#7183a2]">
              {caseStudyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </section>
  )
}

export default SystemsOverviewSection
