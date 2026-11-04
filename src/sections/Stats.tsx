import { useEffect, useState } from 'react'
import { useLocale } from '../locale'
import { useSeen } from '../useScroll'
import { Chapter } from './Chapter'

const PILES = [
  { colors: ['#ff3d17', '#ffc400'], circles: [[34, 112, 28], [92, 118, 22], [150, 110, 30], [60, 62, 26], [120, 66, 24], [92, 22, 18]] },
  { colors: ['#a9e3f5', '#6f5a48'], circles: [[30, 118, 22], [84, 110, 30], [146, 116, 24], [58, 68, 20], [118, 60, 22]] },
  { colors: ['#f0c8f6', '#6f5a48'], circles: [[38, 110, 30], [100, 118, 22], [160, 112, 28], [72, 58, 24], [132, 64, 22], [100, 20, 16]] },
  { colors: ['#0b5fe0', '#a9e3f5'], circles: [[32, 114, 26], [90, 110, 30], [152, 116, 24], [60, 62, 22], [124, 58, 26]] },
]

function CountUp({ value, run }: { value: number; run: boolean }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!run) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const started = performance.now()
    const frame = { id: 0 }
    const tick = (now: number) => {
      const progress = reduced ? 1 : Math.min((now - started) / 1200, 1)
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame.id = requestAnimationFrame(tick)
    }
    frame.id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.id)
  }, [run, value])
  return <>{shown}</>
}

export function Stats() {
  const { t } = useLocale()
  const [ref, seen] = useSeen<HTMLElement>('-20% 0px')
  return (
    <section className={`stats${seen ? ' is-seen' : ''}`} ref={ref}>
      <Chapter label={t.stats.label} number={6} />
      <h2 className="display stats__title">
        {t.stats.title.map((line) => <span key={line}>{line} </span>)}
      </h2>
      <p className="stats__body">{t.stats.body}</p>
      <div className="stats__grid">
        {t.stats.items.map((stat, column) => (
          <div className="stats__column" key={stat.name}>
            <span>{stat.name}</span>
            <strong><CountUp value={stat.value} run={seen} /></strong>
            <svg viewBox="0 0 190 140" aria-hidden="true">
              {PILES[column].circles.map(([cx, cy, r], i) => (
                <g key={i} className="stats__drop" style={{ transitionDelay: `${(PILES[column].circles.length - i) * 90 + column * 80}ms` }}>
                  <circle cx={cx} cy={cy} r={r} fill={PILES[column].colors[0]} />
                  {i % 2 === 0 && <path d={`M${cx - r} ${cy}a${r} ${r} 0 0 1 ${r * 2} 0z`} fill={PILES[column].colors[1]} />}
                </g>
              ))}
            </svg>
          </div>
        ))}
      </div>
    </section>
  )
}
