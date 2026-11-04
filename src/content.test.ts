import { describe, expect, it } from 'vitest'
import { content } from './content'

function paths(value: unknown, at = ''): string[] {
  if (Array.isArray(value)) return [`${at}[${value.length}]`, ...value.flatMap((item, i) => paths(item, `${at}[${i}]`))]
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => paths(item, `${at}.${key}`))
  return [at]
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

describe('language parity', () => {
  it('has the same text slots in English and Spanish', () => {
    expect(paths(content.es)).toEqual(paths(content.en))
  })

  it('has no empty text in either language', () => {
    for (const locale of [content.en, content.es]) {
      expect(strings(locale).filter((text) => text.trim() === '')).toEqual([])
    }
  })

  it('actually translates the page instead of repeating English', () => {
    expect(content.es.hero.title).not.toEqual(content.en.hero.title)
    expect(content.es.brand.cta).not.toBe(content.en.brand.cta)
  })
})
