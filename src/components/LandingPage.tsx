import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ClipboardList, CalendarCheck, MessageSquare, Activity, BookOpen, Zap, Check, TrendingUp, BarChart2, Users, Link2, CloudLightning } from 'lucide-react'
import { assets } from '../assets'

/* ─── DESIGN TOKENS (from Figma 1155:233) ────────────────────────────────────
  Chip:       bg-[rgba(255,236,227,0.7)] border-[0.4px] border-[#ffb694]
              rounded-[88px] text-[#fd5000] font-geist-mono text-[11px]
  Card:       bg-white rounded-[16px] shadow-[0_2px_24px_rgba(0,0,0,0.06)]
  Icon box:   bg-[#f8f8f8] border-[0.5px] border-[#9b9b9b] rounded-[7px] 36×36
  Glass stat: bg-white/10 backdrop-blur-[6px] border border-white/40 rounded-[8px]
  Page bg:    #f8f5f0
  Orange:     #fd5000
  Dark text:  #191919
────────────────────────────────────────────────────────────────────────────── */

/* ── shared primitives ── */
function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-[5px] rounded-[88px] text-[11px] font-['Geist_Mono',monospace] font-medium text-[#fd5000] whitespace-nowrap ${className}`}
      style={{ background: 'rgba(255,236,227,0.7)', border: '0.4px solid #ffb694' }}
    >
      {children}
    </span>
  )
}

function SectionEyebrow({ icon, label }: { icon: string; label: string }) {
  return (
    <Chip>
      <span>{icon}</span>{label}
    </Chip>
  )
}

/* ── scroll reveal ── */
function RevealOnScroll({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}


/* ─────────────────────────── NAVBAR ─────────────────────────── */
function Navbar() {
  const navLinks = ['Solutions', 'Industries', 'Resources', 'Company']
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="absolute top-[42px] left-0 right-0 z-50">
      <div className="max-w-[1440px] mx-auto px-10 py-5 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <a href="/" className="flex items-center shrink-0">
          <img src={assets.logo} alt="Zuper" className="h-7 w-auto object-contain object-left" style={{ maxWidth: 110 }} />
        </a>
        <nav className="hidden lg:flex items-center justify-center gap-1">
          {navLinks.map((link) => (
            <button key={link} className="flex items-center gap-1 px-4 py-2 font-inter font-medium text-[#f8f5f1] text-[15px] hover:opacity-80 transition-opacity whitespace-nowrap">
              {link}<ChevronDown size={12} className="opacity-70 mt-0.5" />
            </button>
          ))}
        </nav>
        <span className="lg:hidden" />
        <div className="hidden lg:flex items-center gap-3">
          <button className="border border-[#f8f5f1]/80 text-[#f8f5f1] font-inter font-bold text-[14px] px-6 py-[11px] rounded-[8px] hover:bg-white/10 transition-colors whitespace-nowrap">
            Customer Login
          </button>
          <button className="bg-[#f8f5f1] text-[#b5271c] font-inter font-bold text-[14px] px-6 py-[11px] rounded-[8px] hover:bg-white transition-colors whitespace-nowrap">
            Schedule Demo
          </button>
        </div>
        <button className="lg:hidden text-white p-2 justify-self-end" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white" /><span className="block w-6 h-0.5 bg-white" /><span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1a0500] p-6 flex flex-col gap-4 lg:hidden shadow-xl">
          {navLinks.map((link) => (
            <button key={link} className="text-left text-[#f8f5f1] font-medium text-base flex items-center justify-between">
              {link}<ChevronDown size={16} />
            </button>
          ))}
          <hr className="border-white/20" />
          <button className="border border-[#f8f5f1] text-[#f8f5f1] font-bold text-sm px-6 py-3 rounded-[8px]">Customer Login</button>
          <button className="bg-[#f8f5f1] text-[#b5271c] font-bold text-sm px-6 py-3 rounded-[8px]">Schedule Demo</button>
        </div>
      )}
    </header>
  )
}

/* ─────────────────────────── HERO ─────────────────────────── */
const HERO_STATS = [
  ['24 / 7', 'Always Answering'],
  ['< 2 s',  'Avg Response Time'],
  ['500+',   'Roofing Companies'],
  ['458%',   'Peak Surge Handled'],
]

function Hero() {
  // CSS backgroundPositionY parallax — gap-free, no sizing math needed.
  // As the section scrolls up (scrollY increases), we push the bg viewpoint
  // further down the image at 40% of scroll speed → bg appears to lag behind
  // content (classic parallax), works on all browsers.
  const [bgPosY, setBgPosY] = useState(0)
  useEffect(() => {
    const fn = () => setBgPosY(window.scrollY * 0.4)
    window.addEventListener('scroll', fn, { passive: true })
    fn() // set initial value
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const bars = Array.from({ length: 28 }, (_, i) => {
    const h = 14 + Math.abs(Math.sin(i * 0.72) * 22 + Math.sin(i * 1.4) * 10)
    return Math.round(h)
  })

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>

      {/* ── Parallax background (CSS bg-position, never shows gaps) ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${assets.heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: `50% ${bgPosY}px`,
          willChange: 'background-position',
        }}
      />

      {/* Base dark scrim for uniform contrast floor across entire photo */}
      <div className="absolute inset-0 bg-black/38 pointer-events-none" />
      {/* Left-to-right directional vignette (deepens text area) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/5 pointer-events-none" />
      {/* Top-to-bottom fade (darkens bottom for stats strip legibility) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/55 pointer-events-none" />

      <Navbar />

      {/* ── Main content ── */}
      <div
        className="relative z-10 max-w-[1240px] mx-auto px-10 flex items-center gap-14 justify-between"
        style={{ paddingTop: 160, paddingBottom: 96 }}
      >

        {/* Left copy */}
        <div className="flex flex-col items-start" style={{ maxWidth: 560 }}>

          {/* Live badge */}
          <div
            className="flex items-center gap-[10px] rounded-full px-[14px] py-[6px] mb-8"
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.28)' }}
          >
            <span className="w-[6px] h-[6px] rounded-full bg-[#4ade80] shrink-0" style={{ boxShadow: '0 0 6px #4ade80' }} />
            {/* white on rgba(0,0,0,0.35)+dark photo ≈ #111 effective bg → contrast ~12:1 ✓ */}
            <span className="font-['Geist_Mono',monospace] text-[10.5px] font-medium text-white tracking-[0.13em] uppercase">
              Calls &amp; Texts · 24/7 · Powered by Zuper AI
            </span>
          </div>

          {/* Headline — full white primary, high-contrast muted secondary */}
          {/* Large text (≥ 18pt bold) requires 3:1. Both lines are ~72px bold → well above threshold */}
          <h1 className="font-inter font-black text-white tracking-[-0.035em] leading-[0.97]" style={{ fontSize: 'clamp(52px, 5.8vw, 82px)' }}>
            Every Call<br />Answered.<br />
            {/* #C8C8C8 on effective dark bg (~#111) ≈ 8.5:1 ✓ — clearly readable, visually dimmed */}
            <span style={{ color: '#C8C8C8' }}>Every Lead<br />Captured.</span>
          </h1>

          {/* Subtext — #D4D4D4 on ~#111 ≈ 9.8:1 ✓ */}
          <p className="font-inter leading-[1.7] mt-6" style={{ fontSize: 16, maxWidth: 460, color: '#D4D4D4' }}>
            Your AI-powered CSR handles overflow calls, after-hours inquiries, and storm surge — so your roofing business never loses revenue to voicemail.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mt-9">
            <button
              className="font-inter font-bold text-[15px] text-[#b5271c] px-7 py-[13px] rounded-[10px] transition-all hover:brightness-105 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.30)' }}
            >
              Schedule a Demo
            </button>
            <button
              className="flex items-center gap-2 font-inter font-semibold text-[15px] text-white px-7 py-[13px] rounded-[10px] transition-all hover:bg-white/15"
              style={{ border: '1px solid rgba(255,255,255,0.45)' }}
            >
              <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0L10 6L0 12V0Z"/></svg>
              See How It Works
            </button>
          </div>

          {/* Social proof — #BCBCBC on dark ≈ 7.6:1 ✓ */}
          <div className="flex items-center gap-2.5 mt-7">
            <div className="flex -space-x-2">
              {['#e87c5a','#c9563e','#a83c2a','#8b2c1c'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-[1.5px] border-white/40 flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="font-inter text-[13px]" style={{ color: '#BCBCBC' }}>
              Trusted by <span className="font-semibold text-white">500+</span> roofing companies
            </p>
          </div>
        </div>

        {/* Right card */}
        <div className="hidden lg:flex flex-col gap-3 shrink-0" style={{ width: 340 }}>

          {/* Main glass card — opaque enough to read against hero bg */}
          <div
            className="flex flex-col rounded-[22px] overflow-hidden"
            style={{
              background: 'rgba(12,8,6,0.62)',
              border: '1px solid rgba(255,255,255,0.22)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 6px #4ade80' }} />
                {/* white on #0C0806 → ~20:1 ✓ */}
                <span className="font-inter text-[12px] font-semibold text-white tracking-wide uppercase">Live Demo</span>
              </div>
              {/* #8A8A8A on #0C0806 ≈ 5.1:1 ✓ */}
              <span className="font-['Geist_Mono',monospace] text-[11px]" style={{ color: '#8A8A8A' }}>0:42</span>
            </div>

            {/* Orb */}
            <div className="flex items-center justify-center px-8 py-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(253,80,0,0.30) 0%, transparent 70%)', transform: 'scale(1.3)' }} />
                <img
                  src={assets.agentOverlay}
                  alt="AI voice agent"
                  style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', position: 'relative', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.50))' }}
                />
              </div>
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-[3px] px-6 py-2">
              {bars.map((h, i) => (
                <div key={i} style={{ width: 3, height: h, borderRadius: 9, background: i < 18 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.18)' }} />
              ))}
            </div>

            {/* Transcript snippet — #B0B0B0 on #0C0806 ≈ 6.8:1 ✓ */}
            <div className="px-4 py-3 mx-4 mb-4 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <p className="font-['Geist_Mono',monospace] text-[11px] leading-[1.6]" style={{ color: '#B0B0B0' }}>
                <span style={{ color: '#fd7040' }}>Agent</span>{"  "}Hi, this is ZuperAI — how can I help with your roofing inquiry today?
              </p>
            </div>

            {/* Play button — solid enough to stand out */}
            <div className="px-4 pb-4">
              <button
                className="w-full flex items-center justify-center gap-2.5 font-inter font-semibold text-[14px] rounded-[12px] py-3 transition-all hover:brightness-110 active:scale-[0.98] text-white"
                style={{ background: 'rgba(253,80,0,0.75)', border: '1px solid rgba(253,80,0,0.90)', boxShadow: '0 4px 18px rgba(253,80,0,0.28)' }}
              >
                <span className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.22)' }}>
                  <svg width="8" height="10" viewBox="0 0 10 12" fill="white"><path d="M0 0L10 6L0 12V0Z"/></svg>
                </span>
                Play Call
              </button>
            </div>
          </div>

          {/* Two small floating stat pills — dark bg for legibility */}
          <div className="grid grid-cols-2 gap-3">
            {[['21', 'Jobs auto-logged'], ['100%', 'Response rate']].map(([v, l]) => (
              <div key={l} className="rounded-[14px] px-4 py-3 flex flex-col gap-0.5"
                style={{ background: 'rgba(12,8,6,0.58)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}>
                <span className="font-inter font-black text-white text-[20px] leading-none tracking-[-0.03em]">{v}</span>
                {/* #ADADAD on #0C0806 ≈ 6.4:1 ✓ */}
                <span className="font-inter text-[11px]" style={{ color: '#ADADAD' }}>{l}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ── Bottom stats strip ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.12)' }}
      >
        <div className="max-w-[1240px] mx-auto px-10 grid grid-cols-4 divide-x divide-white/15">
          {HERO_STATS.map(([v, l]) => (
            <div key={l} className="py-5 flex flex-col items-center gap-[4px]">
              {/* white on rgba(0,0,0,0.55)+dark photo ≈ #0A0A0A effective → ~20:1 ✓ */}
              <span className="font-inter font-black text-white text-[20px] leading-none tracking-[-0.03em]">{v}</span>
              {/* #A8A8A8 on #0A0A0A ≈ 6.2:1 ✓ */}
              <span className="font-inter text-[11px] tracking-[0.03em]" style={{ color: '#A8A8A8' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

/* ─────────────────────────── CHANNEL BAND ─────────────────────────── */
const CHANNELS = [
  {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.4 2.18 2 2 0 012.39 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>,
    name: 'Inbound Calls', tag: 'Overflow & After Hours',
  },
  {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    name: 'SMS & Text', tag: 'Bidirectional Messaging',
  },
  {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    name: 'Emergency Line', tag: 'Storm & Hail Surge',
  },
]

function ChannelBand() {
  return (
    <div className="bg-white border-y border-[#ede8e2]">
      <div className="max-w-[1240px] mx-auto px-12 py-5 flex items-center justify-center gap-3 flex-wrap">
        <span className="font-['Geist_Mono',monospace] text-[10px] tracking-[0.14em] uppercase font-semibold text-[#ABABAB] mr-2 whitespace-nowrap">
          Works Across
        </span>
        {CHANNELS.map((ch) => (
          <div
            key={ch.name}
            className="flex items-center gap-2.5 bg-white rounded-[12px] border border-[#e5dfd7] px-4 py-2.5 hover:border-[rgba(253,80,0,0.2)] transition-all cursor-default"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.02)' }}
          >
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[#fd5000] shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(253,80,0,0.13), rgba(253,80,0,0.06))', border: '1px solid rgba(253,80,0,0.15)' }}
            >
              {ch.icon}
            </div>
            <span className="font-inter font-semibold text-[#1A1A1A] text-[13.5px] whitespace-nowrap">{ch.name}</span>
            <span className="font-inter text-[12px] text-[#9A9A9A] whitespace-nowrap hidden sm:block">· {ch.tag}</span>
            <div className="relative shrink-0">
              <span className="w-[7px] h-[7px] rounded-full bg-[#22C55E] block" />
              <span className="animate-ping absolute inset-0 rounded-full bg-[#22C55E] opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────── CAPABILITIES ─────────────────────────── */
const CAPS = [
  { tag: 'Lead Intake',      Icon: ClipboardList, title: 'Intake & Qualification',     desc: 'Captures name, address, damage type, insurance carrier, and urgency — routed straight into your Zuper pipeline.' },
  { tag: 'Scheduling',       Icon: CalendarCheck,  title: 'Appointment Booking',        desc: 'Checks real-time crew availability, offers slots, and confirms inspections with no dispatcher required.' },
  { tag: 'Sales Support',    Icon: MessageSquare,  title: 'Estimation & Quote Queries', desc: 'Answers pricing and scope questions instantly. Flags complex deals for your sales team to own and close.' },
  { tag: 'Customer Service', Icon: Activity,       title: 'Job Status Updates',         desc: 'Pulls live job data from Zuper and communicates progress, schedule changes, and next steps to homeowners.' },
  { tag: 'FAQ Handling',     Icon: BookOpen,       title: 'Business & Services FAQ',    desc: 'Handles services, coverage areas, warranties, insurance claims, and financing — consistently, every time.' },
  { tag: 'Storm Response',   Icon: Zap,            title: 'Emergency Triage',           desc: 'Identifies storm, hail, and water urgency. Escalates critical cases to on-call crews while capturing full intake.' },
]

function Capabilities() {
  const cardsRef = useRef<HTMLDivElement>(null)
  const [colorOpacity, setColorOpacity] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = cardsRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height
      // progress: 0 when top of cards hits viewport center, 1 when bottom does
      const scrolled = window.innerHeight / 2 - rect.top
      const progress = Math.min(1, Math.max(0, scrolled / total))
      // start fading in color at 30% scroll, fully in by 65%
      const opacity = Math.min(1, Math.max(0, (progress - 0.3) / 0.35))
      setColorOpacity(opacity)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="capabilities" className="py-28 bg-[#f8f5f0]">
      <div className="max-w-[1240px] mx-auto px-12">

        {/* ── Body: sticky left + scrolling right ── */}
        <div className="flex gap-10 items-start">

          {/* Left: sticky — title + image + stat pills all pin together */}
          <div className="hidden lg:flex flex-col shrink-0" style={{ width: 440, position: 'sticky', top: 48, alignSelf: 'flex-start' }}>

            {/* Section header lives here so it stays fixed with the image */}
            <div className="mb-8">
              <SectionEyebrow icon="⚡" label="Capabilities" />
              <h2 className="font-inter font-black text-[#191919] text-[clamp(28px,3vw,42px)] leading-[1.06] tracking-[-0.035em] mt-4">
                Everything a top CSR does.<br />
                <span className="text-[#fd5000]">Without the overhead.</span>
              </h2>
              <p className="font-inter text-[14px] text-[#7A7A7A] leading-[1.75] mt-3">
                Trained on roofing workflows. Ready to qualify, book, and convert — across calls and text.
              </p>
            </div>
            {/* image frame */}
            <div className="rounded-[24px] overflow-hidden" style={{ position: 'relative', boxShadow: '0 8px 48px rgba(0,0,0,0.13)' }}>
              <img
                src={assets.csrAgentDesk}
                alt="CSR Agent"
                className="w-full block"
                style={{ aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <img
                src={assets.csrAgentColor}
                alt=""
                aria-hidden
                style={{
                  aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center top',
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  opacity: colorOpacity,
                  transition: 'opacity 0.2s ease-out',
                }}
              />
              {/* bottom caption — strong scrim so text is always legible */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pt-10 pb-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.40) 55%, transparent 100%)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#4ade80] shrink-0" style={{ boxShadow: '0 0 5px #4ade80' }} />
                  <span className="font-['Geist_Mono',monospace] text-[10px] font-medium text-white/70 tracking-[0.12em] uppercase">Live · Available 24/7</span>
                </div>
                <p className="font-inter font-bold text-white text-[16px] leading-tight tracking-[-0.01em]">Zuper CSR Agent</p>
                <p className="font-inter text-[12px] mt-0.5" style={{ color: '#C8C8C8' }}>Handles calls, texts &amp; storm surge — automatically.</p>
              </div>
            </div>

            {/* metrics row below image */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                { val: '98%',  label: 'Resolution rate', icon: '✓' },
                { val: '< 2s', label: 'Response time',   icon: '⚡' },
                { val: '24/7', label: 'Always on',        icon: '●' },
              ].map(({ val, label, icon }) => (
                <div key={label} className="bg-white rounded-[16px] border border-[#e5dfd7] flex flex-col items-center justify-center py-4 px-3 text-center"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <span className="text-[11px] mb-1.5" style={{ color: '#fd5000' }}>{icon}</span>
                  <span className="font-inter font-black text-[#191919] text-[22px] leading-none tracking-[-0.03em]">{val}</span>
                  <span className="font-inter text-[11px] text-[#9A9A9A] mt-1.5 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 2×3 card grid */}
          <div ref={cardsRef} className="flex-1 grid grid-cols-2 gap-4">
            {CAPS.map((c, i) => (
              <RevealOnScroll key={c.title} delay={i * 60}>
              <div
                className="group bg-white rounded-[20px] p-6 border border-[#ede8e2] flex flex-col gap-4 cursor-default h-full"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease' }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.boxShadow = '0 8px 32px rgba(253,80,0,0.10)'
                  el.style.transform = 'translateY(-2px)'
                  el.style.borderColor = 'rgba(253,80,0,0.22)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
                  el.style.transform = 'translateY(0)'
                  el.style.borderColor = '#ede8e2'
                }}
              >
                {/* top row: icon + number */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-[12px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(253,80,0,0.15) 0%, rgba(253,80,0,0.07) 100%)', border: '1px solid rgba(253,80,0,0.14)' }}
                  >
                    <c.Icon size={19} strokeWidth={1.7} color="#fd5000" />
                  </div>
                  <span className="font-['Geist_Mono',monospace] text-[11px] text-[#C8C0B8] font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* title + desc */}
                <div>
                  <h3 className="font-inter font-bold text-[#191919] text-[15px] leading-snug mb-2 tracking-[-0.01em]">
                    {c.title}
                  </h3>
                  <p className="font-inter text-[13px] text-[#7A7A7A] leading-[1.7]">{c.desc}</p>
                </div>

                {/* tag pill at bottom */}
                <div className="mt-auto pt-1">
                  <span className="inline-flex items-center font-['Geist_Mono',monospace] text-[10.5px] font-medium text-[#fd5000] px-3 py-[5px] rounded-full"
                    style={{ background: 'rgba(253,80,0,0.07)', border: '0.5px solid rgba(253,80,0,0.18)' }}>
                    {c.tag}
                  </span>
                </div>
              </div>
              </RevealOnScroll>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── WORKFLOWS ─────────────────────────── */
interface Step { title: string; desc: string }
interface Message { role: 'ai' | 'cu'; who: string; text: string; tag?: string; highlight?: boolean }
interface WorkflowPanel {
  badge: string; badgeColor: 'green' | 'orange' | 'red'
  tabName: string; tabNote: string
  h3: string; desc: string; steps: Step[]
  callAvatar: string; callName: string; callInfo: string; callDur: string
  messages: Message[]
}

const WORKFLOWS: WorkflowPanel[] = [
  {
    badge: 'Business Hours', badgeColor: 'green',
    tabName: 'Regular Hour Lead Intake', tabNote: 'Overflow when team is busy',
    h3: 'Overflow Coverage During Business Hours',
    desc: "When your team is tied up, the CSR Agent picks up instantly — no hold music, no voicemail. It qualifies the lead, captures full intake, and books the inspection before the homeowner considers calling a competitor.",
    steps: [
      { title: 'Instant Pickup',      desc: 'Greets the caller as your company within 2 seconds. No hold time.' },
      { title: 'Identify Intent',     desc: "Determines if it's a new lead, existing job query, or general question." },
      { title: 'Qualify the Lead',    desc: 'Captures address, damage type, insurance carrier, and urgency.' },
      { title: 'Book the Inspection', desc: 'Offers available slots and confirms the appointment directly in Zuper.' },
      { title: 'Push to Pipeline',    desc: 'Creates a qualified lead record in your Zuper Lead Intake pipeline automatically.' },
    ],
    callAvatar: '🏠', callName: 'Marcus T. — (614) 555-0182', callInfo: 'Today · 2:34 PM · Business Hours Overflow', callDur: '2:18',
    messages: [
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Thank you for calling Summit Roofing! This is Aria. Our team is with other customers right now, but I can get you sorted. How can I help today?" },
      { role: 'cu', who: 'Marcus', text: "Hi, some shingles went missing after that windstorm last week. I need someone to come take a look." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Wind damage can be serious — let's get an inspection scheduled. Can I get the property address?", tag: 'Qualifying' },
      { role: 'cu', who: 'Marcus', text: "4821 Oakwood Drive, Columbus, Ohio 43214." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Got it. Are you planning to file an insurance claim or looking for a cash estimate?", tag: 'Insurance Check' },
      { role: 'cu', who: 'Marcus', text: "Probably insurance — I have State Farm." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "We work with State Farm regularly. I have Thursday at 9 AM or Friday at 2 PM — which works better?", tag: 'Booking' },
      { role: 'cu', who: 'Marcus', text: "Thursday morning is perfect." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "You're all set, Marcus — Thursday at 9 AM. Confirmation text coming shortly. Our inspector will reach out the morning of. Anything else I can help with?", tag: 'Confirmed ✓', highlight: true },
    ],
  },
  {
    badge: 'After Hours', badgeColor: 'orange',
    tabName: 'After-Hour Intake & Booking', tabNote: 'Late nights, weekends, holidays',
    h3: 'After-Hours Lead Intake & Booking',
    desc: "When your office closes, the CSR Agent keeps the front door open. Every late-night and weekend inquiry is captured, fully qualified, and booked for the next available slot — zero leads lost to voicemail.",
    steps: [
      { title: 'After-Hours Greeting',  desc: "Acknowledges it's outside office hours and assures the customer they're in good hands." },
      { title: 'Full Intake',           desc: 'Captures property, damage description, urgency level, and contact info.' },
      { title: 'Emergency Assessment',  desc: 'Determines if the issue needs same-night response or standard next-day scheduling.' },
      { title: 'Next-Day Booking',      desc: 'Schedules first available morning slot and sends SMS confirmation immediately.' },
      { title: 'Lead Created in Zuper', desc: 'Full record in After-Hour pipeline ready for team review at start of business.' },
    ],
    callAvatar: '🌙', callName: 'Diane R. — (720) 555-0394', callInfo: 'Last Night · 9:47 PM · After Hours', callDur: '3:05',
    messages: [
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Thanks for calling Summit Roofing. Our office is closed, but I can absolutely help you right now. What's going on?" },
      { role: 'cu', who: 'Diane', text: "I have a leak coming through my ceiling. It's been raining all day, the stain keeps spreading — worried it gets worse overnight." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "That's stressful, especially at night. Is water actively dripping, or is it a stain that appeared today?", tag: 'Triage' },
      { role: 'cu', who: 'Diane', text: "More of a stain, wet to the touch, not dripping yet." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Since it's not actively dripping, I can get our first crew to you first thing tomorrow morning. Place a towel nearby just in case. What's your address?", tag: 'Scheduling' },
      { role: 'cu', who: 'Diane', text: "1120 Birchwood Lane, Denver, Colorado 80203." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "You're booked for tomorrow at 8 AM, Diane — our earliest slot. Confirmation text on its way. The team will assess damage and walk you through next steps. You're in good hands.", tag: 'Confirmed ✓', highlight: true },
    ],
  },
  {
    badge: 'Emergency', badgeColor: 'red',
    tabName: 'Storm & Hail Response', tabNote: 'High-volume weather surge',
    h3: 'Storm & Hail Emergency Response',
    desc: "When severe weather hits, call volume spikes 10x. The CSR Agent handles the surge — qualifying every caller, triaging damage, and routing critical cases to on-call crews without missing a single lead.",
    steps: [
      { title: 'Storm Mode Activation', desc: 'Switches to emergency protocol when storm event keywords are detected.' },
      { title: 'Damage Triage',         desc: 'Assesses severity: structural compromise, active leaks, or cosmetic hail damage.' },
      { title: 'Priority Routing',      desc: 'Critical cases escalated to on-call crew. Non-urgent cases queued for next day.' },
      { title: 'Insurance Guidance',    desc: 'Advises on photo documentation, tarping, and insurance claim filing steps.' },
      { title: 'Mass Lead Capture',     desc: "Every caller gets a structured record in Zuper's Emergency pipeline — no call wasted." },
    ],
    callAvatar: '⛈️', callName: 'Robert K. — (214) 555-0847', callInfo: 'Wednesday · 6:22 PM · Storm Surge', callDur: '1:52',
    messages: [
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Summit Roofing — storm response line. We know a lot of you were hit hard today. I'm here to help. What's going on at your property?" },
      { role: 'cu', who: 'Robert', text: "Massive hailstorm two hours ago. Dents all over the roof and a section near the chimney looks cracked. Worried water gets in overnight." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "That cracked section is an active risk — flagging this for our emergency crew right now. Can I get your address and name?", tag: '🚨 Escalating' },
      { role: 'cu', who: 'Robert', text: "Robert Kessler. 7782 Pecan Street, Dallas, Texas 75214." },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Your address is flagged as priority. Do not go on the roof yourself. Do you have homeowner's insurance?", tag: 'Safety + Insurance' },
      { role: 'cu', who: 'Robert', text: "Yes, Allstate. How soon can someone get here?" },
      { role: 'ai', who: 'Aria · Summit Roofing', text: "Our on-call team will contact you within the hour. Sending a confirmation text with your job reference number now. Document any interior water damage with photos — your adjuster will need them. You called the right people, Robert.", tag: 'Dispatched ✓', highlight: true },
    ],
  },
]

const BADGE_STYLES: Record<string, string> = {
  green:  'bg-[rgba(34,197,94,0.12)] text-[#16A34A]',
  orange: 'bg-[rgba(253,80,0,0.12)] text-[#fd5000]',
  red:    'bg-[rgba(239,68,68,0.12)] text-[#DC2626]',
}

const MSG_INTERVAL_MS = 1400

function parseDurMs(dur: string) {
  const [m, s] = dur.split(':').map(Number)
  return (m * 60 + s) * 1000
}

function formatMs(ms: number) {
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

function Workflows() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const panel = WORKFLOWS[active]

  const totalDurMs = parseDurMs(panel.callDur)
  const totalMsgs = panel.messages.length
  const totalSteps = panel.steps.length
  const visibleMsgs = Math.min(totalMsgs, Math.floor(elapsedMs / MSG_INTERVAL_MS) + (elapsedMs > 0 ? 1 : 0))
  const ratio = Math.min(1, elapsedMs / totalDurMs)
  const checkedCount = Math.floor(visibleMsgs * totalSteps / totalMsgs)

  // Reset on tab change
  useEffect(() => {
    setPlaying(false)
    setElapsedMs(0)
    if (tickRef.current) clearInterval(tickRef.current)
  }, [active])

  // Tick engine
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current)
    if (!playing) return
    tickRef.current = setInterval(() => {
      setElapsedMs(e => {
        const next = e + 100
        if (next >= totalDurMs) {
          clearInterval(tickRef.current!)
          setPlaying(false)
          return totalDurMs
        }
        return next
      })
    }, 100)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [playing, totalDurMs])

  // Auto-scroll transcript when new message appears
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [visibleMsgs])

  const bars = Array.from({ length: 52 }, (_, i) => ({
    h: 18 + Math.abs(Math.sin(i * 0.45) * 28 + Math.sin(i * 1.2) * 18),
    filled: i / 52 < ratio,
  }))

  return (
    <section id="workflows" className="py-24 bg-[#f8f5f0]">
      <div className="max-w-[1160px] mx-auto px-12">

        {/* Header */}
        <RevealOnScroll className="mb-10">
          <SectionEyebrow icon="🔁" label="Workflows" />
          <h2 className="font-inter font-black text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.035em] mt-4 mb-3">
            Three scenarios.<br /><span className="text-[#fd5000]">One agent.</span>
          </h2>
          <p className="font-inter text-[15px] text-[#7A7A7A] max-w-[480px] leading-[1.7]">
            See exactly how the CSR Agent handles your most critical call types — with real sample transcripts.
          </p>
        </RevealOnScroll>

        {/* Outer card */}
        <div className="bg-white rounded-[20px] border border-[#e5dfd7] overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.10)]">

          {/* Tabs */}
          <div className="flex border-b border-[#e5dfd7]">
            {WORKFLOWS.map((wf, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); setPlaying(false) }}
                className={`relative flex-1 px-6 py-4 text-left flex flex-col gap-1 border-r border-[#e5dfd7] last:border-r-0 transition-colors ${active === i ? 'bg-[rgba(253,80,0,0.05)]' : 'hover:bg-[#fdfaf7]'}`}
              >
                <span className={`text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full w-fit font-['Geist_Mono',monospace] ${BADGE_STYLES[wf.badgeColor]}`}>{wf.badge}</span>
                <span className="font-inter text-[13px] font-bold text-[#191919] leading-snug mt-0.5">{wf.tabName}</span>
                <span className="font-inter text-[11px] text-[#ABABAB]">{wf.tabNote}</span>
                {active === i && <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, #fd5000, #ff7a40)' }} />}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="grid grid-cols-[1fr_400px]" style={{ height: 560 }}>

            {/* Left — steps, overflow hidden (truncates naturally) */}
            <div className="flex flex-col overflow-hidden border-r border-[#e5dfd7]">
              <div className="px-7 pt-7 pb-5 border-b border-[#f0ebe3] shrink-0">
                <h3 className="font-inter font-bold text-[#191919] text-[20px] leading-[1.2] tracking-[-0.02em] mb-2">{panel.h3}</h3>
                <p className="font-inter text-[13.5px] text-[#7A7A7A] leading-[1.7]">{panel.desc}</p>
              </div>
              <ul className="divide-y divide-[#f0ebe3]">
                {panel.steps.map((s, i) => {
                  const done = i < checkedCount
                  return (
                    <li key={i} className="flex items-start gap-4 px-7 py-4 transition-opacity" style={{ opacity: done ? 1 : elapsedMs === 0 ? 1 : 0.45 }}>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all"
                        style={done
                          ? { background: '#22C55E', border: '1px solid #16A34A' }
                          : { background: 'rgba(253,80,0,0.08)', color: '#fd5000', border: '1px solid rgba(253,80,0,0.15)' }}
                      >
                        {done
                          ? <Check size={12} strokeWidth={2.5} color="white" />
                          : <span className="font-['Geist_Mono',monospace] text-[10px] font-bold tracking-tight">{i + 1}</span>
                        }
                      </div>
                      <div>
                        <strong className={`font-inter block text-[13px] font-semibold mb-0.5 transition-colors ${done ? 'text-[#22C55E]' : 'text-[#191919]'}`}>{s.title}</strong>
                        <span className="font-inter text-[12.5px] text-[#8A8A8A] leading-[1.55]">{s.desc}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Right — call card, scrollable */}
            <div className="flex flex-col overflow-hidden" style={{ background: '#faf7f4' }}>

              {/* Call header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0ebe3] bg-white shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{ background: 'rgba(253,80,0,0.08)', border: '1px solid rgba(253,80,0,0.15)' }}>
                  {panel.callAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-inter text-[13px] font-semibold text-[#191919] truncate leading-tight">{panel.callName}</div>
                  <div className="font-inter text-[11px] text-[#ABABAB] mt-0.5">{panel.callInfo}</div>
                </div>
                <Chip>{panel.callDur}</Chip>
              </div>

              {/* Waveform + play */}
              <div className="px-4 py-3 border-b border-[#f0ebe3] bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPlaying(p => !p)}
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    style={{ background: '#fd5000', boxShadow: '0 3px 10px rgba(253,80,0,0.28)' }}
                  >
                    {playing
                      ? <svg width="8" height="10" viewBox="0 0 10 12" fill="white"><rect x="0" y="0" width="3.5" height="12" rx="1"/><rect x="6.5" y="0" width="3.5" height="12" rx="1"/></svg>
                      : <svg width="8" height="10" viewBox="0 0 10 12" fill="white" style={{ marginLeft: 1 }}><path d="M0 0L10 6L0 12Z"/></svg>
                    }
                  </button>
                  <div className="flex-1 flex items-center gap-[2px] h-9 overflow-hidden">
                    {bars.map((b, i) => (
                      <div key={i} className="flex-1 rounded-full"
                        style={{ height: `${b.h}%`, background: b.filled ? (playing ? '#fd5000' : 'rgba(253,80,0,0.5)') : 'rgba(0,0,0,0.09)' }} />
                    ))}
                  </div>
                  <span className="font-['Geist_Mono',monospace] text-[10px] text-[#BFBFBF] shrink-0 tabular-nums">
                    {formatMs(elapsedMs)} / {panel.callDur}
                  </span>
                </div>
              </div>

              {/* Scrollable transcript — always full, active message highlighted */}
              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-5 space-y-3" style={{ minHeight: 0 }}>
                {panel.messages.map((m, i) => {
                  const isActive = elapsedMs > 0 && i === visibleMsgs - 1
                  const isPast   = elapsedMs > 0 && i < visibleMsgs - 1
                  return (
                  <div key={i} className="flex gap-3 transition-opacity duration-500"
                    style={{ opacity: elapsedMs === 0 ? 1 : isPast ? 0.38 : isActive ? 1 : 0.18 }}>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 font-inter"
                      style={m.role === 'ai'
                        ? { background: 'rgba(253,80,0,0.10)', color: '#fd5000', border: '1px solid rgba(253,80,0,0.15)' }
                        : { background: '#f0ede8', color: '#888', border: '1px solid #e5e0d8' }}
                    >
                      {m.role === 'ai' ? 'AI' : 'CU'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-inter text-[10px] font-semibold uppercase tracking-[0.08em] mb-1 ${m.role === 'ai' ? 'text-[#fd5000]' : 'text-[#ABABAB]'}`}>
                        {m.who}
                      </div>
                      <div className={`font-inter text-[13px] leading-[1.65] ${m.highlight ? 'text-[#191919] font-medium' : 'text-[#5A5A5A]'}`}>
                        {m.text}
                      </div>
                      {m.tag && (
                        <span className="inline-flex mt-1.5 font-['Geist_Mono',monospace] text-[10px] font-medium px-[9px] py-[4px] rounded-full"
                          style={{ background: 'rgba(253,80,0,0.08)', color: '#fd5000', border: '1px solid rgba(253,80,0,0.25)' }}>
                          {m.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  )
                })}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────── REVENUE MULTIPLIER ─────────────────────────── */
const RM_ITEMS = [
  { Icon: TrendingUp,     title: 'Higher Close Rates',       desc: 'Answer instantly while homeowner intent is at its peak. Never lose a warm lead to a competitor who picked up faster.' },
  { Icon: Zap,            title: 'Shorter Response Windows', desc: "Speed-to-contact is the #1 driver of close rate in home services. You'll always be the fastest response — regardless of time of day." },
  { Icon: CloudLightning, title: 'Storm Surge Readiness',    desc: 'When hail hits your market, volume spikes 10x overnight. Scale instantly with no overtime, hiring chaos, or capacity limits.' },
  { Icon: BarChart2,      title: 'Pipeline Stays Pristine',  desc: 'Every call creates a structured lead record in Zuper. Your team wakes up to a qualified pipeline — not a pile of voicemails to parse.' },
  { Icon: Users,          title: 'Revenue Per CSR',          desc: 'Your team handles complex conversations and customer relationships. Routine intake and booking handled automatically.' },
  { Icon: Link2,          title: 'Zero Tool Sprawl',         desc: 'Intake, qualification, booking, and pipeline updates all live in one connected Zuper workflow. No third-party glue required.' },
]

function RevenueMultiplier() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1120px] mx-auto px-12">
        <RevealOnScroll className="text-center mb-14">
          <SectionEyebrow icon="📊" label="Impact" />
          <h2 className="font-inter font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
            From Feature to <span className="text-[#fd5000]">Revenue Multiplier</span>
          </h2>
          <p className="font-inter text-[17px] font-light text-[#5A5A5A] max-w-[520px] mx-auto leading-[1.7]">
            The CSR Agent isn't just a feature — it's a measurable lift across your most critical business metrics.
          </p>
        </RevealOnScroll>

        {/* Divider-grid — borders on direct grid children so lines stay aligned */}
        <div className="border border-[#E8E3DC] rounded-[6px] overflow-hidden">
          <div className="grid grid-cols-3">
            {RM_ITEMS.map((item, i) => {
              const isLastRow = i >= 3
              const isLastCol = (i % 3) === 2
              return (
                <div
                  key={item.title}
                  style={{
                    borderRight:  isLastCol ? 'none' : '1px solid #E8E3DC',
                    borderBottom: isLastRow ? 'none' : '1px solid #E8E3DC',
                  }}
                >
                  <RevealOnScroll delay={(i % 3) * 70} className="h-full">
                    <div className="px-8 py-10 h-full flex flex-col hover:bg-[#faf7f4] transition-colors">
                      {/* highlighted icon box */}
                      <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-5 shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(253,80,0,0.13) 0%, rgba(253,80,0,0.05) 100%)',
                          border: '1px solid rgba(253,80,0,0.18)',
                        }}
                      >
                        <item.Icon size={19} strokeWidth={1.7} color="#fd5000" />
                      </div>
                      <h3 className="font-inter font-bold text-[#191919] text-[15px] mb-2 tracking-[-0.01em]">
                        {item.title}
                      </h3>
                      <p className="font-inter text-[13.5px] text-[#5A5A5A] leading-[1.7]">{item.desc}</p>
                    </div>
                  </RevealOnScroll>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────── CASE STUDY ─────────────────────────── */
const CS_STATS = [
  { num: '$25K',  label: 'Deal Value Captured During Storm' },
  { num: '95',    label: 'Calls Handled at Peak Demand' },
  { num: '100%',  label: 'Response Rate' },
  { num: '458%',  label: 'Call Surge Absorbed' },
  { num: '21',    label: 'New Jobs Auto-Logged' },
  { num: '30',    label: 'Callbacks Captured' },
]

function CaseStudy() {
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <section id="case-study" className="py-24 bg-[#f8f5f0]">
      <div className="max-w-[1200px] mx-auto px-12">

        <RevealOnScroll className="mb-12">
          <SectionEyebrow icon="📖" label="Customer Story" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-4">
            <h2 className="font-inter font-black text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.035em]">
              Proven in a <span className="text-[#fd5000]">real storm surge.</span>
            </h2>
            <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.7] max-w-[320px] lg:text-right shrink-0">
              A&A Roofing. December 2025. 458% call surge. Zero missed leads.
            </p>
          </div>
        </RevealOnScroll>

        <div className="rounded-[24px] overflow-hidden" style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.13)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">

            {/* Left — dark panel */}
            <div className="flex flex-col" style={{ background: '#111' }}>
              <div className="relative flex-1 overflow-hidden" style={{ minHeight: 320 }}>
                {videoLoaded ? (
                  <iframe
                    src="https://play.vidyard.com/BmTRvK1oGatZCLfchTVp6e?autoplay=1"
                    className="absolute inset-0 w-full h-full border-none"
                    allow="autoplay; fullscreen" allowFullScreen
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
                    style={{ background: 'linear-gradient(145deg,#3a0a02 0%,#8B1A0A 40%,#C83A14 75%,#fd5000 100%)' }}
                    onClick={() => setVideoLoaded(true)}
                  >
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
                    <div className="w-16 h-16 rounded-full bg-white/15 border border-white/30 flex items-center justify-center mb-5 group-hover:bg-white/25 group-hover:scale-105 transition-all" style={{ backdropFilter: 'blur(8px)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <p className="font-inter font-semibold text-white text-[14px] tracking-[0.02em]">Watch the A&A Roofing Story</p>
                    <p className="font-inter text-[12px] mt-1" style={{ color: '#ABABAB' }}>3 min · Storm Surge Response</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 border-t border-white/10">
                {CS_STATS.slice(0, 3).map((s, i) => (
                  <div key={s.label} className={`px-5 py-6 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                    <div className="font-inter font-black text-white text-[28px] leading-none tracking-[-0.04em]">{s.num}</div>
                    <div className="font-inter text-[11px] mt-1.5 leading-snug" style={{ color: '#9A9A9A' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — light panel */}
            <div className="flex flex-col bg-white">
              <div className="flex-1 px-10 pt-10 pb-8 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-[#fd5000]" />
                  <span className="font-['Geist_Mono',monospace] text-[10.5px] font-medium text-[#ABABAB] uppercase tracking-[0.12em]">
                    A&amp;A Roofing · Storm Surge · Dec 2025
                  </span>
                </div>
                <blockquote className="flex-1" style={{ borderLeft: '3px solid #fd5000', paddingLeft: 20 }}>
                  <span className="font-inter font-black text-[#fd5000] text-[52px] leading-[0.6] block mb-3 select-none" style={{ fontFamily: 'Georgia, serif' }}>"</span>
                  <p className="font-inter font-bold text-[#191919] text-[20px] leading-[1.4] tracking-[-0.02em]">
                    When the storm hit, we didn't miss a single call. Nova handled the surge and we captured every opportunity — without adding a single person to the team.
                  </p>
                </blockquote>
                <p className="font-inter text-[13.5px] text-[#7A7A7A] leading-[1.75] mt-6">
                  A major storm struck A&amp;A Roofing's service area in December 2025 — a <strong className="text-[#191919] font-semibold">458% surge in inbound calls</strong> with every crew already deployed. Instead of missing opportunities, they relied on Zuper AI Agent Nova to handle every call.
                </p>
                <div className="mt-7 pt-6 border-t border-[#ede8e2]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-inter font-bold text-[#191919] text-[14px]">A&amp;A Roofing</div>
                      <div className="font-inter text-[12px] text-[#ABABAB] mt-0.5">Powered by Zuper AI Agent Nova</div>
                    </div>
                    <a
                      href="https://www.zuper.co/staying-fully-operational-during-a-storm-surge-with-zuper-ai-agent-nova"
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 font-inter font-semibold text-[13px] text-[#fd5000] hover:gap-3 transition-all"
                    >
                      Read full story
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-[#ede8e2]" style={{ background: '#fafaf8' }}>
                {CS_STATS.slice(3).map((s, i) => (
                  <div key={s.label} className={`px-5 py-6 ${i < 2 ? 'border-r border-[#ede8e2]' : ''}`}>
                    <div className="font-inter font-black text-[#fd5000] text-[28px] leading-none tracking-[-0.04em]">{s.num}</div>
                    <div className="font-inter text-[#ABABAB] text-[11px] mt-1.5 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────── CTA SECTION ─────────────────────────── */
function CTASection() {
  return (
    <div id="cta" className="relative overflow-hidden text-center py-[108px] px-6" style={{ background: 'linear-gradient(135deg, #8B1A0A 0%, #C83A14 40%, #fd5000 70%, #F5832B 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,0,0,0.2), transparent)' }} />
      {/* Diagonal line pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E\")", backgroundSize: '40px 40px' }}
      />
      <RevealOnScroll>
        <div className="relative">
          <h2 className="font-inter font-black text-white text-[clamp(34px,4.5vw,58px)] leading-[1.1] tracking-[-0.04em] max-w-[680px] mx-auto mb-4">
            Ready to never miss<br />another lead?
          </h2>
          <p className="text-[18px] font-light max-w-[480px] mx-auto mb-11 leading-[1.65]" style={{ color: '#E8E8E8' }}>
            See the Zuper CSR Agent handle a live workflow customized with your company name, services, and real availability.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://www.zuper.co/demo" className="bg-white text-[#fd5000] px-8 py-4 rounded-[8px] text-[15px] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.22)] transition-all">
              Schedule a Demo
            </a>
            <a href="#workflows" className="border-2 border-white/65 text-white px-8 py-4 rounded-[8px] text-[15px] font-semibold hover:border-white hover:bg-white/10 transition-all">
              Watch Sample Calls
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  )
}

/* ─────────────────────────── FOOTER ─────────────────────────── */
function Footer() {
  const footerLinks = ['Solutions', 'Industries', 'Resources', 'Company', 'Privacy', 'Terms']
  return (
    <footer className="bg-white border-t border-[#e8e0d5]">
      <div className="max-w-[1200px] mx-auto px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-[8px] bg-[#fd5000] flex items-center justify-center shadow-[0_2px_8px_rgba(253,80,0,0.30)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M14 2L4 14h7l-1 8 10-12h-7l1-8z"/></svg>
          </div>
          <div>
            <div className="font-inter font-bold text-[#191919] text-[14px] leading-tight">Zuper CSR Agent</div>
            <div className="font-['Geist_Mono',monospace] text-[10px] text-[#ABABAB] tracking-[0.08em] uppercase">AI Operating System for the Trades</div>
          </div>
        </div>
        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-5">
          {footerLinks.map(l => (
            <a key={l} href="#" className="font-inter text-[13px] text-[#7A7A7A] hover:text-[#191919] transition-colors">{l}</a>
          ))}
        </nav>
        {/* Copyright */}
        <div className="font-['Geist_Mono',monospace] text-[11px] text-[#ABABAB]">© 2025 Zuper Inc.</div>
      </div>
    </footer>
  )
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen font-inter">
      <Hero />
      <ChannelBand />
      <Capabilities />
      <Workflows />
      <RevenueMultiplier />
      <CaseStudy />
      <CTASection />
      <Footer />
    </div>
  )
}
