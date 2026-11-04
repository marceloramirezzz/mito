import { useEffect, useRef, useState } from 'react'

// Writes how far a section has travelled through the viewport to --progress (0–1).
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => {
      const { top, height } = element.getBoundingClientRect()
      const travel = Math.max(height - window.innerHeight, window.innerHeight * 0.6)
      const progress = Math.min(Math.max(-top / travel, 0), 1)
      element.style.setProperty('--progress', progress.toFixed(4))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return ref
}

// Turns true the first time a section comes near the viewport, and stays true.
export function useSeen<T extends HTMLElement>(rootMargin = '0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setSeen(true)
    }, { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])
  return [ref, seen] as const
}

// True while enough of a section is on screen; it goes false again on leaving.
export function useInView<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView] as const
}
