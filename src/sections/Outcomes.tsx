import { useLocale } from '../locale'
import { useScrollProgress } from '../useScroll'
import { Chapter } from './Chapter'

export function Outcomes() {
  const { t } = useLocale()
  const ref = useScrollProgress<HTMLElement>()
  return (
    <section className="outcomes" ref={ref}>
      <div className="outcomes__sheet">
        <Chapter label={t.outcomes.label} number={3} />
        <h2 className="display outcomes__title">{t.outcomes.title}</h2>
        <p className="outcomes__intro">{t.outcomes.intro}</p>
        <ol className="outcomes__list">
          {t.outcomes.items.map((item, i) => (
            <li key={item.photo}>
              <span className="outcomes__number">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <img src={item.photo} alt={item.alt} loading="lazy" width="960" height="640" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
