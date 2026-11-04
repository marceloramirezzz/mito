import { createContext, useContext } from 'react'
import { content, type Locale } from './content'

export const LocaleContext = createContext<Locale>('en')

export function useLocale() {
  const locale = useContext(LocaleContext)
  return { locale, t: content[locale] }
}

// The same page in the other language.
export function otherLocalePath(locale: Locale, pathname: string) {
  return locale === 'en' ? `/es${pathname === '/' ? '' : pathname}` : pathname.replace(/^\/es/, '') || '/'
}

export function localePath(locale: Locale, page: 'terms' | 'privacy' | '') {
  return `${locale === 'es' ? '/es' : ''}/${page}` .replace(/(.)\/$/, '$1')
}
