import { memo } from 'react'
import { Cable, Globe, Smartphone, Server, Palette } from 'lucide-react'
import { contentWidthClass } from '../../ui/shared/uiClasses'
import { useInView } from '../../../hooks/useInView'

const skillCategories = [
  {
    label: 'Mobile',
    icon: Smartphone,
    items: ['React Native', 'Expo', 'Expo Router', 'Native APIs'],
    level: 0.92,
    color: '#86b9ff',
  },
  {
    label: 'Web',
    icon: Globe,
    items: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Prisma'],
    level: 0.88,
    color: '#9fb4ff',
  },
  {
    label: 'Automation',
    icon: Cable,
    items: ['Zapier', 'Webhooks', 'API Integration', 'JavaScript'],
    level: 0.9,
    color: '#8fd9bb',
  },
  {
    label: 'Backend',
    icon: Server,
    items: ['Node.js', 'Bun', 'Express', 'Supabase', 'PostgreSQL'],
    level: 0.82,
    color: '#b794f4',
  },
]

function SkillBar({ label, level, color, index }) {
  const [ref, inView] = useInView({ threshold: 0.3 })

  return (
    <div ref={ref} className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[0.82rem] font-semibold text-[var(--text-soft)]">{label}</span>
        <span
          className="text-[0.75rem] font-bold tabular-nums transition-opacity duration-500"
          style={{ color, opacity: inView ? 1 : 0 }}
        >
          {Math.round(level * 100)}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-[var(--input-bg)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: inView ? `${level * 100}%` : '0%',
            backgroundColor: color,
            opacity: 0.7,
            transitionDelay: `${index * 100}ms`,
          }}
        />
      </div>
    </div>
  )
}

function SkillsSection() {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.05 })

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`relative px-3 sm:px-4 md:px-5 ${contentWidthClass}`}
    >
      <div
        className="reveal"
        data-revealed={sectionInView}
        style={{ transitionDelay: '0ms' }}
      >
        <h2 className="m-0 text-[clamp(1.1rem,2vw,1.55rem)] leading-[1.4] text-[var(--text-strong)]">
          Tech & craft.
        </h2>
        <p className="mt-2 mb-0 max-w-[32rem] text-[0.96rem] leading-7 text-[var(--text-muted)]">
          The tools and stacks I reach for most — from mobile and web to automation
          and backend systems.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {skillCategories.map((category, catIndex) => {
          const Icon = category.icon

          return (
            <div
              key={category.label}
              className="reveal rounded-[20px] border border-[var(--project-panel-border)] bg-[var(--project-panel-bg)] p-4 shadow-[inset_0_1px_0_var(--project-panel-inset)] transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_20px_40px_var(--soft-shadow)]"
              data-revealed={sectionInView}
              style={{ transitionDelay: `${100 + catIndex * 100}ms` }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[12px]"
                  style={{ backgroundColor: `${category.color}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color: category.color }} />
                </span>
                <span className="text-[0.92rem] font-bold text-[var(--text-strong)]">
                  {category.label}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex min-h-7 items-center rounded-full px-2.5 text-[0.75rem] font-semibold"
                    style={{ backgroundColor: `${category.color}12`, color: category.color }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <SkillBar
                label="Proficiency"
                level={category.level}
                color={category.color}
                index={catIndex}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default memo(SkillsSection)
