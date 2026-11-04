const CLOCK_MS = 48 * 3_600_000

// The Quest shown accepted in the Clock chapter's phone.
export const CLOCK_QUEST = 4

// What the Clock shows after `elapsedMs` since a Quest was accepted.
export function clockReading(elapsedMs: number) {
  const left = Math.max(Math.ceil((CLOCK_MS - elapsedMs) / 1000), 0)
  const parts = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60]
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}

// Eases from 0 to 1 as `value` moves from `start` to `end`.
export function ramp(start: number, end: number, value: number) {
  const amount = Math.min(Math.max((value - start) / (end - start), 0), 1)
  return amount * amount * (3 - 2 * amount)
}

// Scroll position in viewport heights, counted so the Clock chapter's top edge
// reaches the top of the screen at 2, whatever the height of the sections above it.
export function clockScroll(clock: HTMLElement) {
  return 2 - clock.getBoundingClientRect().top / window.innerHeight
}
