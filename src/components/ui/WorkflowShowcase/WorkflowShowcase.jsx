import { memo } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { toneClasses } from '../shared/uiClasses'

function WorkflowShowcase({ workflow, className = '', imageSrc }) {
  return (
    <article
      className={`relative rounded-[22px] border border-[rgba(228,234,245,0.9)] bg-white p-4 shadow-[0_18px_45px_rgba(150,169,204,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] ${className}`.trim()}
    >
      <div className="flex items-center justify-between px-2 pb-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-[0.36rem] w-[0.36rem] rounded-full bg-[#d4ddef]" />
          <span className="h-[0.36rem] w-[0.36rem] rounded-full bg-[#d4ddef]" />
          <span className="h-[0.36rem] w-[0.36rem] rounded-full bg-[#d4ddef]" />
        </div>
        <div className="flex items-center gap-2 text-[#d4ddef]" aria-hidden="true">
          <Minus className="h-3.5 w-3.5 stroke-[2.2]" />
          <Square className="h-3.5 w-3.5 stroke-[1.8]" />
          <X className="h-3.5 w-3.5 stroke-[2.1]" />
        </div>
      </div>
      <div className="mx-[-1rem] border-b border-[rgba(228,234,245,0.9)]" />

      <div
        className={`relative mt-4 overflow-hidden rounded-[18px] ${
          imageSrc ? '' : workflow.tall ? 'min-h-[23rem] max-sm:min-h-64' : 'min-h-[19rem] max-sm:min-h-64'
        }`}
        style={{ backgroundColor: '#ffffff' }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Workflow preview"
            className="mx-auto block max-h-[32rem] h-auto w-full object-contain blur-[0.5px]"
            draggable="false"
          />
        ) : null}

        <div
          className={`pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(222,228,241,0.8)_2px,transparent_2px)] [background-size:18px_18px] ${
            imageSrc ? 'hidden' : ''
          }`}
        />

        {imageSrc ? null : (
          <svg
            className="absolute inset-0 z-[1] h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {workflow.lines.map((line, index) => (
              <line
                key={`${line.x1}-${line.y1}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                pathLength="100"
                className="stroke-[#66748e] stroke-[0.8] stroke-linecap-round opacity-85"
              />
            ))}
          </svg>
        )}

        {imageSrc
          ? null
          : workflow.nodes.map((node) => (
              <div
                key={`${node.label}-${node.x}-${node.y}`}
                className={`absolute z-[2] inline-flex min-h-[3.8rem] min-w-[7.3rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[0.15rem] rounded-[18px] px-4 py-[0.9rem] text-center text-[0.92rem] leading-[1.05] font-extrabold text-white shadow-[0_16px_28px_rgba(105,126,168,0.2)] max-sm:min-h-12 max-sm:min-w-[5.5rem] max-sm:rounded-2xl max-sm:px-2 max-sm:py-[0.65rem] max-sm:text-[0.68rem] ${toneClasses[node.tone]}`}
                style={{ left: node.x, top: node.y }}
              >
                {node.label.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            ))}
      </div>
    </article>
  )
}

export default memo(WorkflowShowcase)
