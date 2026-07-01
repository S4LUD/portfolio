import { memo } from 'react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { contentWidthClass } from '../../ui/shared/uiClasses'
import { useInView } from '../../../hooks/useInView'

const timelineItems = [
  {
    year: '2025 – 2026',
    title: 'Software Engineer',
    subtitle: 'Freelance & Contract',
    type: 'work',
    description:
      'Built mobile, web, and automation systems for clients across healthcare, payment processing, and business operations. Delivered production-ready React Native apps, Next.js platforms, and Zapier-based automation pipelines.',
  },
  {
    year: '2024',
    title: 'Automation & Integration Development',
    subtitle: 'Freelance',
    type: 'work',
    description:
      'Developed custom Zapier workflows, GoHighLevel integrations, and payment backend systems connecting Xendit and Supabase for business process automation.',
  },
  {
    year: '2022 – 2024',
    title: 'Independent Software Development',
    subtitle: 'Self-directed',
    type: 'work',
    description:
      'Built full-stack applications across mobile, web, and desktop. Developed Quantum Nexus, MacroHok, and various other projects spanning game systems, automation tools, and web platforms.',
  },
]

type TimelineItem = (typeof timelineItems)[0]

const iconMap = {
  work: Briefcase,
  education: GraduationCap,
}

function TimelineEntry({ item, index }: { item: TimelineItem; index: number }) {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const Icon = iconMap[item.type as keyof typeof iconMap] ?? Briefcase
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className="relative mb-8 grid grid-cols-[1fr_auto_1fr] items-start gap-4 max-md:grid-cols-[auto_1fr] max-md:gap-3"
    >
      {/* Desktop: alternating layout */}
      <div className="hidden md:block">
        <div
          className={`reveal rounded-[18px] border border-[var(--project-panel-border)] bg-[var(--project-panel-bg)] p-4 shadow-[inset_0_1px_0_var(--project-panel-inset)] ${
            isLeft ? '' : 'md:col-start-3'
          }`}
          data-revealed={inView}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
            {item.year}
          </span>
          <h3 className="mt-1 mb-0.5 text-[1rem] font-bold text-[var(--text-strong)]">
            {item.title}
          </h3>
          <p className="m-0 text-[0.82rem] font-semibold text-[var(--text-faint)]">
            {item.subtitle}
          </p>
          <p className="mt-2 mb-0 text-[0.9rem] leading-6 text-[var(--text-muted)]">
            {item.description}
          </p>
        </div>
      </div>

      {/* Timeline dot + line */}
      <div className="flex flex-col items-center max-md:order-first">
        <span
          className={`reveal inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-700 ${
            inView
              ? 'bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)] shadow-[0_0_0_4px_var(--accent-strong)]'
              : 'bg-[var(--input-bg)] text-[var(--text-faint)]'
          }`}
          data-revealed={inView}
          style={{ transitionDelay: `${index * 100 + 50}ms` }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        {index < timelineItems.length - 1 ? (
          <div className="h-full w-px bg-[var(--panel-border)]" />
        ) : null}
      </div>

      {/* Mobile: always right */}
      <div className="md:hidden">
        <div
          className="reveal rounded-[18px] border border-[var(--project-panel-border)] bg-[var(--project-panel-bg)] p-4 shadow-[inset_0_1px_0_var(--project-panel-inset)]"
          data-revealed={inView}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
            {item.year}
          </span>
          <h3 className="mt-1 mb-0.5 text-[0.95rem] font-bold text-[var(--text-strong)]">
            {item.title}
          </h3>
          <p className="m-0 text-[0.78rem] font-semibold text-[var(--text-faint)]">
            {item.subtitle}
          </p>
          <p className="mt-2 mb-0 text-[0.85rem] leading-6 text-[var(--text-muted)]">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function TimelineSection() {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.05 })

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className={`relative px-3 sm:px-4 md:px-5 ${contentWidthClass}`}
    >
      <div
        className="reveal"
        data-revealed={sectionInView}
        style={{ transitionDelay: '0ms' }}
      >
        <h2 className="m-0 text-[clamp(1.1rem,2vw,1.55rem)] leading-[1.4] text-[var(--text-strong)]">
          Path & experience.
        </h2>
        <p className="mt-2 mb-0 max-w-[32rem] text-[0.96rem] leading-7 text-[var(--text-muted)]">
          The projects, roles, and skills that shaped how I build software.
        </p>
      </div>

      <div className="relative mt-8 max-md:mt-6">
        {timelineItems.map((item, index) => (
          <TimelineEntry key={`${item.year}-${item.title}`} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}

export default memo(TimelineSection)
