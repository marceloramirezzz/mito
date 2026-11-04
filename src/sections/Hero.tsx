import { useEffect, useRef } from 'react'
import { CLOCK_QUEST } from '../clock'
import { useLocale } from '../locale'

export function Hero() {
  const { t } = useLocale()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inkRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ink = inkRef.current
    const problem = document.querySelector<HTMLElement>('.problem')
    const clock = document.querySelector<HTMLElement>('.clock')
    const phoneCard = clock?.querySelector<HTMLElement>('.phone__card')
    if (!canvas || !ink || !problem || !clock || !phoneCard) return

    const disposers: (() => void)[] = []
    const dispose = () => {
      disposers.splice(0).forEach((run) => run())
      clock.classList.remove('clock--handoff')
    }
    const hide = () => {
      canvas.style.display = 'none'
      ink.style.display = 'none'
    }
    const abort = new AbortController()
    // Card faces are painted to 2D canvases, so the fonts must be ready first.
    Promise.all([
      import('../three/questSpiral'),
      import('../three/inkFill'),
      document.fonts.load('800 50px "Inter Variable"'),
    ]).then(([{ createQuestSpiral }, { createInkFill }]) => {
      if (abort.signal.aborted) return
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      try {
        disposers.push(createInkFill({ canvas: ink, clock, reducedMotion }))
        disposers.push(createQuestSpiral({ canvas, quests: t.quests, clockQuest: CLOCK_QUEST, problem, clock, phoneCard, reducedMotion }))
        clock.classList.add('clock--handoff')
      } catch {
        // No WebGL: the title and navigation still work without the cards.
        dispose()
        hide()
      }
    }).catch(hide)

    return () => {
      abort.abort()
      dispose()
    }
  }, [t])

  return (
    <section className="hero">
      <h1 className="hero__title">
        {t.hero.title.map((part) => (
          <span key={part}>{part} </span>
        ))}
      </h1>
      <canvas className="hero__ink" ref={inkRef} aria-hidden="true" />
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
    </section>
  )
}
