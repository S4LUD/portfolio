import FloatingContactBar from './components/layout/FloatingContactBar/FloatingContactBar'
import HeroSection from './components/sections/HeroSection/HeroSection'
import SystemsOverviewSection from './components/sections/SystemsOverviewSection/SystemsOverviewSection'
import ToolsStackSection from './components/sections/ToolsStackSection/ToolsStackSection'

function App() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <section className="relative z-10">
        <HeroSection />
        <SystemsOverviewSection />
        <ToolsStackSection />
        <FloatingContactBar />
      </section>
    </main>
  )
}

export default App
