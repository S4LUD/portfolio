import { memo, useMemo, useRef, useState } from 'react'
import { Blocks, BrainCircuit, Cable, Globe, Smartphone } from 'lucide-react'
import { projectFilters, projects } from '../../../data/portfolioData'
import {
  chipClass,
  contentWidthClass,
  sectionTitleClass,
  strongBadgeClass,
  subtleBadgeClass,
  subtlePanelClass,
} from '../../ui/shared/uiClasses'

const projectTypeMeta = {
  Mobile: {
    icon: Smartphone,
    accentClass: 'from-[#76ddff]/34 via-[#5f8fff]/24 to-transparent dark:from-[#63d5ff]/18 dark:via-[#4b89ff]/12 dark:to-transparent',
    iconClass: 'text-[#86b9ff]',
    profileLabel: 'Mobile-first build',
  },
  Web: {
    icon: Globe,
    accentClass: 'from-[#9b94ff]/30 via-[#6f93ff]/22 to-transparent dark:from-[#8c8cff]/16 dark:via-[#5d87ff]/10 dark:to-transparent',
    iconClass: 'text-[#9fb4ff]',
    profileLabel: 'Web platform',
  },
  Automation: {
    icon: Cable,
    accentClass: 'from-[#8ce9bc]/34 via-[#f0bb72]/22 to-transparent dark:from-[#7be2b0]/18 dark:via-[#f4b15c]/10 dark:to-transparent',
    iconClass: 'text-[#8fd9bb]',
    profileLabel: 'Integration system',
  },
}

const featuredFocusPoints = {
  'quantum-nexus': ['Game systems', 'AI turns', 'Realtime-ready', 'Multilingual'],
  'medical-avenue': ['Native flows', 'Secure access', 'Notifications', 'Mobile infra'],
  'medical-avenue-core': ['Admin tooling', 'Structured data', 'Auth flows', 'Web ops'],
  'ghl-xendit-backend-v2': ['OAuth flow', 'Webhooks', 'Checkout', 'Outbox delivery'],
}

function getProjectMeta(type) {
  return projectTypeMeta[type] ?? projectTypeMeta.Web
}

const projectSurfaceClass = `${subtlePanelClass} rounded-[24px] shadow-[0_18px_40px_var(--project-panel-shadow),inset_0_1px_0_var(--project-panel-inset)]`

function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const filterRefs = useRef([])

  const filteredProjects = useMemo(
    () => (activeFilter === 'All' ? projects : projects.filter((project) => project.type === activeFilter)),
    [activeFilter],
  )

  const featuredProject = filteredProjects.find((project) => project.featured) ?? filteredProjects[0]
  const gridProjects = filteredProjects.filter((project) => project.id !== featuredProject?.id)

  const featuredMeta = featuredProject ? getProjectMeta(featuredProject.type) : null
  const featuredFocus = featuredProject ? featuredFocusPoints[featuredProject.id] ?? [] : []

  const handleFilterKeyDown = (event, index) => {
    if (!projectFilters.length) {
      return
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      filterRefs.current[(index + 1) % projectFilters.length]?.focus()
      return
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      filterRefs.current[(index - 1 + projectFilters.length) % projectFilters.length]?.focus()
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      filterRefs.current[0]?.focus()
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      filterRefs.current[projectFilters.length - 1]?.focus()
    }
  }

  return (
    <section className={`relative mt-8 mb-10 px-5 max-sm:mt-7 max-sm:mb-8 max-sm:px-3 ${contentWidthClass}`}>
      <div className="mb-4">
        <h2 className={`${sectionTitleClass} max-w-[40rem]`}>
          Automation systems, web apps, and mobile products built for real-world execution.
        </h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2.5" role="toolbar" aria-label="Project filters">
        {projectFilters.map((filter) => {
          const isActive = filter === activeFilter
          const filterIndex = projectFilters.indexOf(filter)

          return (
            <button
              key={filter}
              ref={(element) => {
                filterRefs.current[filterIndex] = element
              }}
              type="button"
              onClick={() => setActiveFilter(filter)}
              onKeyDown={(event) => handleFilterKeyDown(event, filterIndex)}
              aria-pressed={isActive}
              className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-[0.85rem] font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] ${
                isActive
                  ? 'bg-[var(--button-primary-from)] text-white shadow-[0_10px_20px_var(--button-primary-shadow)]'
                  : 'bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)] hover:bg-[var(--theme-toggle-hover-bg)]'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {featuredProject ? (
        <article className={`${projectSurfaceClass} relative mb-4 overflow-hidden p-5 max-sm:p-4`}>
          <div
            style={{ opacity: 'var(--project-glow-opacity)' }}
            className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-r ${featuredMeta?.accentClass ?? ''} blur-2xl`}
          />

          <div className="relative grid grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] gap-5 max-lg:grid-cols-1">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={strongBadgeClass}>
                  {featuredProject.type}
                </span>
                <span className={subtleBadgeClass}>
                  {featuredProject.engagement}
                </span>
              </div>

              <div className="mt-4 flex items-start gap-4 max-sm:flex-col max-sm:gap-3">
                <div className={`inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-[18px] bg-[var(--button-subtle-bg)] shadow-[0_12px_24px_var(--soft-shadow)] ${featuredMeta?.iconClass ?? ''}`}>
                  {featuredMeta?.icon ? <featuredMeta.icon className="h-6 w-6" /> : null}
                </div>

                <div>
                  <p className="m-0 text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    {featuredMeta?.profileLabel}
                  </p>
                  <h3 className="mt-2 mb-3 text-[1.65rem] leading-[1.08] font-bold text-[var(--text-strong)] max-sm:text-[1.4rem]">
                    {featuredProject.title}
                  </h3>
                  <p className="m-0 max-w-[42rem] text-[1rem] leading-8 text-[var(--text-muted)]">
                    {featuredProject.summary}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5">
                <div>
                  <p className="mb-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    What it is
                  </p>
                  <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                    {featuredProject.challenge}
                  </p>
                </div>

                <div>
                  <p className="mb-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    What I built
                  </p>
                  <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                    {featuredProject.solution}
                  </p>
                </div>

                <div>
                  <p className="mb-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    Why it matters
                  </p>
                  <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                    {featuredProject.outcome}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid content-start gap-3.5 self-start">
              <div className={`${subtlePanelClass} rounded-[24px] p-5`}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[18px] bg-[var(--input-bg)] px-4 py-3 shadow-[inset_0_1px_0_var(--project-panel-inset)]">
                      <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                        Type
                      </p>
                      <p className="mt-1 m-0 text-[0.95rem] font-semibold text-[var(--text-strong)]">
                        {featuredProject.type}
                      </p>
                    </div>

                    <div className="rounded-[18px] bg-[var(--input-bg)] px-4 py-3 shadow-[inset_0_1px_0_var(--project-panel-inset)]">
                      <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                        Origin
                      </p>
                      <p className="mt-1 m-0 text-[0.95rem] font-semibold text-[var(--text-strong)]">
                        {featuredProject.engagement}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                      Focus
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
                      {featuredFocus.map((item) => (
                      <div key={item} className="inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-[var(--input-bg)] px-3.5 text-[0.88rem] font-semibold text-[var(--text-soft)] shadow-[inset_0_1px_0_var(--project-panel-inset)]">
                          <BrainCircuit className="h-4 w-4 text-[var(--button-subtle-text)]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                      Stack
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {featuredProject.stack.map((item) => (
                        <span key={item} className={chipClass}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {featuredProject.sidePanel === 'snapshot' ? (
                <div className={`${subtlePanelClass} rounded-[24px] p-5`}>
                  <p className="mb-2 text-[0.85rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    Project Snapshot
                  </p>
                  <div className="rounded-[20px] bg-linear-to-br from-[var(--input-bg)] to-[var(--project-panel-bg)] p-4 shadow-[inset_0_1px_0_var(--project-panel-inset)]">
                    <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                      A mobile-first build combining gameplay systems, app architecture, and reusable UI foundations for a polished cross-screen experience.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={subtleBadgeClass}>
                        Personal build
                      </span>
                      <span className={subtleBadgeClass}>
                        Systems-driven
                      </span>
                    </div>
                  </div>
                </div>
              ) : featuredProject.sidePanel === 'client-note' ? (
                <div className={`${subtlePanelClass} rounded-[24px] p-5`}>
                  <p className="mb-2 text-[0.85rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    Client Scope
                  </p>
                  <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                    {featuredProject.clientNote}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      ) : null}

      <div className="grid items-start grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {gridProjects.map((project) => {
          const meta = getProjectMeta(project.type)
          const Icon = meta.icon

          return (
            <article key={project.id} className={`${projectSurfaceClass} self-start p-[1.1rem] max-sm:p-4`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-[14px] bg-linear-to-br ${meta.accentClass} ${meta.iconClass}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className={strongBadgeClass}>
                  {project.type}
                </span>
                <span className={subtleBadgeClass}>
                  {project.engagement}
                </span>
              </div>

              <h3 className="mt-3.5 mb-2 text-[1.08rem] font-bold text-[var(--text-strong)]">{project.title}</h3>
              <p className="m-0 text-[0.95rem] leading-7 text-[var(--text-muted)]">{project.summary}</p>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className={chipClass}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--project-panel-border)] pt-4">
                <span className="inline-flex items-center gap-2 text-[0.84rem] font-semibold text-[var(--text-soft)]">
                  <Blocks className="h-4 w-4 text-[var(--button-subtle-text)]" />
                  {project.engagement === 'Personal' ? 'Independent build' : project.clientNote}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default memo(ProjectsSection)
