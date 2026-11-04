import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../locale'
import { useInView } from '../useScroll'
import { Chapter } from './Chapter'
import { CREST_COUNT, CrestArt } from './Crest'

const CREST_MS = 1400
// A row opens as its top climbs from here, as a fraction of the viewport height.
const ROW_START = 0.9
const ROW_TRAVEL = 0.45
// A photo leans toward a cursor that is near its row, up to this many pixels.
const LEAN_MAX = 60
const LEAN_STRENGTH = 0.16
const LEAN_REACH = 140
const LEAN_EASE = 0.12

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

function useSheetMotion() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const section = sectionRef.current
    const list = listRef.current
    if (!section || !list) return
    const canLean = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches
    const rows = Array.from(list.children) as HTMLElement[]
    const leans = rows.map(() => 0)
    const pointer = { x: -1, y: -1 }
    const onMove = (event: MouseEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }
    if (canLean) window.addEventListener('mousemove', onMove)

    const frames = { current: 0 }
    const update = () => {
      frames.current = requestAnimationFrame(update)
      // The section itself never turns, so measuring it can't feed back into the sheet.
      const { top, bottom } = section.getBoundingClientRect()
      const height = window.innerHeight
      if (top > height || bottom < 0) return
      const entered = clamp01((height - top) / height)
      const left = clamp01((height - bottom) / height)
      section.style.setProperty('--sheet-turn', (1 - entered - left).toFixed(4))
      section.style.setProperty('--sheet-shrink', Math.min(1 - entered + left, 1).toFixed(4))

      rows.forEach((row, i) => {
        row.style.setProperty('--row', clamp01((height * ROW_START - row.getBoundingClientRect().top) / (height * ROW_TRAVEL)).toFixed(4))
        const photo = row.children[1] as HTMLElement
        if (!canLean) return
        let target = 0
        if (pointer.x >= 0) {
          const box = photo.getBoundingClientRect()
          const pull = (pointer.x - (box.left + box.width / 2)) * LEAN_STRENGTH
          const nearness = 1 / (1 + ((pointer.y - (box.top + box.height / 2)) / LEAN_REACH) ** 2)
          target = Math.min(Math.max(pull, -LEAN_MAX), LEAN_MAX) * nearness
        }
        leans[i] += (target - leans[i]) * LEAN_EASE
        photo.style.transform = `translateX(${leans[i].toFixed(1)}px)`
      })
    }
    frames.current = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(frames.current)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])
  return { sectionRef, listRef }
}

export function Outcomes() {
  const { t } = useLocale()
  const { sectionRef, listRef } = useSheetMotion()
  const [titleRef, titleInView] = useInView<HTMLHeadingElement>(0.55)
  const [crest, setCrest] = useState(0)

  useEffect(() => {
    if (!titleInView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setCrest((current) => (current + 1) % CREST_COUNT), CREST_MS)
    return () => clearInterval(timer)
  }, [titleInView])

  const [firstLine, ...otherLines] = t.outcomes.title
  const firstWords = firstLine.split(' ')
  const lastWord = firstWords.pop()
  return (
    <section className="outcomes" ref={sectionRef}>
      <div className="outcomes__sheet">
        <Chapter label={t.outcomes.label} number={3} />
        <h2 className={`display outcomes__title${titleInView ? ' outcomes__title--in' : ''}`} ref={titleRef}>
          <span>
            {firstWords.join(' ')}{' '}
            <span className="outcomes__crested">
              <span className="outcomes__crest" aria-hidden="true">
                {Array.from({ length: CREST_COUNT }, (_, i) => (
                  <span className={i === crest ? 'outcomes__crest-art--on' : undefined} key={i}><CrestArt index={i} /></span>
                ))}
              </span>
              {'\u00a0'}{lastWord}
            </span>{' '}
          </span>
          {otherLines.map((line) => <span key={line}>{line} </span>)}
        </h2>
        <p className="outcomes__intro">{t.outcomes.intro}</p>
        <ol className="outcomes__list" ref={listRef}>
          {t.outcomes.items.map((item, i) => (
            <li key={item.photo}>
              <div className="outcomes__lead">
                <h3>{item.title}</h3>
                <span className="outcomes__number">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <img src={item.photo} alt={item.alt} loading="lazy" width="960" height="640" />
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
