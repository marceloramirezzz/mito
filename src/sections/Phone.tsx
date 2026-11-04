import type { ReactNode } from 'react'
import { useLocale } from '../locale'

export function Phone({ dark, children }: { dark?: boolean; children: ReactNode }) {
  const { t } = useLocale()
  return (
    <div className={`phone${dark ? ' phone--dark' : ''}`}>
      <div className="phone__island" />
      <div className="phone__brand">{t.brand.name}</div>
      {children}
    </div>
  )
}
