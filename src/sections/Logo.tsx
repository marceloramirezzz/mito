export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="#f0c8f6" />
      <path d="M12 46V24a10 10 0 0 1 20 0v22M32 24a10 10 0 0 1 20 0v22" fill="none" stroke="#050505" strokeWidth="7" />
    </svg>
  )
}
