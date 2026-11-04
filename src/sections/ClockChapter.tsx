import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CLOCK_QUEST, clockReading, clockScroll, ramp } from '../clock'
import { useLocale } from '../locale'
import { Chapter } from './Chapter'
import { Phone } from './Phone'

// Scroll positions, as given by clockScroll, for each part of the stage.
const STAGE_START = 1.55
const INK_START = 1.9
const INK_END = 2.6
const DIVIDER_START = 2.1
const DIVIDER_END = 2.45
const PHONE_START = 2.2
const PHONE_END = 2.65
const TITLE_START = 2.3
const TITLE_END = 2.72
// How much of the screen the next chapter's sheet has to climb to fade the stage out.
const FADE_DISTANCE = 0.7
// The next chapter overlaps this one by this fraction of the viewport height.
const NEXT_OVERLAP = 0.16

function useStageScroll() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const update = () => {
      const at = clockScroll(section)
      const { bottom } = section.getBoundingClientRect()
      const remaining = bottom / window.innerHeight - NEXT_OVERLAP
      const { style } = section
      style.setProperty('--ink-spread', ramp(INK_START, INK_END, at).toFixed(4))
      style.setProperty('--divider', ramp(DIVIDER_START, DIVIDER_END, at).toFixed(4))
      style.setProperty('--phone', ramp(PHONE_START, PHONE_END, at).toFixed(4))
      style.setProperty('--title', ramp(TITLE_START, TITLE_END, at).toFixed(4))
      style.setProperty('--stage-fade', Math.min(Math.max(remaining / FADE_DISTANCE, 0), 1).toFixed(4))
      style.setProperty('--stage', at > STAGE_START && bottom > 0 ? 'visible' : 'hidden')
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

export function ClockChapter() {
  const { t } = useLocale()
  const ref = useStageScroll()
  const [reading, setReading] = useState(() => clockReading(0))

  useEffect(() => {
    const accepted = Date.now()
    const timer = setInterval(() => setReading(clockReading(Date.now() - accepted)), 1000)
    return () => clearInterval(timer)
  }, [])

  const quest = t.quests[CLOCK_QUEST]
  return (
    <section className="clock" ref={ref}>
      <div className="clock__stage">
        <div className="clock__reading" aria-hidden="true">
          {reading.split(':').map((group, i) => (
            <span className="clock__group" key={i}>
              {i > 0 && <span className="clock__colon">:</span>}
              {[...group].map((digit, j) => <span className="clock__digit" key={j}>{digit}</span>)}
            </span>
          ))}
        </div>
        <Chapter label={t.clock.label} number={2} />
        <h2 className="display clock__title">
          {t.clock.title.map((line, l) => {
            const wordsBefore = t.clock.title.slice(0, l).join(' ').split(' ').filter(Boolean).length
            return (
              <span key={line}>
                {line.split(' ').map((part, i) => (
                  <span className="clock__word" key={part} style={{ '--i': wordsBefore + i } as CSSProperties}>{part} </span>
                ))}
              </span>
            )
          })}
        </h2>
        <Phone>
          <div className="phone__card">
            <span className="phone__dot" />
            <small>{quest.category}</small>
            <strong>{quest.text}</strong>
            <p>{quest.body}</p>
            <div className="phone__avatars" aria-hidden="true"><span /><span /><span /><span /></div>
          </div>
          <div className="phone__pill">{t.clock.accept} · {reading}</div>
        </Phone>
        <div className="clock__divider" />
        <div className="clock__columns">
          <p>{t.clock.left}</p>
          <p>{t.clock.right}</p>
        </div>
      </div>
    </section>
  )
}
