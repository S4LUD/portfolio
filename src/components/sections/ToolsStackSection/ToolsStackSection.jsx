import { memo } from 'react'
import { stackGroups } from '../../../data/portfolioData'
import { contentWidthClass, sectionTitleClass, surfaceClass } from '../../ui/shared/uiClasses'

function ToolsStackSection() {
  return (
    <section className={`relative mb-5 rounded-[28px] px-5 max-sm:rounded-[22px] max-sm:px-3 ${contentWidthClass}`}>
      <div className="py-1">
        <p className="mb-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
          Tools & Stack
        </p>
        <h2 className={`${sectionTitleClass} max-w-[36rem]`}>
          Core platforms, runtimes, deployment tools, and automation systems used across
          delivery.
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-[0.95rem] max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {stackGroups.map((group) => (
          <article key={group.title} className={`${surfaceClass} p-[1.2rem] max-sm:p-4`}>
            <h3 className="mb-[0.9rem] text-[1.04rem] font-bold text-[var(--text-strong)]">{group.title}</h3>
            <div className="flex flex-wrap gap-[0.45rem]">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="inline-flex min-h-8 items-center justify-center rounded-full bg-linear-to-b from-[var(--chip-gradient-start)] to-[var(--chip-gradient-end)] px-[0.8rem] text-[0.82rem] font-bold text-[var(--chip-text)] shadow-[0_6px_18px_var(--soft-shadow)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default memo(ToolsStackSection)
