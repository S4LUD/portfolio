import { memo } from 'react'
import logo from '../../../assets/logo.png'
import sampleFlow from '../../../assets/sample_flow.png'
import { heroStats, heroWorkflow } from '../../../data/portfolioData'
import Header from '../../layout/Header/Header'
import NestedPanel from '../../ui/NestedPanel/NestedPanel'
import WorkflowShowcase from '../../ui/WorkflowShowcase/WorkflowShowcase'
import { contentWidthClass } from '../../ui/shared/uiClasses'

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-0 pb-6 shadow-[0_18px_50px_rgba(182,199,230,0.12)] backdrop-blur-[6px] max-sm:pb-4"
      style={{
        backgroundColor: '#EFF3FD',
        backgroundImage: `linear-gradient(rgba(239, 243, 253, 0.99), rgba(239, 243, 253, 0.99)), url(${logo})`,
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

      <Header />

      <section
        className={`relative grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.45fr)] gap-[1.2rem] rounded-[28px] px-5 max-md:grid-cols-1 max-sm:rounded-[22px] max-sm:px-3 ${contentWidthClass}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-18 bottom-0 z-0 max-md:hidden">
          <NestedPanel className="absolute left-[28%] top-[42%] h-[58%] w-[26%] rounded-[22px] border border-[rgba(228,234,245,0.8)] bg-[rgba(255,255,255,0.64)] [background-image:radial-gradient(rgba(224,230,242,0.54)_2px,transparent_2px)] [background-size:24px_24px] backdrop-blur-[6px]" />
          <NestedPanel
            className="absolute left-[16%] top-[64%] h-[34%] w-[22%] rounded-[20px] border border-[rgba(228,234,245,0.78)] bg-[rgba(255,255,255,0.56)] [background-image:radial-gradient(rgba(224,230,242,0.5)_2px,transparent_2px)] [background-size:24px_24px] backdrop-blur-[5px]"
            toolbarHeight="h-8"
            dotSize="h-[0.3rem] w-[0.3rem]"
          />
          <NestedPanel
            className="absolute left-[18%] bottom-[-18%] h-[26%] w-[16%] rounded-[18px] border border-[rgba(228,234,245,0.74)] bg-[rgba(255,255,255,0.48)] [background-image:radial-gradient(rgba(224,230,242,0.46)_2px,transparent_2px)] [background-size:24px_24px] backdrop-blur-[5px]"
            toolbarHeight="h-8"
            dotSize="h-[0.3rem] w-[0.3rem]"
          />
        </div>

        <div className="relative z-[1] flex flex-col justify-center py-[2.1rem] max-sm:py-4">
          <h1 className="m-0 max-w-[10ch] text-[clamp(2.5rem,5vw,4.3rem)] leading-[0.95] font-bold tracking-[-0.05em] text-[#32425f] max-sm:max-w-none max-sm:text-[2.8rem]">
            Automation Systems Engineer
          </h1>
          <p className="mt-4 mb-5 max-w-[28rem] text-[1.02rem] leading-7 text-[#6f7f9c]">
            Designing scalable workflows across APIs, no-code platforms, and custom logic
            layers.
          </p>

          <ul className="mb-6 grid list-none gap-[0.65rem] p-0">
            {heroStats.map((stat) => (
              <li
                key={stat}
                className="relative pl-4 text-[0.95rem] leading-6 text-[#5f7398] before:absolute before:top-[0.55rem] before:left-0 before:h-[0.4rem] before:w-[0.4rem] before:rounded-full before:bg-linear-to-br before:from-[#79d9b5] before:to-[#5d87ff] before:content-['']"
              >
                {stat}
              </li>
            ))}
          </ul>
        </div>

        <WorkflowShowcase
          workflow={heroWorkflow}
          imageSrc={sampleFlow}
          className="relative z-[1] w-full p-[1.1rem] max-sm:p-4"
        />
      </section>
    </section>
  )
}

export default memo(HeroSection)
