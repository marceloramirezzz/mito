import { useEffect, useRef } from 'react'
import { useLocale } from '../locale'

export function Hero() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    let dispose: (() => void) | undefined
    const abort = new AbortController()
    // Card faces are painted to 2D canvases, so the fonts must be ready first.
    Promise.all([import('../three/questSpiral'), document.fonts.load('800 50px "Inter Variable"')]).then(([{ createQuestSpiral }]) => {
      if (abort.signal.aborted) return
      try {
        dispose = createQuestSpiral({
          canvas,
          quests: t.quests,
          getProgress: () => {
            const travel = section.offsetHeight - window.innerHeight
            return travel > 0 ? Math.min(Math.max(window.scrollY / travel, 0), 1) : 0
          },
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        })
      } catch {
        // No WebGL: the title and navigation still work without the cards.
        canvas.style.display = 'none'
      }
    }).catch(() => {
      canvas.style.display = 'none'
    })

    return () => {
      abort.abort()
      dispose?.()
    }
  }, [t])

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__stage">
        <h1 className="hero__title">
          {t.hero.title.map((part) => (
            <span key={part}>{part} </span>
          ))}
        </h1>
        <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
      </div>
    </section>
  )
}
