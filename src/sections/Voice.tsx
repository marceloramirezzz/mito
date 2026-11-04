import { useLocale } from '../locale'
import { Chapter } from './Chapter'
import { Phone } from './Phone'

const BARS = [18, 42, 30, 64, 88, 52, 34, 72, 96, 60, 28, 46, 80, 38, 22]

export function Voice() {
  const { t } = useLocale()
  return (
    <section className="voice">
      <Chapter label={t.voice.label} number={4} />
      <h2 className="display voice__title">
        {t.voice.title.map((line) => <span key={line}>{line} </span>)}
      </h2>
      <div className="voice__stage">
        <p>{t.voice.left}</p>
        <Phone dark>
          <div className="phone__prompt">{t.voice.prompt}</div>
          <div className="wave" aria-hidden="true">
            {BARS.map((height, i) => (
              <span key={i} style={{ height: `${height}%`, animationDelay: `${i * -90}ms` }} />
            ))}
          </div>
          <div className="phone__record"><span />{t.voice.hint}</div>
        </Phone>
        <p>{t.voice.right}</p>
      </div>
    </section>
  )
}
