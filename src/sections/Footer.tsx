import { Link } from 'react-router-dom'
import { localePath, useLocale } from '../locale'
import { Chapter } from './Chapter'
import { Logo } from './Logo'
import { LocaleSwitch } from './Nav'
import { WaitlistForm } from './WaitlistForm'

export function Footer() {
  const { locale, t } = useLocale()
  return (
    <footer className="footer" id="waitlist">
      <Chapter label={t.footer.label} number={8} />
      <div className="footer__main">
        <Logo className="footer__mark" />
        <h2>{t.footer.title}</h2>
        <p>{t.footer.body}</p>
        <WaitlistForm copy={t.waitlist} />
        <small>{t.footer.note}</small>
      </div>
      <div className="footer__bottom">
        <span>{t.footer.motto}</span>
        <strong>{t.brand.name}</strong>
        <nav>
          <Link to={localePath(locale, 'privacy')}>{t.footer.privacy}</Link>
          <Link to={localePath(locale, 'terms')}>{t.footer.terms}</Link>
          <LocaleSwitch />
        </nav>
      </div>
    </footer>
  )
}
