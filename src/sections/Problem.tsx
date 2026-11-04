import { useLocale } from '../locale'
import { useInView } from '../useScroll'
import { Chapter } from './Chapter'

export function Problem() {
  const { t } = useLocale()
  const [copyRef, inView] = useInView<HTMLDivElement>(0.25)
  return (
    <section className={`problem${inView ? ' problem--in' : ''}`}>
      <Chapter label={t.problem.label} number={1} />
      <div className="problem__copy" ref={copyRef}>
        <h2 className="display problem__title">
          {t.problem.title.map((line) => <span key={line}>{line} </span>)}
        </h2>
        <p className="problem__body">{t.problem.body}</p>
      </div>
    </section>
  )
}
