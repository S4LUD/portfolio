import { memo } from 'react'

function NestedPanel({
  className,
  toolbarHeight = 'h-9',
  bodyClass = '',
  dotSize = 'h-[0.34rem] w-[0.34rem]',
}) {
  return (
    <div className={`flex flex-col overflow-hidden ${className}`.trim()}>
      <div className={`flex ${toolbarHeight} items-center gap-2 border-b border-[rgba(228,234,245,0.9)] px-3`}>
        <span className={`${dotSize} rounded-full bg-[#d6deef]`} />
        <span className={`${dotSize} rounded-full bg-[#d6deef]`} />
        <span className={`${dotSize} rounded-full bg-[#d6deef]`} />
      </div>
      <div className={`flex-1 ${bodyClass}`.trim()} />
    </div>
  )
}

export default memo(NestedPanel)
