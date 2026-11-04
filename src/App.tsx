import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { content, type Locale } from './content'
import { LocaleContext } from './locale'
import { ClockChapter } from './sections/ClockChapter'
import { Footer } from './sections/Footer'
import { Guilds } from './sections/Guilds'
import { Hero } from './sections/Hero'
import { LegalPage } from './sections/LegalPage'
import { FloatingCta, Nav } from './sections/Nav'
import { Outcomes } from './sections/Outcomes'
import { Problem } from './sections/Problem'
import { Stats } from './sections/Stats'
import { Totems } from './sections/Totems'
import { Voice } from './sections/Voice'

function Page({ locale, children }: { locale: Locale; children: ReactNode }) {
  useEffect(() => {
    const { meta } = content[locale]
    document.documentElement.lang = locale
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [locale])

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

function Home({ locale }: { locale: Locale }) {
  return (
    <Page locale={locale}>
      <Nav />
      <FloatingCta />
      <main className="home">
        {/* Card faces are painted once per language, so a switch rebuilds the scene. */}
        <Hero key={locale} />
        <Problem />
        <ClockChapter />
        <Outcomes />
        <Voice />
        <Totems />
        <Stats />
        <Guilds />
      </main>
      <Footer />
    </Page>
  )
}

// Changing page starts at the top; changing language keeps your place.
function ScrollReset() {
  const page = useLocation().pathname.replace(/^\/es/, '') || '/'
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])
  return null
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ anchors: true })
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  const pages: [string, Locale][] = [['', 'en'], ['/es', 'es']]
  return (
    <BrowserRouter>
      <ScrollReset />
      <Routes>
        {pages.flatMap(([prefix, locale]) => [
          <Route key={`${locale}-home`} path={prefix || '/'} element={<Home locale={locale} />} />,
          <Route key={`${locale}-terms`} path={`${prefix}/terms`} element={<Page locale={locale}><LegalPage page="terms" /></Page>} />,
          <Route key={`${locale}-privacy`} path={`${prefix}/privacy`} element={<Page locale={locale}><LegalPage page="privacy" /></Page>} />,
        ])}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
