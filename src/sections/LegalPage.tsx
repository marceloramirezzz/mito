import { Link } from 'react-router-dom'
import { localePath, useLocale } from '../locale'
import { LocaleSwitch } from './Nav'

export function LegalPage({ page }: { page: 'terms' | 'privacy' }) {
  const { locale, t } = useLocale()
  const legal = t.legal[page]
  return (
    <main className="legal">
      <div className="legal__top">
        <Link to={localePath(locale, '')}>← {t.brand.back}</Link>
        <LocaleSwitch />
      </div>
      <h1 className="display">{legal.title}</h1>
      <p className="legal__updated">{legal.updated}</p>
      {legal.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </main>
  )
}
