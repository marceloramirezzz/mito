import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../locale'
import { useSeen } from '../useScroll'
import { Chapter } from './Chapter'

type Stage = ReturnType<typeof import('../three/totemStage')['createTotemStage']>

export function Totems() {
  const { t } = useLocale()
  const [selected, setSelected] = useState(0)
  const [sectionRef, seen] = useSeen<HTMLElement>('500px')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<Stage | null>(null)
  const totem = t.totems.items[selected]
  const totemId = totem.id
  // The picker can change while the 3D code is still loading.
  const latestId = useRef(totemId)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!seen || !canvas) return
    const abort = new AbortController()
    import('../three/totemStage').then(({ createTotemStage }) => {
      if (abort.signal.aborted) return
      try {
        const stage = createTotemStage(canvas, window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        stage.setTotem(latestId.current)
        stageRef.current = stage
      } catch {
        canvas.style.display = 'none'
      }
    }).catch(() => {
      canvas.style.display = 'none'
    })
    return () => {
      abort.abort()
      stageRef.current?.dispose()
      stageRef.current = null
    }
  }, [seen])

  useEffect(() => {
    latestId.current = totemId
    stageRef.current?.setTotem(totemId)
  }, [totemId])

  return (
    <section className="totems" ref={sectionRef}>
      <canvas className="totems__canvas" ref={canvasRef} aria-hidden="true" />
      <Chapter label={t.totems.label} number={5} />
      <p className="totems__line" aria-live="polite">{totem.line}</p>
      <div className="totems__name">
        <span>{totem.name}</span>
        <span>{totem.role}</span>
      </div>
      <h2 className="display totems__title">
        {t.totems.title.map((line) => <span key={line}>{line} </span>)}
      </h2>
      <div className="totems__side">
        <p>{t.totems.body}</p>
        <div className="totems__picker">
          {t.totems.items.map((item, i) => (
            <button key={item.id} type="button" aria-pressed={i === selected} onClick={() => setSelected(i)}>
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
