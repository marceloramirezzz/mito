import { describe, expect, it } from 'vitest'
import { clockReading, ramp } from './clock'

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

describe('ramp', () => {
  it('holds at 0 before the start and at 1 after the end', () => {
    expect(ramp(2, 3, 1)).toBe(0)
    expect(ramp(2, 3, 4)).toBe(1)
  })

  it('is halfway at the midpoint', () => {
    expect(ramp(2, 3, 2.5)).toBe(0.5)
  })
})
