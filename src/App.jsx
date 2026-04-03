import { useCallback, useState } from 'react'
import FloatingContactBar from './components/layout/FloatingContactBar/FloatingContactBar'
import HeroSection from './components/sections/HeroSection/HeroSection'
import SystemsOverviewSection from './components/sections/SystemsOverviewSection/SystemsOverviewSection'
import ToolsStackSection from './components/sections/ToolsStackSection/ToolsStackSection'
import ContactModal from './components/ui/ContactModal/ContactModal'

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const openContact = useCallback(() => setIsContactOpen(true), [])
  const closeContact = useCallback(() => setIsContactOpen(false), [])

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <section className="relative z-10">
        <HeroSection />
        <SystemsOverviewSection />
        <ToolsStackSection />
        <FloatingContactBar onOpenContact={openContact} />
      </section>
      <ContactModal open={isContactOpen} onClose={closeContact} />
    </main>
  )
}

export default App
