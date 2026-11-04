import { useLocale } from '../locale'
import { Chapter } from './Chapter'

export function Problem() {
  const { t } = useLocale()
  return (
    <section className="problem">
      <Chapter label={t.problem.label} number={1} />
      <h2 className="display problem__title">
        {t.problem.title.map((line) => <span key={line}>{line} </span>)}
      </h2>
      <p className="problem__body">{t.problem.body}</p>
    </section>
  )
}
