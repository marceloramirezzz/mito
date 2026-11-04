import { Link, useLocation } from 'react-router-dom'
import { otherLocalePath, useLocale } from '../locale'
import { Logo } from './Logo'

export function LocaleSwitch() {
  const { locale, t } = useLocale()
  const { pathname } = useLocation()
  return (
    <Link
      className="locale-switch"
      to={otherLocalePath(locale, pathname)}
      aria-label={t.brand.switchLabel}
      lang={locale === 'en' ? 'es' : 'en'}
    >
      {locale === 'en' ? 'ES' : 'EN'}
    </Link>
  )
}

export function Nav() {
  const { t } = useLocale()
  return (
    <header className="nav">
      <span className="nav__logo"><Logo className="nav__mark" />{t.brand.name}</span>
      <p className="nav__tagline">{t.brand.tagline}</p>
      <div className="nav__actions">
        <LocaleSwitch />
        <a className="nav__cta" href="#waitlist">{t.brand.cta}</a>
      </div>
    </header>
  )
}

export function FloatingCta() {
  const { t } = useLocale()
  return (
    <a className="float-cta" href="#waitlist">
      <Logo className="float-cta__mark" />
      <span>{t.brand.cta}</span>
    </a>
  )
}
