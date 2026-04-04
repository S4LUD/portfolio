import { memo } from 'react'

function NestedPanel({
  className,
  toolbarHeight = 'h-9',
  bodyClass = '',
  dotSize = 'h-[0.34rem] w-[0.34rem]',
}) {
  return (
    <div className={`flex flex-col overflow-hidden ${className}`.trim()}>
      <div className={`flex ${toolbarHeight} items-center gap-2 border-b border-[var(--nested-panel-border)] bg-[var(--toolbar-bg)] px-3`}>
        <span className={`${dotSize} rounded-full bg-[var(--nested-toolbar-dot)]`} />
        <span className={`${dotSize} rounded-full bg-[var(--nested-toolbar-dot)]`} />
        <span className={`${dotSize} rounded-full bg-[var(--nested-toolbar-dot)]`} />
      </div>
      <div className={`flex-1 ${bodyClass}`.trim()} />
    </div>
  )
}

export default memo(NestedPanel)
