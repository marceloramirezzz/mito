import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WaitlistForm } from './WaitlistForm'

const copy = {
  emailLabel: 'Your email',
  submit: 'Join',
  invalid: 'That email does not look right.',
  notOpen: 'The list is not open yet. Nothing was sent or saved.',
}

afterEach(cleanup)

describe('waitlist form', () => {
  it('rejects an email that is not valid', async () => {
    render(<WaitlistForm copy={copy} />)
    await userEvent.type(screen.getByLabelText('Your email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: 'Join' }))
    expect(screen.getByRole('alert').textContent).toBe(copy.invalid)
  })

  it('tells the visitor plainly that nothing was saved', async () => {
    render(<WaitlistForm copy={copy} />)
    await userEvent.type(screen.getByLabelText('Your email'), 'ana@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Join' }))
    expect(screen.getByRole('status').textContent).toBe(copy.notOpen)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('never sends the email anywhere', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const beacon = vi.fn()
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true })
    render(<WaitlistForm copy={copy} />)
    await userEvent.type(screen.getByLabelText('Your email'), 'ana@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Join' }))
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(beacon).not.toHaveBeenCalled()
  })
})
