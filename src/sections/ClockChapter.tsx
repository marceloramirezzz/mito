import { useEffect, useState } from 'react'
import { clockReading } from '../clock'
import { useLocale } from '../locale'
import { Chapter } from './Chapter'
import { Phone } from './Phone'

export function ClockChapter() {
  const { t } = useLocale()
  const [reading, setReading] = useState(() => clockReading(0))

  useEffect(() => {
    const accepted = Date.now()
    const timer = setInterval(() => setReading(clockReading(Date.now() - accepted)), 1000)
    return () => clearInterval(timer)
  }, [])

  const quest = t.quests[4]
  return (
    <section className="clock">
      <Chapter label={t.clock.label} number={2} />
      <h2 className="display clock__title">
        {t.clock.title.map((line) => <span key={line}>{line} </span>)}
      </h2>
      <div className="clock__stage">
        <div className="clock__reading" aria-hidden="true">{reading}</div>
        <Phone>
          <div className="phone__card">
            <span className="phone__dot" />
            <small>{quest.category}</small>
            <strong>{quest.text}</strong>
            <p>{quest.body}</p>
          </div>
          <div className="phone__pill">{t.clock.accept} · {reading}</div>
        </Phone>
      </div>
      <div className="columns">
        <p>{t.clock.left}</p>
        <p>{t.clock.right}</p>
      </div>
    </section>
  )
}
