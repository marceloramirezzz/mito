import { useId } from 'react'

const SHIELD = 'M6 4h88v58c0 22-20 34-44 34S6 84 6 62z'

const ART = [
  // Sunrise
  <>
    <rect width="100" height="100" fill="#ffc400" />
    <circle cx="50" cy="56" r="24" fill="#ff3d17" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} y={60 + i * 9} width="100" height="4.5" fill="#ffc400" />)}
  </>,
  // Road
  <>
    <rect width="100" height="100" fill="#a9e3f5" />
    <path d="M0 62l26-30 20 22 18-26 36 42v30H0z" fill="#0b5fe0" />
    <path d="M44 100c0-16 12-18 8-36l6 0c6 16-4 22-2 36z" fill="#a9e3f5" />
  </>,
  // Table
  <>
    <rect width="100" height="100" fill="#f0c8f6" />
    <circle cx="50" cy="50" r="19" fill="#6f5a48" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <circle key={i} cx={50 + Math.cos(i * Math.PI / 4) * 32} cy={50 + Math.sin(i * Math.PI / 4) * 32} r="7.5" fill="#6f5a48" />
    ))}
  </>,
  // Weave
  <>
    <rect width="100" height="100" fill="#ff3d17" />
    {[0, 1, 2, 3, 4, 5].flatMap((row) => [0, 1, 2, 3, 4, 5].map((col) => (
      (row + col) % 2 === 0 && <rect key={`${row}-${col}`} x={col * 18} y={row * 18} width="14" height="14" rx="7" fill="#050505" />
    )))}
  </>,
  // Waves
  <>
    <rect width="100" height="100" fill="#0b5fe0" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M-10 ${18 + i * 19}q15-14 30 0t30 0 30 0 30 0`} fill="none" stroke="#a9e3f5" strokeWidth="7" />
    ))}
  </>,
]

export function Crest({ index }: { index: number }) {
  const clip = useId()
  return (
    <svg className="crest" viewBox="0 0 100 100" aria-hidden="true">
      <clipPath id={clip}><path d={SHIELD} /></clipPath>
      <g clipPath={`url(#${clip})`}>{ART[index % ART.length]}</g>
    </svg>
  )
}
