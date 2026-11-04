const CLOCK_MS = 48 * 3_600_000

// What the Clock shows after `elapsedMs` since a Quest was accepted.
export function clockReading(elapsedMs: number) {
  const left = Math.max(Math.ceil((CLOCK_MS - elapsedMs) / 1000), 0)
  const parts = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60]
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}
