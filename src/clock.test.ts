import { describe, expect, it } from 'vitest'
import { clockReading } from './clock'

describe('Clock', () => {
  it('starts at 48 hours when a Quest is accepted', () => {
    expect(clockReading(0)).toBe('48:00:00')
  })

  it('counts down in hours, minutes and seconds', () => {
    expect(clockReading(16_000)).toBe('47:59:44')
    expect(clockReading(47 * 3_600_000 + 59 * 60_000 + 59_000)).toBe('00:00:01')
  })

  it('stops at zero once the 48 hours are up', () => {
    expect(clockReading(48 * 3_600_000)).toBe('00:00:00')
    expect(clockReading(50 * 3_600_000)).toBe('00:00:00')
  })
})
