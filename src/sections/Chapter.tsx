import { useLocale } from '../locale'

export function Chapter({ label, number }: { label: string; number: number }) {
  const { t } = useLocale()
  return (
    <div className="chapter">
      <span>{label}</span>
      <span>{t.brand.chapter} {String(number).padStart(2, '0')}</span>
    </div>
  )
}
