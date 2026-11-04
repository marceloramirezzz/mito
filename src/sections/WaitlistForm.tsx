import { useState, type FormEvent } from 'react'

export type WaitlistCopy = { emailLabel: string; submit: string; invalid: string; notOpen: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Visual only for now: there is no list behind this form, and it says so.
export function WaitlistForm({ copy }: { copy: WaitlistCopy }) {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<'invalid' | 'notOpen' | null>(null)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setResult(EMAIL.test(email.trim()) ? 'notOpen' : 'invalid')
  }

  return (
    <form className="waitlist" onSubmit={onSubmit} noValidate>
      <label className="waitlist__label" htmlFor="waitlist-email">{copy.emailLabel}</label>
      <input
        className="waitlist__input"
        id="waitlist-email"
        type="email"
        autoComplete="off"
        placeholder={copy.emailLabel}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button className="waitlist__submit" type="submit">{copy.submit}</button>
      {result === 'invalid' && <p className="waitlist__message" role="alert">{copy.invalid}</p>}
      {result === 'notOpen' && <p className="waitlist__message" role="status">{copy.notOpen}</p>}
    </form>
  )
}
