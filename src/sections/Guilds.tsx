import { useLocale } from '../locale'
import { useScrollProgress } from '../useScroll'
import { Chapter } from './Chapter'
import { Crest } from './Crest'

export function Guilds() {
  const { t } = useLocale()
  const ref = useScrollProgress<HTMLElement>()
  const count = t.guilds.items.length
  return (
    <section className="guilds" ref={ref}>
      <div className="guilds__stage">
        <Chapter label={t.guilds.label} number={7} />
        <ul className="guilds__arc">
          {t.guilds.items.map((name, i) => (
            <li key={name} style={{ '--slot': i - (count - 1) / 2 } as React.CSSProperties}>
              <div className="guilds__badge">
                <Crest index={i} />
                <span>{name}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="guilds__copy">
          <h2 className="display guilds__title">
            {t.guilds.title.map((line) => <span key={line}>{line} </span>)}
          </h2>
          <p>{t.guilds.body}</p>
        </div>
      </div>
    </section>
  )
}
