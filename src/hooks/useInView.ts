import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  /** Only trigger once — default true */
  once?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0,
  rootMargin = '0px 0px -60px 0px',
  once = true,
}: UseInViewOptions = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Synchronous check — if already visible, set immediately to avoid flash
    const rect = el.getBoundingClientRect()
    const isVisible =
      rect.top < window.innerHeight + parseInt(rootMargin.replace(/\D/g, '') || '0', 10) &&
      rect.bottom > 0

    if (isVisible) {
      setInView(true)
      if (once) return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
