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

    // If already visible and once, skip observer
    if (once && inView) return

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
    // We intentionally don't include inView so the observer is always set up fresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
