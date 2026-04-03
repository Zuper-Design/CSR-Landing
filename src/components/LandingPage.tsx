import { useState, useRef, useEffect } from 'react'
import { FileText, Calendar, MessageCircle, Radio, HelpCircle, BoltIcon, Check as LucideCheck, ArrowUpRight, BarChart3, UsersRound, CloudRain, Workflow } from 'lucide-react'

// Aliases for backward compat
const ClipboardList = FileText
const CalendarCheck = Calendar
const MessageSquare = MessageCircle
const Activity = Radio
const BookOpen = HelpCircle
const Zap = BoltIcon
const Check = LucideCheck
const TrendingUp = ArrowUpRight
const BarChart2 = BarChart3
const Users = UsersRound
const Link2 = Workflow
const CloudLightning = CloudRain
import { assets } from '../assets'
import ProfileCard from './ProfileCard'
import DotGrid from './DotGrid'


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

function SectionTextBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      <div className="absolute -inset-x-6 -inset-y-3 rounded-[16px]" style={{
        background: 'rgba(248,245,240,0.8)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        maskComposite: 'intersect' as any,
        WebkitMaskComposite: 'source-in' as any,
      }} />
      <div className="relative">{children}</div>
    </div>
  )
}

const EYEBROW_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Capabilities:     { bg: '#eef4ff', text: '#2563eb', dot: '#2563eb' },
  'Get Started':    { bg: '#fff3ed', text: '#c2410c', dot: '#fd5000' },
  Workflows:        { bg: '#f0e8ff', text: '#7c3aed', dot: '#7c3aed' },
  Impact:           { bg: '#e8f5ec', text: '#15803d', dot: '#22c55e' },
  'Customer Story': { bg: '#fef3e0', text: '#92400e', dot: '#d97706' },
  Agents:           { bg: '#fee8ed', text: '#be123c', dot: '#e11d48' },
  Voices:           { bg: '#f0f8fe', text: '#0369a1', dot: '#0ea5e9' },
}

function SectionEyebrow({ label }: { icon?: string; label: string }) {
  const colors = EYEBROW_COLORS[label] || { bg: '#fff3ed', text: '#c2410c', dot: '#fd5000' }
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full text-[12px] font-['Roboto',sans-serif] font-semibold tracking-[0.06em] uppercase"
      style={{ background: colors.bg, color: colors.text }}
    >
      <span className="relative flex items-center justify-center">
        <span className="w-[6px] h-[6px] rounded-full" style={{ background: colors.dot }} />
        <span className="absolute w-[6px] h-[6px] rounded-full animate-ping opacity-40" style={{ background: colors.dot }} />
      </span>
      {label}
    </span>
  )
}

function GridLines() {
  return null
}

const DOT_GRID_PROPS = {
  dotSize: 3,
  gap: 20,
  baseColor: 'rgba(255, 107, 53, 0.12)',
  activeColor: '#FF6B35',
  proximity: 180,
  shockRadius: 200,
  shockStrength: 3,
  resistance: 800,
  returnDuration: 1.8,
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
      transform: vis ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.98)',
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}


/* ─────────────────────────── NAVBAR ─────────────────────────── */
function Navbar() {
  const navLinks = [
    { label: 'Home', href: 'https://www.zuper.co/', external: true },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Get Started', href: '#get-started' },
    { label: 'Workflows', href: '#workflows' },
    { label: 'Impact', href: '#impact' },
    { label: 'Customer Story', href: '#case-study' },
  ]
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (link: typeof navLinks[number]) => {
    setMenuOpen(false)
    if ('external' in link && link.external) { window.open(link.href, '_blank'); return }
    const el = document.querySelector(link.href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <a href="https://www.zuper.co/" target="_blank" rel="noreferrer" className="flex items-center shrink-0">
          <img src="/zuper-logo.svg" alt="Zuper" className="h-7 w-auto object-contain object-left" style={{ maxWidth: 110 }} />
        </a>
        <nav className="hidden lg:flex items-center justify-center gap-1">
          {navLinks.map((link) => (
            <button key={link.label} onClick={() => scrollTo(link)} className="px-5 py-2 font-inter font-medium text-white/85 text-[14px] rounded-[8px] whitespace-nowrap transition-all duration-300 hover:text-white hover:bg-white/[0.06]">
              {link.label}
            </button>
          ))}
        </nav>
        <span className="lg:hidden" />
        <div className="hidden lg:flex items-center gap-3">
          <a href="https://www.zuper.co/demo" target="_blank" rel="noreferrer" className="bg-white text-[#b5271c] font-inter font-semibold text-[14px] px-6 py-[11px] rounded-[10px] whitespace-nowrap transition-all duration-300 hover:-translate-y-[1px]"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.10)'}>
            Schedule Demo
          </a>
        </div>
        <button aria-label="Toggle navigation menu" className="lg:hidden text-white p-2 justify-self-end" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white" /><span className="block w-6 h-0.5 bg-white" /><span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1a0500] p-6 flex flex-col gap-3 lg:hidden shadow-xl">
          {navLinks.map((link) => (
            <button key={link.label} onClick={() => scrollTo(link)} className="text-left text-[#f8f5f1] font-medium text-base py-2">
              {link.label}
            </button>
          ))}
          <hr className="border-white/20" />
          <a href="https://www.zuper.co/demo" target="_blank" rel="noreferrer" className="bg-[#f8f5f1] text-[#b5271c] font-bold text-sm px-6 py-3 rounded-[8px] text-center block">Schedule Demo</a>
        </div>
      )}
    </header>
  )
}

/* ─────────────────────────── HERO ─────────────────────────── */
const HERO_STATS = [
  ['350+',   'Calls Per Month'],
  ['$60K',   'Saved Annually'],
  ['100x',   'Peak Surge Capacity'],
  ['90%',    'AI Calls → Booked Jobs'],
]

// Words for the reading highlight effect
const HERO_WORDS: { word: string; lineBreak?: boolean; stroke?: boolean }[] = [
  { word: 'Stop' },
  { word: 'drowning' },
  { word: 'in' },
  { word: 'calls.', lineBreak: true },
  { word: 'Start', stroke: true },
  { word: 'automating', stroke: true },
  { word: 'it.', stroke: true },
]

function useReadingHighlight(totalWords: number, trigger: number, wordDuration = 320, startDelay = 500) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [phase, setPhase] = useState<'reading' | 'tubelight' | 'idle'>('idle')

  useEffect(() => {
    if (trigger === 0) return
    let timeout: ReturnType<typeof setTimeout>
    let cancelled = false

    const startReading = () => {
      if (cancelled) return
      let current = -1
      setPhase('reading')
      setActiveIndex(-1)

      const step = () => {
        if (cancelled) return
        current++
        if (current >= totalWords) {
          setActiveIndex(current)
          setPhase('tubelight')
          timeout = setTimeout(() => {
            if (cancelled) return
            setPhase('idle')
            timeout = setTimeout(startReading, 7000)
          }, 1200)
          return
        }
        setActiveIndex(current)
        timeout = setTimeout(step, wordDuration)
      }

      timeout = setTimeout(step, startDelay)
    }

    startReading()
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [trigger, totalWords, wordDuration, startDelay])

  return { activeIndex, phase }
}

const DEMO_TRANSCRIPT = [
  { speaker: 'Agent', text: "Hi there, Mary. You've reached Maven Roofing Services. This is Mavis. I'm here to help you get the support you need. Are you calling about a new roof inspection, an existing project, or something else today?", time: 1000 },
  { speaker: 'Caller', text: "No, I just wanna know where you're at so I can maybe visit your office.", time: 14000 },
  { speaker: 'Agent', text: "Sure. Happy to help with that. We're in North Carolina with offices in Jacksonville and Hampstead. You're welcome to visit us at either location. Is there anything else you'd like help with today?", time: 17000 },
  { speaker: 'Caller', text: "I'm looking for a job. Is there someone I can talk to?", time: 28000 },
  { speaker: 'Agent', text: "We're always looking for great people to join our team. You can visit our careers page to see open positions and apply directly. Or if you'd like, I can take your name and number for our recruitment specialist to follow up. What would you prefer?", time: 32000 },
  { speaker: 'Caller', text: "Please take my number and take a message.", time: 49000 },
  { speaker: 'Agent', text: "I already have your number on file. I'll pass it along to our recruitment specialist, and they'll reach out to you soon. Is there anything else I can assist you with today?", time: 52000 },
  { speaker: 'Caller', text: "No. You've been great. Thank you.", time: 65000 },
  { speaker: 'Agent', text: "You're very welcome. Thanks for calling Maven Roofing. Have a wonderful day.", time: 68000 },
]

function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const [trigger, setTrigger] = useState(0)
  const [cardsFanned, setCardsFanned] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const elapsedMsRef = useRef(0)
  const [activeMsg, setActiveMsg] = useState(-1)
  const [activeWordIdx, setActiveWordIdx] = useState(-1)
  const demoAudioRef = useRef<HTMLAudioElement | null>(null)
  const demoTickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { activeIndex: activeWord, phase } = useReadingHighlight(HERO_WORDS.length, trigger)

  // Create demo audio element
  useEffect(() => {
    demoAudioRef.current = new Audio('/demo.mp3')
    demoAudioRef.current.preload = 'auto'
    return () => { demoAudioRef.current?.pause(); demoAudioRef.current = null }
  }, [])

  // Sync playback with audio
  useEffect(() => {
    if (!playing) {
      demoAudioRef.current?.pause()
      if (demoTickRef.current) clearInterval(demoTickRef.current)
      return
    }
    const audio = demoAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
    setElapsed(0)
    elapsedMsRef.current = 0
    setActiveMsg(0)
    setActiveWordIdx(-1)

    demoTickRef.current = setInterval(() => {
      const ms = Math.floor(audio.currentTime * 1000)
      elapsedMsRef.current = ms
      setElapsed(Math.floor(audio.currentTime))

      // Find which message is active based on audio time
      let currentMsg = 0
      for (let i = DEMO_TRANSCRIPT.length - 1; i >= 0; i--) {
        if (ms >= (DEMO_TRANSCRIPT[i].time || 0)) { currentMsg = i; break }
      }
      setActiveMsg(currentMsg)

      // Estimate word progress within current message
      const msgTime = DEMO_TRANSCRIPT[currentMsg].time || 0
      const nextMsgTime = currentMsg < DEMO_TRANSCRIPT.length - 1
        ? (DEMO_TRANSCRIPT[currentMsg + 1].time || 78000)
        : 78000
      const msgElapsed = ms - msgTime
      const msgDuration = nextMsgTime - msgTime
      const words = DEMO_TRANSCRIPT[currentMsg].text.split(' ')
      const wordProgress = Math.min(words.length - 1, Math.floor((msgElapsed / msgDuration) * words.length * 1.3))
      setActiveWordIdx(wordProgress)

      // Stop at end
      if (audio.ended) {
        setPlaying(false)
        setActiveMsg(-1)
        setActiveWordIdx(-1)
        setElapsed(0)
        elapsedMsRef.current = 0
      }
    }, 100)

    return () => { if (demoTickRef.current) clearInterval(demoTickRef.current) }
  }, [playing])

  // Restart animation every time the hero section enters the viewport
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrigger(n => n + 1)
          // Reset cards to stacked, then fan out after a short delay
          setCardsFanned(false)
          requestAnimationFrame(() => {
            setTimeout(() => setCardsFanned(true), 300)
          })
        } else {
          setCardsFanned(false)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const bars = Array.from({ length: 28 }, (_, i) => {
    const h = 14 + Math.abs(Math.sin(i * 0.72) * 22 + Math.sin(i * 1.4) * 10)
    return Math.round(h)
  })

  return (
    <section ref={heroRef} className="relative overflow-hidden">

      {/* ── Orange gradient background from Figma ── */}
      {/* Gradient background SVG */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/hero-gradient.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Subtle warm tint */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: '#d95a3a', opacity: 0.15 }} />

      {/* Subtle scrim for bottom legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15 pointer-events-none" />

      <Navbar />

      {/* ── Main content ── */}
      <div
        className="relative z-10 max-w-[1240px] mx-auto px-4 md:px-10 flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-14 justify-between pt-[72px] md:pt-[175px] pb-[240px] md:pb-[180px]"
      >

        {/* Left copy */}
        <div className="flex flex-col items-start w-full lg:max-w-[560px]">

          {/* Live badge */}
          <div
            className="flex items-center gap-[8px] rounded-full px-[12px] py-[5px] mb-5 md:mb-8"
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.28)' }}
          >
            <span className="w-[6px] h-[6px] rounded-full bg-[#4ade80] shrink-0" style={{ boxShadow: '0 0 6px #4ade80' }} />
            {/* white on rgba(0,0,0,0.35)+dark photo ≈ #111 effective bg → contrast ~12:1 ✓ */}
            <span className="font-['Roboto',sans-serif] text-[9px] md:text-[10.5px] font-medium text-white tracking-[0.13em] uppercase">
              <span className="hidden md:inline">Never miss another call</span>
              <span className="md:hidden">Never miss another call</span>
            </span>
          </div>

          {/* Headline — reading highlight: all text visible at low opacity, word by word lights up */}
          <h1 className="font-jakarta font-[900] tracking-[-0.04em] leading-[1.1]" style={{ fontSize: 'clamp(40px, 5.5vw, 80px)' }}>
            {HERO_WORDS.map((w, i) => {
              const highlighted = i <= activeWord
              const isStroke = w.stroke
              const isTubelight = isStroke && phase === 'tubelight'
              const isIdle = phase === 'idle'
              return (
                <span key={i}>
                  <span
                    className={isTubelight ? 'hero-tubelight' : ''}
                    style={{
                      color: 'white',
                      opacity: isStroke
                        ? (isIdle ? 1 : (highlighted ? 1 : 0.25))
                        : (isIdle ? 0.60 : (highlighted ? 0.60 : 0.15)),
                      textShadow: isStroke
                        ? (isTubelight
                          ? '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.2)'
                          : '0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.1)')
                        : undefined,
                      transition: isTubelight ? 'none' : 'opacity 0.3s ease',
                    }}
                  >
                    {w.word}
                  </span>
                  {w.lineBreak ? <br /> : ' '}
                </span>
              )
            })}
          </h1>
          <style>{`
            @keyframes tubelightFlicker {
              0%   { opacity: 0.3; }
              4%   { opacity: 1; }
              8%   { opacity: 0.4; }
              12%  { opacity: 1; }
              16%  { opacity: 0.2; }
              22%  { opacity: 0.8; }
              28%  { opacity: 0.3; }
              36%  { opacity: 1; }
              42%  { opacity: 0.5; }
              50%  { opacity: 1; }
              100% { opacity: 1; }
            }
            .hero-tubelight {
              animation: tubelightFlicker 1.2s ease-out forwards;
            }
          `}</style>

          <p className="font-inter leading-[1.7] mt-4 md:mt-6 text-[14px] md:text-[16px]" style={{
            maxWidth: 580, color: '#D4D4D4',
            animation: 'smoothFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both',
          }}>
            CSR Agent is your AI receptionist for overflow,<br />after hours, and the jobs voicemail costs you.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mt-5 md:mt-9" style={{ animation: 'smoothFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s both' }}>
            <a
              href="https://www.zuper.co/demo" target="_blank" rel="noreferrer"
              className="font-inter font-semibold text-[15px] text-[#b5271c] px-8 py-[14px] rounded-[12px] transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.18)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
            >
              Schedule a Demo
            </a>
            <a
              href="https://www.youtube.com/watch?v=njtFIVu4iAo" target="_blank" rel="noreferrer"
              className="hidden md:flex items-center gap-2 font-inter font-semibold text-[15px] text-white px-8 py-[14px] rounded-[12px] transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0L10 6L0 12V0Z"/></svg>
              See How It Works
            </a>
          </div>

          {/* Social proof — #BCBCBC on dark ≈ 7.6:1 ✓ */}
          <div className="flex items-center gap-2.5 mt-4 md:mt-7 mb-[52px]" style={{ animation: 'smoothFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.8s both' }}>
            <div className="flex -space-x-1.5">
              {['/logo-maven.png', '/logo-aa.png'].map((src) => (
                <img key={src} src={src} alt="Client logo" className="w-7 h-7 rounded-full object-cover bg-white border-2 border-white/40" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
              ))}
            </div>
            <p className="font-inter text-[11px] md:text-[13px]" style={{ color: '#BCBCBC' }}>
              <span className="hidden md:inline">Trusted by <span className="font-semibold text-white">Maven</span>, <span className="font-semibold text-white">A&A Roofing Services</span> & others</span>
              <span className="md:hidden">Trusted by <span className="font-semibold text-white">Maven</span>, <span className="font-semibold text-white">A&A Roofing</span> & others</span>
            </p>
          </div>

        {/* Mobile demo card — full-featured */}
        <div className="lg:hidden mt-4 w-full relative z-20" style={{ animation: 'smoothFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s both' }}>
          <div className="rounded-[18px] flex flex-col overflow-hidden" style={{ background: 'rgba(12,8,6,0.62)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 6px #4ade80' }} />
                <span className="font-inter text-[10px] font-semibold text-white tracking-wide uppercase">CSR Agent</span>
              </div>
              <span className="font-['Roboto',sans-serif] text-[10px]" style={{ color: '#8A8A8A' }}>
                {playing ? `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}` : '1:18'}
              </span>
            </div>
            {/* Body — orb left, transcript + play right */}
            <div className="flex items-center gap-4 px-4 pb-4">
              {/* Orb */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'radial-gradient(circle, rgba(253,80,0,0.30) 0%, transparent 70%)',
                  transform: 'scale(1.4)',
                  animation: playing ? 'orbBreath 2s ease-in-out infinite' : 'orbBreath 3.5s ease-in-out infinite',
                }} />
                {[0, 0.8, 1.6].map((d,idx) => (
                  <div key={idx} className="absolute inset-0 rounded-full" style={{
                    border: `1.5px solid rgba(253,80,0,${playing ? 0.3 : 0.12})`,
                    animation: `${playing ? 'orbPulseRing' : 'orbIdlePulse'} ${playing ? 2.1 : 3.5}s ease-out infinite ${d}s`,
                  }} />
                ))}
                <video autoPlay loop muted playsInline className="relative" style={{
                  width: 90, height: 90, borderRadius: '50%', objectFit: 'cover',
                  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.50))',
                  animation: playing ? 'none' : 'orbGlow 3.5s ease-in-out infinite',
                  boxShadow: playing ? '0 0 0 3px rgba(253,80,0,0.35), 0 0 20px rgba(253,80,0,0.20)' : undefined,
                  transition: 'box-shadow 0.4s ease',
                }}>
                  <source src="/orb-loop.mp4" type="video/mp4" />
                </video>
              </div>
              {/* Right — transcript + play */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                {/* Transcript */}
                <div className="py-2 px-2.5 rounded-[8px]" style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${playing ? 'rgba(253,80,0,0.20)' : 'rgba(255,255,255,0.10)'}`,
                  minHeight: 40,
                }}>
                  {activeMsg >= 0 && playing ? (
                    <p className="font-['Roboto',sans-serif] text-[10px] leading-[1.5]">
                      <span style={{ color: DEMO_TRANSCRIPT[activeMsg].speaker === 'Agent' ? '#fd7040' : '#60a5fa' }}>
                        {DEMO_TRANSCRIPT[activeMsg].speaker}
                      </span>{'  '}
                      {DEMO_TRANSCRIPT[activeMsg].text.split(' ').slice(0, 15).map((word, wi) => (
                        <span key={wi} style={{
                          color: wi <= activeWordIdx ? '#ffffff' : 'rgba(176,176,176,0.45)',
                          transition: 'color 0.12s ease',
                        }}>{word} </span>
                      ))}
                      {DEMO_TRANSCRIPT[activeMsg].text.split(' ').length > 15 && <span style={{ color: 'rgba(176,176,176,0.45)' }}>...</span>}
                    </p>
                  ) : (
                    <p className="font-['Roboto',sans-serif] text-[10px] leading-[1.5]" style={{ color: '#B0B0B0' }}>
                      <span style={{ color: '#fd7040' }}>Agent</span>{"  "}Hi there, Mary. You've reached Maven Roofing...
                    </p>
                  )}
                </div>
                {/* Play button */}
                <button
                  aria-label={playing ? 'Stop call playback' : 'Play call demo'}
                  onClick={() => { setPlaying(p => !p); if (playing) { setActiveMsg(-1); setActiveWordIdx(-1); setElapsed(0); elapsedMsRef.current = 0; if (demoAudioRef.current) { demoAudioRef.current.pause(); demoAudioRef.current.currentTime = 0 } } }}
                  className="w-full flex items-center justify-center gap-2 font-inter font-semibold text-[12px] rounded-[10px] py-2 transition-all hover:brightness-110 active:scale-[0.98] text-white"
                  style={{ background: playing ? 'rgba(255,255,255,0.12)' : '#fd5000', border: `1px solid ${playing ? 'rgba(255,255,255,0.25)' : '#fd5000'}`, boxShadow: playing ? 'none' : '0 4px 14px rgba(253,80,0,0.35)' }}
                >
                  <span className="flex items-center justify-center rounded-full" style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.22)' }}>
                    {playing ? (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="white"><rect x="1" y="1" width="3" height="8" rx="0.5"/><rect x="6" y="1" width="3" height="8" rx="0.5"/></svg>
                    ) : (
                      <svg width="7" height="8" viewBox="0 0 10 12" fill="white"><path d="M0 0L10 6L0 12V0Z"/></svg>
                    )}
                  </span>
                  {playing ? 'Stop' : 'Play Call'}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Right card stack — tilts toward cursor */}
        <div
          className="hidden lg:flex flex-col gap-3 shrink-0 relative"
          style={{ width: 420, perspective: 800 }}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width - 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5
            setTilt({ x: -y * 14, y: x * 14 })
          }}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >

          {/* Dummy card — left (behind) */}
          <div
            className="absolute rounded-[22px]"
            style={{
              width: 420,
              top: 12,
              bottom: 12,
              left: 0,
              background: 'rgba(12,8,6,0.30)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
              transform: cardsFanned
                ? `rotate(-8deg) translateX(-42px) translateY(8px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : 'rotate(0deg) translateX(0px) translateY(0px)',
              transformOrigin: 'bottom center',
              transition: `transform ${cardsFanned && (tilt.x || tilt.y) ? '0.25s ease-out' : '0.7s cubic-bezier(0.34,1.56,0.64,1)'}`,
              zIndex: 0,
            }}
          />
          {/* Dummy card — right (behind) */}
          <div
            className="absolute rounded-[22px]"
            style={{
              width: 420,
              top: 12,
              bottom: 12,
              left: 0,
              background: 'rgba(12,8,6,0.30)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
              transform: cardsFanned
                ? `rotate(8deg) translateX(42px) translateY(8px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : 'rotate(0deg) translateX(0px) translateY(0px)',
              transformOrigin: 'bottom center',
              transition: `transform ${cardsFanned && (tilt.x || tilt.y) ? '0.25s ease-out' : '0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s'}`,
              zIndex: 0,
            }}
          />

          {/* Main glass card */}
          <div
            className="flex flex-col rounded-[22px] relative"
            style={{
              background: 'rgba(12,8,6,0.62)',
              border: '1px solid rgba(255,255,255,0.22)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
              zIndex: 1,
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 6px #4ade80' }} />
                {/* white on #0C0806 → ~20:1 ✓ */}
                <span className="font-inter text-[12px] font-semibold text-white tracking-wide uppercase">CSR Agent</span>
              </div>
              {/* #8A8A8A on #0C0806 ≈ 5.1:1 ✓ */}
              <span className="font-['Roboto',sans-serif] text-[11px]" style={{ color: '#8A8A8A' }}>
                {playing ? `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}` : '0:42'}
              </span>
            </div>

            <style>{`
              @keyframes orbBreath{0%,100%{transform:scale(1);opacity:0.25}50%{transform:scale(1.4);opacity:0.55}}
              @keyframes orbPulseRing{0%{transform:scale(0.8);opacity:0.4}100%{transform:scale(2);opacity:0}}
              @keyframes orbIdlePulse{0%{transform:scale(0.9);opacity:0.25}100%{transform:scale(1.6);opacity:0}}
              @keyframes waveBar{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
              @keyframes orbGlow{0%,100%{box-shadow:0 0 20px rgba(253,80,0,0.15), 0 0 60px rgba(253,80,0,0.08)}50%{box-shadow:0 0 30px rgba(253,80,0,0.30), 0 0 80px rgba(253,80,0,0.15)}}
            `}</style>

            {/* Orb — looping video */}
            <div className="flex items-center justify-center px-8 py-6">
              <div className="relative">
                {/* Glow behind orb */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'radial-gradient(circle, rgba(253,80,0,0.30) 0%, transparent 70%)',
                  transform: 'scale(1.4)',
                  animation: playing ? 'orbBreath 2s ease-in-out infinite' : 'orbBreath 3.5s ease-in-out infinite',
                }} />
                {/* Pulse rings */}
                {[0, 0.8, 1.6].map((d,i) => (
                  <div key={i} className="absolute inset-0 rounded-full" style={{
                    border: `1.5px solid rgba(253,80,0,${playing ? 0.3 : 0.12})`,
                    animation: `${playing ? 'orbPulseRing' : 'orbIdlePulse'} ${playing ? 2.1 : 3.5}s ease-out infinite ${d}s`,
                  }} />
                ))}
                {/* Video orb */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative"
                  style={{
                    width: 220, height: 220, borderRadius: '50%', objectFit: 'cover',
                    filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.50))',
                    animation: playing ? 'none' : 'orbGlow 3.5s ease-in-out infinite',
                    boxShadow: playing ? '0 0 0 3px rgba(253,80,0,0.35), 0 0 30px rgba(253,80,0,0.20)' : undefined,
                    transition: 'box-shadow 0.4s ease',
                  }}
                >
                  <source src="/orb-loop.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Waveform — animates when playing */}
            <div className="flex items-center justify-center gap-[3px] px-6 py-2">
              {bars.map((h, i) => (
                <div key={i} style={{
                  width: 3,
                  height: h,
                  borderRadius: 9,
                  background: playing ? 'rgba(253,80,0,0.75)' : (i < 18 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.18)'),
                  transformOrigin: 'center',
                  animation: playing ? `waveBar ${0.4 + Math.sin(i*0.7)*0.3}s ease-in-out ${i*0.04}s infinite` : 'none',
                  transition: 'background 0.3s ease',
                }} />
              ))}
            </div>

            {/* Transcript — shows active message with word-by-word highlight */}
            <div className="px-4 py-3 mx-4 mb-4 rounded-[12px] overflow-hidden" style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${playing ? 'rgba(253,80,0,0.20)' : 'rgba(255,255,255,0.10)'}`,
              transition: 'border-color 0.3s ease',
              minHeight: 52,
            }}>
              {activeMsg >= 0 && playing ? (
                <p className="font-['Roboto',sans-serif] text-[11px] leading-[1.6]">
                  <span style={{ color: DEMO_TRANSCRIPT[activeMsg].speaker === 'Agent' ? '#fd7040' : '#60a5fa' }}>
                    {DEMO_TRANSCRIPT[activeMsg].speaker}
                  </span>{'  '}
                  {DEMO_TRANSCRIPT[activeMsg].text.split(' ').map((word, wi) => (
                    <span key={wi} style={{
                      color: wi <= activeWordIdx ? '#ffffff' : 'rgba(176,176,176,0.45)',
                      transition: 'color 0.12s ease',
                    }}>{word} </span>
                  ))}
                </p>
              ) : (
                <p className="font-['Roboto',sans-serif] text-[11px] leading-[1.6]" style={{ color: '#B0B0B0' }}>
                  <span style={{ color: '#fd7040' }}>Agent</span>{"  "}Hi there, Mary. You've reached Maven Roofing Services. This is Mavis...
                </p>
              )}
            </div>

            {/* Play / Stop button */}
            <div className="px-4 pb-5">
              <button
                aria-label={playing ? 'Stop call playback' : 'Play call demo'}
                onClick={() => { setPlaying(p => !p); if (playing) { setActiveMsg(-1); setActiveWordIdx(-1); setElapsed(0); elapsedMsRef.current = 0; if (demoAudioRef.current) { demoAudioRef.current.pause(); demoAudioRef.current.currentTime = 0 } } }}
                className="w-full flex items-center justify-center gap-2.5 font-inter font-semibold text-[14px] rounded-[12px] py-3 transition-all hover:brightness-110 active:scale-[0.98] text-white"
                style={{ background: playing ? 'rgba(255,255,255,0.12)' : '#fd5000', border: `1px solid ${playing ? 'rgba(255,255,255,0.25)' : '#fd5000'}`, boxShadow: playing ? 'none' : '0 4px 18px rgba(253,80,0,0.35)', transition: 'all 0.3s ease' }}
              >
                <span className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.22)' }}>
                  {playing ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><rect x="1" y="1" width="3" height="8" rx="0.5"/><rect x="6" y="1" width="3" height="8" rx="0.5"/></svg>
                  ) : (
                    <svg width="8" height="10" viewBox="0 0 10 12" fill="white"><path d="M0 0L10 6L0 12V0Z"/></svg>
                  )}
                </span>
                {playing ? 'Stop' : 'Play Call'}
              </button>
            </div>
          </div>


        </div>

      </div>

      {/* ── Bottom stats strip ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.12)' }}
      >
        <div className="max-w-[1240px] mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 pb-14">
          {HERO_STATS.map(([v, l], i) => (
            <div key={l} className="py-5 flex flex-col items-center gap-[4px]" style={{
              animation: `smoothFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.1}s both`,
            }}>
              <span className="font-jakarta font-extrabold text-white text-[20px] leading-none tracking-[-0.03em]">{v}</span>
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
    name: 'Power Dialer', tag: 'Proactive Outreach',
  },
]

function ChannelBand() {
  return (
    <div className="bg-white border-b border-[#ede8e2] relative rounded-t-[40px] -mt-14 overflow-hidden" style={{ zIndex: 20 }}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-12 py-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="font-['Roboto',sans-serif] text-[10px] tracking-[0.14em] uppercase font-semibold text-[#ABABAB] mr-2 whitespace-nowrap">
          Works Across
        </span>
        {CHANNELS.map((ch) => (
          <div
            key={ch.name}
            className="flex items-center gap-2.5 bg-white rounded-[12px] px-4 py-2.5 transition-all cursor-default"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[#fd5000] shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(253,80,0,0.13), rgba(253,80,0,0.06))', border: '1px solid rgba(253,80,0,0.15)' }}
            >
              {ch.icon}
            </div>
            <span className="font-['Roboto',sans-serif] font-semibold text-[#1A1A1A] text-[13.5px] whitespace-nowrap">{ch.name}</span>
            <span className="font-['Roboto',sans-serif] text-[12px] text-[#9A9A9A] whitespace-nowrap hidden sm:block">· {ch.tag}</span>
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
  { tag: 'Lead Intake',      Icon: ClipboardList, title: 'Intake & Qualification',     desc: 'Captures name, address, damage type, insurance status, and urgency level in one call. Routes the complete intake directly into your Zuper pipeline without re-entry.', color: '#fd5000' },
  { tag: 'Scheduling',       Icon: CalendarCheck,  title: 'Appointment Booking',        desc: 'Presents available time slots, locks in the inspection time, and creates the job record in Zuper before the call ends.', color: '#2563eb' },
  { tag: 'Sales Support',    Icon: MessageSquare,  title: 'Estimation & Quote Queries', desc: 'Answers pricing and scope questions instantly. Flags complex deals for your sales team to own and close.', color: '#059669' },
  { tag: 'Customer Service', Icon: Activity,       title: 'Job Status Updates',         desc: 'Pulls live job data from Zuper and communicates progress, schedule changes, and next steps to homeowners.', color: '#7c3aed' },
  { tag: 'FAQ Handling',     Icon: BookOpen,       title: 'Business & Services FAQ',    desc: 'Knows your services, coverage areas, warranty terms, and financing options. Answers the same way your team would.', color: '#d97706' },
  { tag: 'Storm Response',   Icon: Zap,            title: 'Emergency Triage',           desc: 'Identifies active leaks, storm damage, and structural concerns on the call. Escalates critical cases to on-call crews while capturing full intake.', color: '#e11d48' },
]

// Capabilities scroll constants — visible count only, scroll measured dynamically

function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardsInnerRef = useRef<HTMLDivElement[]>([])
  const colorLayerRef = useRef<HTMLImageElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-scroll cards — seamless infinite loop, pause on hover
  const hoveredRef = useRef(false)
  const inViewRef = useRef(false)
  const halfHeightRef = useRef(0)

  // Measure half-height (one set of cards) for seamless loop reset
  useEffect(() => {
    if (isMobile) return
    const measure = () => {
      const cards = cardsRef.current
      if (!cards) return
      // One set = CAPS.length cards
      const gap = 16 // gap-4 = 16px
      const children = cards.children
      const oneSet = Math.floor(children.length / 3)
      let h = 0
      for (let i = 0; i < oneSet; i++) {
        h += (children[i] as HTMLElement).offsetHeight + gap
      }
      halfHeightRef.current = h // total height of one full set including gaps
    }
    measure()
    const t = setTimeout(measure, 500)
    window.addEventListener('resize', measure)
    return () => { window.removeEventListener('resize', measure); clearTimeout(t) }
  }, [isMobile])

  const offsetRef = useRef(0)
  const userVelocityRef = useRef(0)

  // Drag-to-scroll — grab and drag scrolls cards, normal wheel scrolls page
  const isDraggingRef = useRef(false)
  const dragStartYRef = useRef(0)
  const dragLastYRef = useRef(0)

  useEffect(() => {
    if (isMobile) return
    const vp = viewportRef.current
    if (!vp) return

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      dragStartYRef.current = e.clientY
      dragLastYRef.current = e.clientY
      vp.style.cursor = 'grabbing'
      e.preventDefault()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const delta = dragLastYRef.current - e.clientY
      dragLastYRef.current = e.clientY
      userVelocityRef.current += delta * 0.8
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
      vp.style.cursor = 'grab'
    }

    vp.style.cursor = 'grab'
    vp.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      vp.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return
    let rafId = 0
    const SPEED = 0.7
    let lastTime = 0

    const obs = new IntersectionObserver(
      ([e]) => { inViewRef.current = e.isIntersecting },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)

    const update = (time: number) => {
      const dt = lastTime ? Math.min(time - lastTime, 32) : 16
      lastTime = time

      const cards = cardsRef.current
      const viewport = viewportRef.current

      if (halfHeightRef.current > 0) {
        // Auto-scroll (always running when in view)
        if (inViewRef.current) {
          offsetRef.current += SPEED * (dt / 16)
        }

        // User scroll velocity — decays smoothly
        if (Math.abs(userVelocityRef.current) > 0.1) {
          offsetRef.current += userVelocityRef.current * 0.15
          userVelocityRef.current *= 0.92 // friction
        } else {
          userVelocityRef.current = 0
        }

        // Wrap seamlessly using modulo
        const half = halfHeightRef.current
        offsetRef.current = ((offsetRef.current % half) + half) % half
      }

      // Color overlay — fully visible once section top reaches viewport
      if (sectionRef.current && colorLayerRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, 1 - rect.top / 200))
        colorLayerRef.current.style.opacity = String(progress)
      }

      if (cards) {
        cards.style.transform = `translate3d(0, -${offsetRef.current}px, 0)`
      }

      // Per-card fade at viewport edges (opacity only, no transform)
      if (viewport) {
        const vpTop = viewport.getBoundingClientRect().top
        const vpBottom = viewport.getBoundingClientRect().bottom
        const fadeZone = 70

        for (const card of cardsInnerRef.current) {
          if (!card) continue
          const cardRect = card.getBoundingClientRect()
          const cardMid = (cardRect.top + cardRect.bottom) / 2
          const fromTop = cardMid - vpTop
          const fromBottom = vpBottom - cardMid

          let opacity = 1
          if (fromTop < fadeZone) opacity = Math.max(0, fromTop / fadeZone)
          else if (fromBottom < fadeZone) opacity = Math.max(0, fromBottom / fadeZone)

          card.style.opacity = String(opacity)
        }
      }

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => { cancelAnimationFrame(rafId); obs.disconnect() }
  }, [isMobile])

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="bg-[#f8f5f0] relative pt-10 pb-12 lg:pb-0"
    >
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="relative z-10" style={{ height: isMobile ? 'auto' : '100vh' }}>
        <div style={isMobile ? {} : { height: '100vh', overflow: 'hidden' }}>
          <div className="max-w-[1240px] mx-auto px-4 md:px-12" style={isMobile ? { paddingTop: 24, paddingBottom: 24 } : { paddingTop: 48, paddingBottom: 40, height: '100%', display: 'flex', flexDirection: 'column' as const }}>

            {/* ── Mobile title ── */}
            <div className="lg:hidden mb-6 shrink-0">
              <SectionTextBg>
                <SectionEyebrow icon="⚡" label="Capabilities" />
                <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4">
                  Your newest hire.<br />
                  <span className="text-[#fd5000]">Starting today.</span>
                </h2>
                <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.75] mt-3">
                  CSR Agent knows your business because it runs inside Zuper. So it doesn't just answer calls. It books inspections and creates jobs on the spot.
                </p>
              </SectionTextBg>
            </div>


            {/* ── Body: left column (title + image) + right column (cards) ── */}
            <div className={`${isMobile ? 'flex flex-col gap-4 w-full' : 'flex flex-row gap-8 items-stretch flex-1 min-h-0'}`}>

              {/* Left: title + image stacked */}
              <div className="hidden lg:flex flex-col shrink-0 gap-5" style={{ width: 480 }}>
                {/* Title area */}
                <div className="shrink-0">
                  <SectionTextBg>
                    <SectionEyebrow icon="⚡" label="Capabilities" />
                    <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4">
                      Your newest hire.<br />
                      <span className="text-[#fd5000]">Starting today.</span>
                    </h2>
                    <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.75] mt-3 max-w-[400px]">
                      CSR Agent knows your business because it runs inside Zuper. So it doesn't just answer calls. It books inspections and creates jobs on the spot.
                    </p>
                  </SectionTextBg>
                </div>

                {/* Image */}
                <div className="rounded-[24px] overflow-hidden flex-1 min-h-0" style={{ position: 'relative', boxShadow: '0 8px 48px rgba(0,0,0,0.13)' }}>
                  <img
                    src={assets.csrAgentDesk}
                    alt="CSR Agent"
                    className="w-full h-full block"
                    style={{ objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.15)' }}
                  />
                  <img
                    ref={colorLayerRef}
                    src={assets.csrAgentColor}
                    alt=""
                    aria-hidden
                    style={{
                      objectFit: 'cover', objectPosition: 'center top',
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      transform: 'scale(1.15)',
                      opacity: 0,
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-6 pt-14 pb-6"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.50) 50%, transparent 100%)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-[8px] h-[8px] rounded-full bg-[#4ade80] shrink-0" style={{ boxShadow: '0 0 8px #4ade80' }} />
                      <span className="font-['Roboto',sans-serif] text-[11px] font-medium text-white/80 tracking-[0.12em] uppercase">Available 24/7</span>
                    </div>
                    <p className="font-jakarta font-extrabold text-white text-[22px] leading-tight tracking-[-0.02em]">CSR Agent</p>
                  </div>
                </div>
              </div>

              {/* Right: cards — infinite auto-scroll with edge fading, pauses on hover */}
              <div ref={viewportRef} className={`${isMobile ? 'w-full' : 'flex-1'} relative ${isMobile ? 'overflow-visible' : 'overflow-hidden'}`}
                onMouseEnter={() => { hoveredRef.current = true }}
                onMouseLeave={() => { hoveredRef.current = false }}
              >
                {/* Top fade mask */}
                {!isMobile && <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #f8f5f0, transparent)' }} />}
                {/* Bottom fade mask */}
                {!isMobile && <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, #f8f5f0, transparent)' }} />}
                <div
                  ref={cardsRef}
                  className={`flex flex-col gap-4 ${isMobile ? 'w-full' : 'absolute left-0 right-0'}`}
                  style={isMobile ? {} : {
                    top: 0,
                    willChange: 'transform',
                  }}
                >
                  {/* Render cards twice for seamless infinite loop */}
                  {[...CAPS, ...(isMobile ? [] : [...CAPS, ...CAPS])].map((c, i) => (
                    <div
                      ref={el => { if (el) cardsInnerRef.current[i] = el }}
                      key={`${c.title}-${i}`}
                      className="group bg-white rounded-[16px] md:rounded-[20px] px-4 py-5 md:px-7 md:py-8 flex items-start gap-3 md:gap-5 cursor-grab active:cursor-grabbing"
                      style={{
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        transition: 'box-shadow 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.10)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
                      }}
                    >
                      {/* icon */}
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-[10px] md:rounded-[12px] flex items-center justify-center shrink-0"
                        style={{ background: `linear-gradient(135deg, ${c.color}18 0%, ${c.color}0a 100%)` }}
                      >
                        <c.Icon size={22} strokeWidth={1.7} color={c.color} />
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="font-jakarta font-bold text-[#191919] text-[16px] leading-snug tracking-[-0.01em]">
                            {c.title}
                          </h3>
                          <span className="font-['Roboto',sans-serif] text-[11px] text-[#C8C0B8] font-medium shrink-0 ml-3">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="font-inter text-[14px] text-[#7A7A7A] leading-[1.65] mb-3">{c.desc}</p>
                        <span className="inline-flex items-center font-['Roboto',sans-serif] text-[11px] font-medium px-3 py-[4px] rounded-full"
                          style={{ background: `${c.color}0d`, color: c.color }}>
                          {c.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── MEET THE AGENTS ─────────────────────────── */
const AGENTS = [
  {
    name: 'Dominic',
    title: 'Captures every inbound lead and routes it to your pipeline instantly.',
    img: '/agent-dominic.png',
    glowColor: 'rgba(253, 120, 50, 0.5)',
    number: '001',
    dotColor: '#fd5000',
  },
  {
    name: 'Aria',
    title: 'Books inspections and manages crew scheduling without a dispatcher.',
    img: '/agent-nova.png',
    glowColor: 'rgba(125, 190, 255, 0.5)',
    number: '002',
    dotColor: '#3b82f6',
  },
  {
    name: 'Luna',
    title: 'Triages emergency calls during peak weather and escalates critical cases.',
    img: '/agent-scott.png',
    glowColor: 'rgba(255, 160, 80, 0.5)',
    number: '003',
    dotColor: '#a855f7',
  },
]

export function MeetAgents() {

  const sectionRef = useRef<HTMLDivElement>(null)
  const [spread, setSpread] = useState(0)
  const SCROLL_RUNWAY = 500

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Start animation as soon as section enters viewport from bottom
      // Progress 0 → 1 over SCROLL_RUNWAY pixels of scroll after section top enters view
      const entered = vh - rect.top
      const progress = Math.max(0, Math.min(1, entered / (vh * 0.5 + SCROLL_RUNWAY)))
      setSpread(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={sectionRef} className="bg-[#f8f5f0] relative">
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />

      {/* Scroll runway — section stays pinned while cards spread */}
      <div style={{ height: `calc(100vh + ${SCROLL_RUNWAY}px)` }}>
        <div className="sticky top-0" style={{ height: '100vh', overflow: 'hidden' }}>
          <div className="max-w-[1120px] mx-auto px-5 md:px-12 relative z-10 h-full flex flex-col justify-center">

            <div className="text-center mb-14">
              <SectionEyebrow icon="🤖" label="Agents" />
              <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
                Meet Your <span className="text-[#fd5000]">AI Team</span>
              </h2>
              <p className="font-inter text-[17px] font-light text-[#5A5A5A] max-w-[480px] mx-auto leading-[1.7]">
                Three specialized agents, each trained for a different part of your roofing workflow.
              </p>
            </div>

            <div className="relative flex justify-center" style={{ perspective: 1200, height: 480 }}>
              {AGENTS.map((agent, i) => {
                const isCenter = i === 1
                const isLeft = i === 0

                // All three cards are absolutely positioned, center card on top
                // Side cards start hidden behind center, fan out on scroll
                const tx = isCenter ? 0 : isLeft ? -360 * spread : 360 * spread
                const tz = isCenter ? 0 : -50 * (1 - spread)
                const ry = isCenter ? 0 : isLeft ? 25 * (1 - spread) : -25 * (1 - spread)
                const s = isCenter ? 1 : 0.85 + spread * 0.15
                const o = isCenter ? 1 : spread * 1

                return (
                <div key={agent.name} className="absolute" style={{
                  width: 320,
                  top: 0,
                  left: '50%',
                  marginLeft: -160,
                  transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${s})`,
                  opacity: o,
                  zIndex: isCenter ? 3 : 1,
                }}>
                  <ProfileCard
                    name={agent.name}
                    title={agent.title}
                    status="Online"
                    number={agent.number}
                    dotColor={agent.dotColor}
                    avatarUrl={agent.img}
                    enableTilt={true}
                    behindGlowColor={agent.glowColor}
                    behindGlowEnabled
                  />
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* AgentCard replaced by ProfileCard component */

/* ─────────────────────────── VOICE LANGUAGES ─────────────────────────── */
const VOICES = [
  { lang: 'English', accent: '#fd5000', colors: ['#fd5000'] },
  { lang: 'Spanish', accent: '#0066ff', colors: ['#0066ff'] },
  { lang: 'Tamil', accent: '#00b368', colors: ['#00b368'] },
  { lang: 'French', accent: '#8b5cf6', colors: ['#8b5cf6'] },
]

function VoiceCard({ colors, spinning }: { accent: string; colors: string[]; spinning: boolean; onToggle: () => void }) {
  const uid = colors[0].replace('#', '')
  return (
    <div className="relative flex flex-col items-center">
      <style>{`@keyframes vinylSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      <div className="relative" style={{ width: 140, height: 140 }}>
        {/* Drop shadow underneath */}
        <div className="absolute rounded-full" style={{
          inset: 4, bottom: 0, top: 8,
          background: 'rgba(0,0,0,0.12)',
          filter: 'blur(8px)',
        }} />
        <svg viewBox="0 0 200 200" className="relative w-full h-full" style={{
          animation: spinning ? 'vinylSpin 3s linear infinite' : 'none',
          transition: spinning ? 'none' : 'transform 2s cubic-bezier(0.1,0.7,0.3,1)',
        }}>
          <defs>
            <clipPath id={`lbl${uid}`}><circle cx="100" cy="100" r="34" /></clipPath>
            <radialGradient id={`rg${uid}`} cx="38%" cy="35%">
              <stop offset="0%" stopColor="white" stopOpacity="0.12" />
              <stop offset="60%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`shine${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.08" />
              <stop offset="50%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Base disc — flat */}
          <circle cx="100" cy="100" r="99" fill="#222" />

          {/* Outer edge */}
          <circle cx="100" cy="100" r="99" fill="none" stroke="#333" strokeWidth="1" />

          {/* Grooves — lots of visible lines like a real record */}
          {Array.from({ length: 30 }).map((_, i) => {
            const r = 95 - i * 1.9
            if (r <= 36) return null
            const bright = i % 5 === 0 ? 0.09 : i % 3 === 0 ? 0.06 : 0.035
            return <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={`rgba(255,255,255,${bright})`} strokeWidth="0.6" />
          })}

          {/* Light reflection — bright groove fans on opposite sides, only when spinning */}
          {/* Top-left fan */}
          {Array.from({ length: 8 }).map((_, i) => {
            const r = 90 - i * 6
            if (r <= 36) return null
            return <path key={`tl${i}`} d={`M${100 + r * Math.cos(3.6)} ${100 + r * Math.sin(3.6)} A${r} ${r} 0 0 1 ${100 + r * Math.cos(4.4)} ${100 + r * Math.sin(4.4)}`}
              fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"
              style={{ opacity: spinning ? 1 : 0, transition: `opacity 0.5s ease ${i * 0.03}s` }} />
          })}
          {/* Bottom-right fan — symmetrical */}
          {Array.from({ length: 8 }).map((_, i) => {
            const r = 90 - i * 6
            if (r <= 36) return null
            return <path key={`br${i}`} d={`M${100 + r * Math.cos(0.5)} ${100 + r * Math.sin(0.5)} A${r} ${r} 0 0 1 ${100 + r * Math.cos(1.3)} ${100 + r * Math.sin(1.3)}`}
              fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"
              style={{ opacity: spinning ? 1 : 0, transition: `opacity 0.5s ease ${i * 0.03}s` }} />
          })}


          {/* Dead wax / run-out area */}
          <circle cx="100" cy="100" r="37" fill="#222" />
          <circle cx="100" cy="100" r="37" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="36" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

          {/* Label — single solid color */}
          <circle cx="100" cy="100" r="34" fill={colors[0]} />
          {/* Label grooves — dark rings for vinyl feel */}
          <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="26" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="22" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="18" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.3" />
          {/* Label shine */}
          <circle cx="100" cy="100" r="34" fill={`url(#rg${uid})`} />

          {/* Label edge — crisp ring */}
          <circle cx="100" cy="100" r="34" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />

          {/* Center hole with shadow ring */}
          <circle cx="100" cy="100" r="7.5" fill="#0a0a0a" />
          <circle cx="100" cy="100" r="6" fill="#f8f5f0" />
          <circle cx="100" cy="100" r="6" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          {/* Tiny spindle pip */}
          <circle cx="100" cy="100" r="1.5" fill="#ccc" />
        </svg>
      </div>
    </div>
  )
}

export function VoiceLanguages() {

  const [activeIdx, setActiveIdx] = useState(-1)

  return (
    <div className="py-20 bg-[#f8f5f0] relative overflow-hidden">
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1120px] mx-auto px-5 md:px-12 relative z-10">
        <RevealOnScroll className="text-center mb-14">
          <SectionEyebrow icon="" label="Voices" />
          <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
            Support 100+ languages with<br /><span className="text-[#fd5000]">localized voice.</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {VOICES.map((v, i) => (
            <RevealOnScroll key={v.lang} delay={i * 80}>
              <div className="rounded-[20px] overflow-hidden cursor-pointer group"
                style={{
                  background: 'white',
                  boxShadow: activeIdx === i ? '0 12px 32px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.05)',
                  transform: activeIdx === i ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
                onMouseEnter={e => { if (activeIdx !== i) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.07)' } }}
                onMouseLeave={e => { if (activeIdx !== i) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)' } }}
                onClick={() => setActiveIdx(activeIdx === i ? -1 : i)}
              >
                <div className="flex items-center justify-center pt-12 pb-10">
                  <VoiceCard accent={v.accent} colors={v.colors} spinning={activeIdx === i} onToggle={() => setActiveIdx(activeIdx === i ? -1 : i)} />
                </div>
                <div className="px-6 pb-6 flex items-center justify-between">
                  <span className="font-jakarta font-bold text-[16px] text-[#191919]">{v.lang}</span>
                  <button onClick={(e) => { e.stopPropagation(); setActiveIdx(activeIdx === i ? -1 : i) }}
                    className="play-btn w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: activeIdx === i ? '#191919' : '#f0ede8' }}
                  >
                    {activeIdx === i ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" style={{ fill: 'white' }}><rect x="1" y="0" width="3" height="10" rx="0.5"/><rect x="6" y="0" width="3" height="10" rx="0.5"/></svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 10 12" fill="#666" className="play-icon transition-colors duration-300" style={{ marginLeft: 1 }}><path d="M0 0L10 6L0 12Z"/></svg>
                    )}
                    <style>{`.group:hover .play-btn:not([style*="#191919"]){background:#fd5000 !important;box-shadow:0 3px 12px rgba(253,80,0,0.25)}.group:hover .play-icon{fill:white !important}`}</style>
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── GET STARTED ─────────────────────────── */

// Animated illustration: Agent profile — Nova card with form fields appearing
function IllusAgentProfile({ active, onComplete }: { active?: boolean; onComplete?: () => void }) {
  const [phase, setPhase] = useState<'typing' | 'ready' | 'hovering' | 'clicking' | 'card' | 'reset'>('typing')
  const [typedChars, setTypedChars] = useState(0)
  const [spinAngle, setSpinAngle] = useState(0)
  const name = 'Nova'
  const btnRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Reset when step becomes active
  useEffect(() => {
    if (active) { setTypedChars(0); setPhase('typing') }
  }, [active])

  // Typewriter
  useEffect(() => {
    if (phase !== 'typing') return
    if (typedChars >= name.length) {
      const t = setTimeout(() => setPhase('ready'), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTypedChars(prev => prev + 1), 200)
    return () => clearTimeout(t)
  }, [phase, typedChars])

  // Button appears → cursor moves to it
  useEffect(() => {
    if (phase !== 'ready') return
    const t = setTimeout(() => setPhase('hovering'), 600)
    return () => clearTimeout(t)
  }, [phase])

  // Cursor hovers → clicks
  useEffect(() => {
    if (phase !== 'hovering') return
    const t = setTimeout(() => setPhase('clicking'), 800)
    return () => clearTimeout(t)
  }, [phase])

  // Click → show card + spin
  useEffect(() => {
    if (phase !== 'clicking') return
    const t = setTimeout(() => { setPhase('card'); setSpinAngle(prev => prev + 360) }, 400)
    return () => clearTimeout(t)
  }, [phase])

  // Card holds then signals complete
  useEffect(() => {
    if (phase !== 'card') return
    const t = setTimeout(() => { onComplete?.(); setPhase('reset') }, 3500)
    return () => clearTimeout(t)
  }, [phase])

  // Reset → loop
  useEffect(() => {
    if (phase !== 'reset') return
    setTypedChars(0)
    const t = setTimeout(() => setPhase('typing'), 800)
    return () => clearTimeout(t)
  }, [phase])

  const displayName = name.slice(0, typedChars)
  const showCursor = phase === 'typing'
  const showForm = phase !== 'card'
  const showCard = phase === 'card'
  const btnVisible = phase === 'ready' || phase === 'hovering' || phase === 'clicking'
  const btnPressed = phase === 'clicking'
  const cursorOnBtn = phase === 'hovering' || phase === 'clicking'

  return (
    <div className="flex items-center justify-center p-6 h-full min-h-[360px] md:min-h-[540px]" style={{ backgroundImage: 'url(/agent-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-[90%] md:max-w-[340px] relative min-h-[280px] md:min-h-[360px]">

        {/* Form card */}
        <div className="absolute inset-0 flex items-center justify-center" style={{
          opacity: showForm ? 1 : 0,
          transform: showForm ? 'scale(1)' : 'scale(0.92)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: showForm ? 'auto' as const : 'none' as const,
        }}>
          <div className="w-full rounded-[16px] p-6 flex flex-col gap-4 relative" style={{ background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div>
              <div className="font-inter text-[11px] text-[#6b6b6b] mb-1.5">name</div>
              <div className="rounded-[8px] px-3 py-2.5 font-inter text-[15px] text-[#191919] min-h-[42px]" style={{ border: '1px solid #e8e3dc' }}>
                {displayName}
                {showCursor && <span className="inline-block w-[2px] h-[16px] bg-[#fd5000] ml-0.5 align-middle" style={{ animation: 'subtlePulse 0.6s step-end infinite' }} />}
              </div>
            </div>
            <div>
              <div className="font-inter text-[11px] text-[#6b6b6b] mb-1.5">Communication tone</div>
              <div className="rounded-[8px] px-3 py-2.5 font-inter text-[13px] text-[#6b6b6b] flex items-center justify-between" style={{ border: '1px solid #e8e3dc' }}>
                Friendly & Approachable
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
            <div>
              <div className="font-inter text-[11px] text-[#6b6b6b] mb-1.5">Voice</div>
              <div className="rounded-[8px] px-3 py-2.5 font-inter text-[13px] text-[#6b6b6b] flex items-center justify-between" style={{ border: '1px solid #e8e3dc' }}>
                Nova (Female)
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
            {/* Create agent button */}
            <div ref={btnRef} style={{
              maxHeight: btnVisible ? 48 : 0,
              opacity: btnVisible ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <div className="rounded-[10px] py-2.5 text-center font-inter text-[13px] font-semibold text-white" style={{
                background: '#191919',
                transform: btnPressed ? 'scale(0.96)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}>
                Create agent
              </div>
            </div>

            {/* Fake cursor */}
            <div ref={cursorRef} className="absolute pointer-events-none z-20" style={{
              bottom: cursorOnBtn ? 22 : -20,
              right: cursorOnBtn ? 80 : 40,
              opacity: cursorOnBtn ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: btnPressed ? 'scale(0.85)' : 'scale(1)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-7 1.5L9 21z" fill="#191919" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Nova agent ID card */}
        <div className="absolute inset-0 flex items-center justify-center" style={{
          opacity: showCard ? 1 : 0,
          transform: showCard ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: showCard ? 'auto' as const : 'none' as const,
          perspective: 1000,
        }}>
          <div className="w-full max-w-[260px] rounded-[18px] overflow-hidden" style={{
            background: 'white', boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
            transform: `rotateY(${spinAngle}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
          }}>
            <div className="relative" style={{ height: 200, background: 'linear-gradient(145deg, #e8dff8, #f3eeff)' }}>
              <img src="/agent-nova.png" alt="Nova" className="absolute inset-0 w-full h-full object-contain" style={{ objectPosition: 'center bottom' }} />
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-jakarta font-bold text-[18px] text-[#191919]">Nova</span>
                <span className="font-['Roboto',sans-serif] text-[9px] font-bold px-2 py-[3px] rounded-[5px]" style={{ background: '#f0fdf4', color: '#15803d' }}>Z-134</span>
              </div>
              <p className="font-inter text-[12px] text-[#6b6b6b]">Organized, focused, and task driven.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {[
                  { label: 'Task management', bg: '#eef4ff', color: '#2563eb' },
                  { label: 'Team collaboration', bg: '#f0e8ff', color: '#7c3aed' },
                  { label: 'Project planning', bg: '#e8f5ec', color: '#15803d' },
                ].map(t => (
                  <span key={t.label} className="font-['Roboto',sans-serif] text-[9px] font-semibold px-2.5 py-[4px] rounded-full" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// Animated illustration: Superpowers — toggles enable one by one, pills appear on Nova card
function IllusSuperpowers({ active, onComplete }: { active?: boolean; onComplete?: () => void }) {
  const caps = [
    { label: 'Answer calls', icon: '📞', color: '#fd5000', bg: '#fff3ed' },
    { label: 'Take bookings', icon: '📅', color: '#2563eb', bg: '#eef4ff' },
    { label: 'Job Updates', icon: '📊', color: '#059669', bg: '#e8f5ec' },
    { label: 'Reschedule', icon: '🔄', color: '#7c3aed', bg: '#f0e8ff' },
  ]
  const [enabledCount, setEnabledCount] = useState(0)
  const completedRef = useRef(false)
  useEffect(() => {
    if (active) { setEnabledCount(0); completedRef.current = false }
  }, [active])
  useEffect(() => {
    const id = setInterval(() => {
      setEnabledCount(prev => {
        if (prev >= caps.length) {
          if (!completedRef.current) { completedRef.current = true; setTimeout(() => onComplete?.(), 1200) }
          return 0
        }
        return prev + 1
      })
    }, 1200)
    return () => clearInterval(id)
  }, [active])
  return (
    <div className="p-6 flex flex-col justify-center h-full min-h-[360px] md:min-h-[540px]" style={{ backgroundImage: 'url(/sp-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-[90%] md:max-w-[500px] mx-auto flex flex-col items-center gap-4">
        {/* Nova ID card with floating pills */}
        <div className="relative w-[200px] md:w-[260px]">
          {/* Floating capability pills around the card */}
          {caps.map((cap, i) => {
            const enabled = i < enabledCount
            const positions: { style: React.CSSProperties; from: string }[] = [
              { style: { top: -14, right: -40 }, from: 'translate(-10px, 10px)' },
              { style: { top: '45%', right: -55 }, from: 'translateX(-15px)' },
              { style: { top: '45%', left: -55 }, from: 'translateX(15px)' },
              { style: { top: -14, left: -35 }, from: 'translate(10px, 10px)' },
            ]
            const pos = positions[i]
            return (
              <div key={cap.label} className="absolute z-10 flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap pointer-events-none" style={{
                ...pos.style,
                background: enabled ? 'white' : 'transparent',
                boxShadow: enabled ? `0 4px 16px ${cap.color}20` : 'none',
                border: enabled ? `1px solid ${cap.color}30` : '1px solid transparent',
                opacity: enabled ? 1 : 0,
                transform: enabled ? 'scale(1) translate(0, 0)' : `scale(0.7) ${pos.from}`,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                <span className="text-[13px]">{cap.icon}</span>
                <span className="font-inter text-[11px] font-semibold" style={{ color: cap.color }}>{cap.label}</span>
              </div>
            )
          })}

          <div className="rounded-[18px] overflow-hidden" style={{ background: 'white', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
            <div className="relative" style={{ height: 200, background: 'linear-gradient(145deg, #fde8e0, #fef0ea)' }}>
              <img src="/agent-nova.png" alt="Nova" className="absolute inset-0 w-full h-full object-contain" style={{ objectPosition: 'center bottom' }} />
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-jakarta font-bold text-[17px] text-[#191919]">Nova</span>
                <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e]" style={{ boxShadow: '0 0 6px #22c55e' }} />
              </div>
              <p className="font-inter text-[12px] text-[#6b6b6b]">Organized, focused, and task driven.</p>
            </div>
          </div>
        </div>

        {/* 4 capability cards in a row */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {caps.map((cap, i) => {
            const enabled = i < enabledCount
            return (
              <div key={cap.label} className="rounded-[12px] p-3 transition-all duration-400 flex flex-col items-center text-center" style={{
                background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: enabled ? `1.5px solid ${cap.color}` : '1.5px solid transparent',
              }}>
                <span className="text-[18px] mb-1.5">{cap.icon}</span>
                <div className="font-inter text-[10px] font-semibold text-[#191919] mb-1.5 leading-tight">{cap.label}</div>
                <div className="w-8 h-[18px] rounded-full flex items-center px-[2px] mt-auto" style={{ background: enabled ? cap.color : '#e5e0d8', transition: 'background 0.3s ease' }}>
                  <div className="w-[14px] h-[14px] rounded-full bg-white" style={{ marginLeft: enabled ? 12 : 0, transition: 'margin-left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Animated illustration: Knowledge base — cards feed into Nova agent
function IllusKnowledgeBase({ active, onComplete }: { active?: boolean; onComplete?: () => void }) {
  const items = [
    { label: 'Greeting', icon: '💬', text: 'Hi there! This is Nova, an AI agent...' },
    { label: 'Company Info', icon: '🏢', text: 'Maven Pvt. Ltd. — Roofing specialist' },
    { label: 'FAQ Trained', icon: '📖', text: 'Weekend appointments, pricing, etc.' },
  ]
  const [fedCount, setFedCount] = useState(0)
  const completedRef = useRef(false)
  useEffect(() => {
    if (active) { setFedCount(0); completedRef.current = false }
  }, [active])
  useEffect(() => {
    const id = setInterval(() => setFedCount(prev => {
      if (prev >= items.length) {
        if (!completedRef.current) { completedRef.current = true; setTimeout(() => onComplete?.(), 1600) }
        return 0
      }
      return prev + 1
    }), 1800)
    return () => clearInterval(id)
  }, [active])

  return (
    <div className="p-6 flex items-center justify-center h-full min-h-[360px] md:min-h-[540px]" style={{ backgroundImage: 'url(/kb-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-[90%] md:max-w-[560px] flex flex-col md:flex-row items-center gap-4 md:gap-6">

        {/* Left — info cards that fly into agent */}
        <div className="flex-1 flex flex-col gap-2.5 relative">
          {items.map((item, i) => {
            const fed = i < fedCount
            const isFeeding = i === fedCount - 1 && fedCount > 0
            return (
              <div key={item.label} className="rounded-[14px] p-4 flex items-center gap-3.5 relative overflow-hidden" style={{
                background: 'white',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                transform: fed ? 'translateX(40px) scale(0.88)' : isFeeding ? 'translateX(8px)' : 'translateX(0) scale(1)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                border: isFeeding ? '1.5px solid #7c3aed' : '1.5px solid transparent',
              }}>
                {/* Sweep overlay when feeding */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.08) 50%, transparent 100%)',
                  transform: isFeeding ? 'translateX(100%)' : 'translateX(-100%)',
                  transition: isFeeding ? 'transform 0.8s ease-in-out' : 'none',
                }} />
                {/* Fade to purple tint when fed */}
                <div className="absolute inset-0 rounded-[12px] pointer-events-none" style={{
                  background: 'rgba(124,58,237,0.06)',
                  opacity: fed ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }} />
                <div className="relative z-10 flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-500" style={{
                    background: fed ? '#f0e8ff' : '#f8f5f0',
                  }}>
                    <span className="text-[20px]">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-inter text-[13px] font-semibold text-[#191919] transition-colors duration-500" style={{ color: fed ? '#7c3aed' : '#191919' }}>{item.label}</div>
                    <div className="font-inter text-[11px] text-[#6b6b6b] truncate">{item.text}</div>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500" style={{
                    background: fed ? '#7c3aed' : '#f0ebe3',
                    transform: fed ? 'scale(1)' : 'scale(0.8)',
                  }}>
                    {fed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right — Nova agent card absorbing knowledge */}
        <div className="shrink-0 relative w-full md:w-[220px]">
          <div className="rounded-[18px] overflow-hidden transition-all duration-700" style={{
            background: 'white',
            boxShadow: fedCount > 0 ? `0 0 ${10 + fedCount * 10}px rgba(124,58,237,${0.08 + fedCount * 0.05}), 0 12px 40px rgba(0,0,0,0.1)` : '0 12px 40px rgba(0,0,0,0.1)',
          }}>
            <div className="relative" style={{ height: 180, background: 'linear-gradient(145deg, #e8dff8, #f3eeff)' }}>
              <img src="/agent-nova.png" alt="Nova" className="absolute inset-0 w-full h-full object-contain" style={{ objectPosition: 'center bottom' }} />
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-jakarta font-bold text-[16px] text-[#191919]">Nova</span>
                <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e]" style={{ boxShadow: '0 0 5px #22c55e' }} />
              </div>
              <p className="font-inter text-[11px] text-[#6b6b6b]">CSR Agent · Roofing</p>
              {/* Knowledge progress */}
              <div className="mt-3 h-[5px] rounded-full overflow-hidden" style={{ background: '#f0ebe3' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${(fedCount / items.length) * 100}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                }} />
              </div>
              <div className="font-['Roboto',sans-serif] text-[9px] text-[#6b6b6b] mt-1.5">
                {fedCount >= items.length ? 'Trained ✓' : `Learning... ${Math.round((fedCount / items.length) * 100)}%`}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// Animated illustration: Add to route — Nova card + connect button → cursor clicks → call scene
function IllusAddRoute({ active, onComplete }: { active?: boolean; onComplete?: () => void }) {
  // card: show Nova card with button, hovering: cursor moves to btn, clicking: press,
  // scene: call scene with biz→customer, joining: Nova slides into middle, reset
  const [phase, setPhase] = useState<'card' | 'hovering' | 'clicking' | 'scene' | 'joining' | 'reset'>('card')

  useEffect(() => {
    if (active) setPhase('card')
  }, [active])

  useEffect(() => {
    if (phase === 'card') {
      const t = setTimeout(() => setPhase('hovering'), 1200)
      return () => clearTimeout(t)
    }
    if (phase === 'hovering') {
      const t = setTimeout(() => setPhase('clicking'), 700)
      return () => clearTimeout(t)
    }
    if (phase === 'clicking') {
      const t = setTimeout(() => setPhase('scene'), 400)
      return () => clearTimeout(t)
    }
    if (phase === 'scene') {
      const t = setTimeout(() => setPhase('joining'), 2000)
      return () => clearTimeout(t)
    }
    if (phase === 'joining') {
      const t = setTimeout(() => { onComplete?.(); setPhase('reset') }, 3200)
      return () => clearTimeout(t)
    }
    if (phase === 'reset') {
      const t = setTimeout(() => setPhase('card'), 800)
      return () => clearTimeout(t)
    }
  }, [phase])

  const showCard = phase === 'card' || phase === 'hovering' || phase === 'clicking'
  const showScene = phase === 'scene' || phase === 'joining'
  const cursorOnBtn = phase === 'hovering' || phase === 'clicking'
  const btnPressed = phase === 'clicking'
  const novaIn = phase === 'joining'

  return (
    <div className="p-6 flex items-center justify-center h-full min-h-[360px] md:min-h-[540px]" style={{ backgroundImage: 'url(/route-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="relative w-full max-w-[90%] md:max-w-[460px] h-[280px] md:h-[360px]">

        {/* === Phase 1: Nova card with Connect Agent button === */}
        <div className="absolute inset-0 flex items-center justify-center" style={{
          opacity: showCard ? 1 : 0,
          transform: showCard ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: showCard ? 'auto' as const : 'none' as const,
        }}>
          <div className="relative">
            <div className="rounded-[18px] overflow-hidden" style={{
              background: 'white', boxShadow: '0 12px 40px rgba(0,0,0,0.1)', width: 220,
            }}>
              <div className="relative" style={{ height: 120, background: 'linear-gradient(145deg, #d1fae5, #ecfdf5)' }}>
                <img src="/agent-nova.png" alt="Nova" className="absolute inset-0 w-full h-full object-contain" style={{ objectPosition: 'center bottom' }} />
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="font-jakarta font-bold text-[16px] text-[#191919]">Nova</span>
                  <span className="font-['Roboto',sans-serif] text-[9px] font-bold px-2 py-[3px] rounded-[5px]" style={{ background: '#f0fdf4', color: '#15803d' }}>AI</span>
                </div>
                <p className="font-inter text-[11px] text-[#888] mb-3">Ready to handle calls</p>
                <div className="rounded-[10px] py-2.5 text-center font-inter text-[13px] font-semibold text-white" style={{
                  background: '#059669',
                  transform: btnPressed ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                }}>
                  Connect Agent
                </div>
              </div>
            </div>
            {/* Fake cursor */}
            <div className="absolute pointer-events-none z-20" style={{
              bottom: cursorOnBtn ? 28 : -10,
              right: cursorOnBtn ? 50 : 20,
              opacity: cursorOnBtn ? 1 : 0,
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: btnPressed ? 'scale(0.85)' : 'scale(1)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-7 1.5L9 21z" fill="#191919" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* === Phase 2: Call scene === */}
        <div className="absolute inset-0" style={{
          opacity: showScene ? 1 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: showScene ? 'auto' as const : 'none' as const,
        }}>
          {/* Connection lines — use percentages matching card positions */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" fill="none" style={{ overflow: 'visible' }}>
            {/* Direct line — fades out when Nova arrives */}
            <line x1="18%" y1="50%" x2="82%" y2="50%"
              stroke="#d4d4d4" strokeWidth="1.5" strokeDasharray="6 4"
              style={{ opacity: novaIn ? 0 : 0.8, transition: 'opacity 0.6s ease' }}
            />
            {/* Pulse along direct line */}
            {!novaIn && showScene && (
              <circle r="4" fill="#059669" opacity="0.7">
                <animate attributeName="cx" from="18%" to="82%" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="cy" values="50%" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Lines: Business → Nova */}
            <line x1="18%" y1="50%" x2="32%" y2="50%"
              stroke="#059669" strokeWidth="2" strokeDasharray="6 4"
              style={{ opacity: novaIn ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }}
            />
            {/* Lines: Nova → Customer */}
            <line x1="68%" y1="50%" x2="82%" y2="50%"
              stroke="#059669" strokeWidth="2" strokeDasharray="6 4"
              style={{ opacity: novaIn ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }}
            />
            {novaIn && (
              <>
                <circle r="4" fill="#059669" opacity="0.7">
                  <animate attributeName="cx" from="18%" to="32%" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="50%" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#059669" opacity="0.7">
                  <animate attributeName="cx" from="68%" to="82%" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="50%" dur="1s" repeatCount="indefinite" />
                </circle>
              </>
            )}
          </svg>

          {/* Business — left, slides further left when Nova joins */}
          <div className="absolute" style={{
            left: novaIn ? 0 : 40,
            top: '50%',
            transform: 'translateY(-50%)',
            transition: 'left 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <div className="rounded-[14px] p-4 flex flex-col items-center gap-2" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: 90 }}>
              <span className="text-[28px]">🏢</span>
              <span className="font-inter text-[12px] font-semibold text-[#191919]">Business</span>
            </div>
          </div>

          {/* Customer — right, slides further right when Nova joins */}
          <div className="absolute" style={{
            right: novaIn ? 0 : 40,
            top: '50%',
            transform: 'translateY(-50%)',
            transition: 'right 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <div className="rounded-[14px] p-4 flex flex-col items-center gap-2" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: 90 }}>
              <span className="text-[28px]">👤</span>
              <span className="font-inter text-[12px] font-semibold text-[#191919]">Customer</span>
            </div>
          </div>

          {/* Nova card — drops in to center */}
          <div className="absolute" style={{
            left: '50%',
            top: '50%',
            transform: novaIn ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -20%) scale(0.92)',
            opacity: novaIn ? 1 : 0,
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10,
          }}>
            <div className="rounded-[18px] overflow-hidden" style={{
              background: 'white', boxShadow: '0 12px 40px rgba(0,0,0,0.1)', width: 200,
            }}>
              <div className="relative" style={{ height: 130, background: 'linear-gradient(145deg, #d1fae5, #ecfdf5)' }}>
                <img src="/agent-nova.png" alt="Nova" className="absolute inset-0 w-full h-full object-contain" style={{ objectPosition: 'center bottom' }} />
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-jakarta font-bold text-[17px] text-[#191919]">Nova</span>
                  <span className="w-[7px] h-[7px] rounded-full bg-[#22c55e]" style={{ boxShadow: '0 0 6px #22c55e' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const STEPS: { num: string; title: string; desc: string; tag: string; color: string; tagBg: string; tagText: string; icon: React.ReactNode; Illustration: React.ComponentType<{ active?: boolean; onComplete?: () => void }> }[] = [
  { num: '01', title: 'Agent Identity', desc: 'Name your agent, set the personality, and define expertise areas.', tag: 'Identity',
    color: '#7c3aed', tagBg: '#f0e8ff', tagText: '#5b21b6',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Illustration: IllusAgentProfile,
  },
  { num: '02', title: 'Superpowers', desc: 'Toggle what the agent can do: answer calls, take bookings, share updates, reschedule.', tag: 'Capabilities',
    color: '#fd5000', tagBg: '#fff3ed', tagText: '#b93500',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    Illustration: IllusSuperpowers,
  },
  { num: '03', title: 'Knowledge Base', desc: 'Upload your pricing guides, FAQs, and SOPs. Your CSR Agent learns your business in minutes.', tag: 'Intelligence',
    color: '#2563eb', tagBg: '#eef4ff', tagText: '#1e40af',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    Illustration: IllusKnowledgeBase,
  },
  { num: '04', title: 'Deployment', desc: 'Connect to your existing call routes.', tag: 'Deployment',
    color: '#059669', tagBg: '#e8f5ec', tagText: '#065f46',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
    Illustration: IllusAddRoute,
  },
]

function GetStarted() {
  const [activeStep, setActiveStep] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const STEP_DURATIONS = [6000, 6000, 7000, 6000]

  // Detect when section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Timer — only when in view; CSS handles the progress bar animation
  useEffect(() => {
    if (!inView) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setAnimating(false)
      return
    }
    // Reset then start CSS transition on next frame
    setAnimating(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)))

    const duration = STEP_DURATIONS[activeStep] || 6000
    timerRef.current = setTimeout(() => {
      setActiveStep(prev => (prev + 1) % STEPS.length)
    }, duration)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeStep, inView])

  return (
    <section id="get-started" ref={sectionRef} className="py-20 bg-[#f8f5f0] relative overflow-hidden">
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 relative z-10">
        {/* Title row — eyebrow + heading + subtitle in one line */}
        <RevealOnScroll className="mb-14">
          <SectionTextBg>
            <SectionEyebrow icon="" label="Get Started" />
            <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4">
              From setup to live calls<br />in <span className="text-[#fd5000]">minutes.</span>
            </h2>
            <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.7] mt-3">
              No dev team. No long onboarding.
            </p>
          </SectionTextBg>
        </RevealOnScroll>

        {/* ── Single card: steps left, illustration right ── */}
        <RevealOnScroll>
          <div className="rounded-[16px] md:rounded-[24px] overflow-hidden grid grid-cols-1 lg:grid-cols-[380px_1fr]" style={{ background: 'white', boxShadow: '0 2px 24px rgba(0,0,0,0.05)' }}>

            {/* Left — step accordion */}
            <div className="flex flex-col h-full">
              {/* Step list — fills the full height equally */}
              <div className="flex flex-col flex-1">
                {STEPS.map((s, i) => {
                  const isActive = i === activeStep
                  return (
                    <button
                      key={s.num}
                      onClick={() => setActiveStep(i)}
                      className="text-left transition-all duration-300 cursor-pointer lg:flex-1 flex items-stretch relative pr-4 md:pr-6"
                      style={{
                        paddingLeft: 0,
                        borderBottom: i < STEPS.length - 1 ? '1px solid #ece7e0' : 'none',
                        background: isActive ? `linear-gradient(to right, ${s.color}0a, transparent)` : 'transparent',
                      }}
                    >
                      {/* Spacer for consistent padding */}
                      <div className="w-[4px] shrink-0" />
                      <div className="flex-1 flex flex-col justify-center py-3 pl-3 md:py-5 md:pl-5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-['Roboto',sans-serif] text-[11px] font-bold transition-colors duration-300" style={{ color: isActive ? s.color : '#c0b8ae' }}>{s.num}</span>
                          <h3 className={`font-jakarta font-bold text-[14px] md:text-[16px] transition-colors duration-300 ${isActive ? 'text-[#191919]' : 'text-[#6b6b6b]'}`}>
                            {s.title}
                          </h3>
                          {isActive && (
                            <span className="font-['Roboto',sans-serif] text-[9px] font-semibold tracking-[0.04em] uppercase px-2 py-[2px] rounded-[4px] shrink-0"
                              style={{ background: s.tagBg, color: s.tagText }}>
                              {s.tag}
                            </span>
                          )}
                        </div>
                        <div className={`transition-all duration-400 overflow-hidden ${isActive ? 'max-h-[600px] opacity-100 mt-1.5 md:mt-2' : 'max-h-0 opacity-0'}`}>
                          <p className="font-inter text-[13px] md:text-[14px] leading-[1.65] text-[#6b6b6b]">
                            {s.desc}
                          </p>
                          {/* Mobile inline illustration */}
                          <div className="lg:hidden mt-3 rounded-[12px] overflow-hidden h-[320px] relative">
                            <s.Illustration active={isActive} />
                          </div>
                        </div>
                      </div>
                      {/* Timer progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: isActive ? `${s.color}15` : 'transparent' }}>
                        <div className="h-full rounded-full" style={{
                          width: isActive && animating ? '100%' : '0%',
                          background: isActive ? s.color : 'transparent',
                          transition: isActive && animating ? `width ${STEP_DURATIONS[activeStep]}ms linear` : 'none',
                        }} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right — illustration (desktop only) */}
            <div className="hidden lg:block relative overflow-hidden lg:min-h-[540px]">
              {STEPS.map((s, i) => (
                <div key={s.num} className="absolute inset-0 transition-all duration-500" style={{
                  opacity: i === activeStep ? 1 : 0,
                  transform: i === activeStep ? 'translateY(0)' : 'translateY(12px)',
                  pointerEvents: i === activeStep ? 'auto' as const : 'none' as const,
                }}>
                  <s.Illustration active={i === activeStep} />
                </div>
              ))}
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* ─────────────────────────── WORKFLOWS ─────────────────────────── */
interface Step { title: string; desc: string; doneAt?: number }
interface Message { role: 'ai' | 'cu'; who: string; text: string; tag?: string; highlight?: boolean; time?: number; blurText?: string }
interface WorkflowPanel {
  badge: string; badgeColor: 'green' | 'orange' | 'red' | 'blue' | 'purple'
  tabName: string; tabNote: string
  h3: string; desc: string; steps: Step[]
  callAvatar: string; callName: string; callInfo: string; callDur: string
  messages: Message[]
}

const WORKFLOWS: WorkflowPanel[] = [
  {
    badge: 'Business Hours', badgeColor: 'green',
    tabName: 'Regular Hour Lead Intake', tabNote: 'New roof inspection booking',
    h3: 'New Lead Intake & Booking',
    desc: "The CSR Agent picks up as your company, identifies what the caller needs, builds their profile, captures the roofing issue, and books the inspection. All on one call.",
    steps: [
      { title: 'Greet & Route',           desc: 'Picks up as your company. Asks if it\'s a new inspection, existing project, or something else.', doneAt: 13000 },
      { title: 'Build the Profile',       desc: 'Collects name and phone. If the caller skips a field, the agent moves on.', doneAt: 52000 },
      { title: 'Confirm the Address',     desc: 'Captures property address, reads it back, and confirms before proceeding.', doneAt: 85000 },
      { title: 'Capture the Issue',       desc: 'Asks what\'s going on with the roof. Logs the damage description and confirms homeowner status.', doneAt: 113000 },
      { title: 'Book the Inspection',     desc: 'Offers a date and time, confirms the appointment, and creates the job in Zuper.', doneAt: 145000 },
    ],
    callAvatar: '🏠', callName: 'John — Maven Roofing Services', callInfo: '3:00 · New Roof Inspection', callDur: '3:00',
    messages: [
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Hi there. You've reached Maven Roofing Services. This is Mavis. I'm here to help you get the support you needed. Are you calling about a new roof inspection, an existing project, or something else today?", time: 2000 },
      { role: 'cu', who: 'John', text: "New roof inspection.", time: 13000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "All right, let's get your profile set up. Can I have your full name, please?", tag: 'Profile', time: 16000 },
      { role: 'cu', who: 'John', text: "It's John Smith.", time: 21000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Thanks, John. Would you like me to use the number you're calling from?", time: 23000 },
      { role: 'cu', who: 'John', text: "Yes, please.", time: 32000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Okay, I'll use that number. Is that right?", time: 34000 },
      { role: 'cu', who: 'John', text: "That's correct.", time: 40000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Great. What's the best email for you?", time: 41000 },
      { role: 'cu', who: 'John', text: "I don't want to give it out right now. I'll just give it to the inspector once he gets there.", time: 45000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "No problem. We can skip the email for now. Let's move on. Could you give me the property address?", time: 52000 },
      { role: 'cu', who: 'John', text: "Yes, that is 25488 US 17.", time: 60000, blurText: '25488 US 17' },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Got it. That's 25488 US 17. Could you also tell me the city and state?", time: 67000, blurText: '25488 US 17' },
      { role: 'cu', who: 'John', text: "That is Hampstead, North Carolina.", time: 74000, blurText: 'Hampstead, North Carolina' },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Thanks. So that's 25488 US 17, Hampstead, North Carolina. Does that sound correct?", tag: 'Address Confirm', time: 78000, blurText: '25488 US 17, Hampstead, North Carolina' },
      { role: 'cu', who: 'John', text: "That is correct.", time: 85000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Great. I've got your address. I'll create your profile now. This will just take a moment. Are you the homeowner or calling on behalf of someone else?", tag: 'Qualifying', time: 87000 },
      { role: 'cu', who: 'John', text: "I am the homeowner.", time: 99000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Thanks for confirming. Could you tell me a bit about the issue with your roof that you'd like us to inspect?", time: 101000 },
      { role: 'cu', who: 'John', text: "I've been noticing some water spots on my living room ceiling.", time: 109000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Got it. Water spots on the living room ceiling. When would be the best date and time for us to send someone out for the inspection?", tag: 'Booking', time: 113000 },
      { role: 'cu', who: 'John', text: "Tomorrow morning.", time: 127000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Thanks. Just to confirm, tomorrow morning April 1st. Did you have a specific time in mind or should we go with the morning window around 9 AM?", time: 128000 },
      { role: 'cu', who: 'John', text: "We can do 9 AM.", time: 137000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Perfect. We'll set the inspection for tomorrow morning at 9 AM. Let me get that set up for you now.", time: 139000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Your roof inspection is all set for tomorrow, April 1st at 9 AM. A professional will come out to check the water spots on your living room ceiling. If you need anything else or want to update details later, just let us know.", tag: 'Confirmed ✓', highlight: true, time: 145000 },
      { role: 'cu', who: 'John', text: "Okay, thank you.", time: 159000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "You're very welcome, John. Have a great day, and we'll see you tomorrow morning at 9 AM. Goodbye.", time: 161000 },
      { role: 'cu', who: 'John', text: "Goodbye.", time: 168000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Goodbye, John. Take care. We'll see you soon.", time: 171000 },
    ],
  },
  {
    badge: 'Existing Customers', badgeColor: 'blue',
    tabName: 'Service queries handled', tabNote: 'Account lookups, scope handling',
    h3: 'Customer Service & Scope Handling',
    desc: "Existing customer calls to check their balance. Then asks about fences. The CSR Agent checks for open invoices, answers accurately, and redirects off-scope requests back to what you cover.",
    steps: [
      { title: 'Recognize the Caller',      desc: 'Identifies them as an existing customer.', doneAt: 11000 },
      { title: 'Check Account Status',       desc: 'Looks up invoices. Confirms no balance owed.', doneAt: 23000 },
      { title: 'Handle Off-Scope Request',   desc: "Caller asks about fences. Agent responds: 'We specialize in roofing. We don't handle fences.'", doneAt: 42000 },
      { title: 'Redirect to Services',       desc: 'Offers to help with anything roofing-related.', doneAt: 46000 },
      { title: 'Close the Call',             desc: 'Wraps up warmly. No time wasted.', doneAt: 55000 },
    ],
    callAvatar: '👤', callName: 'Existing Customer — Maven Roofing', callInfo: '0:59 · Service Query', callDur: '0:59',
    messages: [
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Hi there. You've reached Maven Roofing Services. This is Mavis. I'm here to help you get the support you need. Are you calling about a new roof inspection, an existing project, or something else today?", time: 2000 },
      { role: 'cu', who: 'Caller', text: "Do I owe you anything?", time: 11000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "I can help with that. I don't see any invoices created for you at this time, so it looks like you don't owe anything right now. Is there anything else I can assist you with today?", tag: 'Account Check', time: 14000 },
      { role: 'cu', who: 'Caller', text: "Well, can you guys do my fence?", time: 23000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "We specialize in roofing services: inspections, repairs, replacements, and working with insurance for roof-related issues. We don't handle fences. Is there something related to your roof that you'd like help with?", tag: 'Off-Scope', time: 28000 },
      { role: 'cu', who: 'Caller', text: "Not at the moment, thank you.", time: 42000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "You're welcome. If anything comes up with your roof in the future, feel free to reach out. Have a great day.", time: 46000 },
      { role: 'cu', who: 'Caller', text: "Bye.", time: 53000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Take care and goodbye.", highlight: true, time: 55000 },
    ],
  },
  {
    badge: 'FAQ Handling', badgeColor: 'purple',
    tabName: 'Service scope questions', tabNote: 'Solar, gutters, off-scope queries',
    h3: 'FAQ & Service Scope',
    desc: "Caller asks about solar. Then gutters. The CSR Agent answers both accurately: no to solar, and gutters only as part of a full roof replacement. Stays in your lane and redirects to what you do cover.",
    steps: [
      { title: 'Greet & Route',         desc: 'Picks up as your company. Caller says they have a question.', doneAt: 25000 },
      { title: 'Answer: Solar',         desc: "'We specialize in roofing. We don't offer solar installations.'", doneAt: 62000 },
      { title: 'Answer: Gutters',       desc: "'We don't install gutters as a standalone service. During a roof replacement, we can discuss gutter options.'", doneAt: 92000 },
      { title: 'Offer Roofing Help',    desc: "'If you're having any roofing concerns, I'd be happy to help.'", doneAt: 96000 },
      { title: 'Close the Call',        desc: 'Wraps up. No confusion. No wrong promises.', doneAt: 105000 },
    ],
    callAvatar: '❓', callName: 'John — Maven Roofing Services', callInfo: '1:52 · FAQ Query', callDur: '1:52',
    messages: [
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Hi there, John, you've reached Maven Roofing Services. This is Mavis. I'm here to help you get the support you need. Are you calling about a new roof inspection, an existing project, or something else today?", time: 4000 },
      { role: 'cu', who: 'John', text: "Something else.", time: 17000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Sure, happy to help with that. What do you need help with today?", time: 19000 },
      { role: 'cu', who: 'John', text: "I've got a quick question.", time: 25000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "Of course. What can I answer for you? I'm right here and ready to help. What's your question?", time: 38000 },
      { role: 'cu', who: 'John', text: "Yeah, I just want to know if you guys do solar.", time: 43000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "We specialize in roofing services: inspections, repairs, replacements, and insurance claims. At this time, we don't offer solar installation, but if you need any help with your roof, I'm here to assist. Is there anything else I can help you with today?", tag: 'Solar — No', time: 49000 },
      { role: 'cu', who: 'John', text: "Yeah, how about gutters? Do you install gutters?", time: 62000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "We focus on roofing services, like inspections, repairs, and replacements, and we don't install gutters as a standalone service. However, during a roof replacement, we can certainly discuss gutter options if they're part of the overall project. If you're having any roofing concerns or need an inspection, I'd be happy to help with that. What else can I assist you with?", tag: 'Gutters — Conditional', time: 67000 },
      { role: 'cu', who: 'John', text: "That'll be it for me. Thank you.", time: 92000 },
      { role: 'ai', who: 'Mavis · Maven Roofing Services', text: "You're very welcome. If you ever need help with your roof or have more questions, feel free to reach out. Have a great day.", highlight: true, time: 96000 },
    ],
  },
]

const BADGE_STYLES: Record<string, string> = {
  green:  'bg-[rgba(34,197,94,0.12)] text-[#16A34A]',
  orange: 'bg-[rgba(253,80,0,0.12)] text-[#fd5000]',
  red:    'bg-[rgba(239,68,68,0.12)] text-[#DC2626]',
  blue:   'bg-[rgba(37,99,235,0.12)] text-[#2563EB]',
  purple: 'bg-[rgba(124,58,237,0.12)] text-[#7C3AED]',
}

// Message interval is now dynamic per panel: totalDurMs / totalMsgs

function parseDurMs(dur: string) {
  const [m, s] = dur.split(':').map(Number)
  return (m * 60 + s) * 1000
}

function renderBlurredText(text: string, blurText?: string) {
  if (!blurText) return text
  const parts = text.split(blurText)
  return parts.flatMap((part, i, arr) =>
    i < arr.length - 1
      ? [part, <span key={i} style={{ filter: 'blur(5px)', userSelect: 'none' }}>{blurText}</span>]
      : [part]
  )
}

function renderBlurredTypewriter(text: string, charProgress: number, blurText?: string) {
  if (!blurText) {
    return <>{text.slice(0, charProgress)}<span className="text-[#ccc]">{text.slice(charProgress)}</span></>
  }
  const idx = text.indexOf(blurText)
  if (idx === -1) {
    return <>{text.slice(0, charProgress)}<span className="text-[#ccc]">{text.slice(charProgress)}</span></>
  }
  const blurEnd = idx + blurText.length
  const result: React.ReactNode[] = []
  // Before blur region
  if (charProgress <= idx) {
    result.push(text.slice(0, charProgress))
    result.push(<span key="grey1" className="text-[#ccc]">{text.slice(charProgress, idx)}</span>)
    result.push(<span key="blur" className="text-[#ccc]" style={{ filter: 'blur(5px)', userSelect: 'none' }}>{blurText}</span>)
    result.push(<span key="grey2" className="text-[#ccc]">{text.slice(blurEnd)}</span>)
  } else if (charProgress <= blurEnd) {
    result.push(text.slice(0, idx))
    result.push(<span key="blur" style={{ filter: 'blur(5px)', userSelect: 'none' }}>{blurText}</span>)
    result.push(<span key="grey" className="text-[#ccc]">{text.slice(blurEnd)}</span>)
  } else {
    result.push(text.slice(0, idx))
    result.push(<span key="blur" style={{ filter: 'blur(5px)', userSelect: 'none' }}>{blurText}</span>)
    result.push(text.slice(blurEnd, charProgress))
    result.push(<span key="grey" className="text-[#ccc]">{text.slice(charProgress)}</span>)
  }
  return <>{result}</>
}

function formatMs(ms: number) {
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

function Workflows() {

  const [active, setActive] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const panel = WORKFLOWS[active]

  // Create audio element per tab
  useEffect(() => {
    audioRef.current?.pause()
    const audioSrc = ['/business-hours.mp3', '/q-handling.mp3', '/faq.mp3'][active] || '/roofing-audio-01.mp3'
    audioRef.current = new Audio(audioSrc)
    audioRef.current.preload = 'auto'
    return () => { audioRef.current?.pause(); audioRef.current = null }
  }, [active])

  const totalDurMs = parseDurMs(panel.callDur)
  const totalMsgs = panel.messages.length
  const totalSteps = panel.steps.length
  // If messages have timestamps, use them; otherwise fall back to even spacing
  const hasTimestamps = panel.messages[0]?.time != null
  const visibleMsgs = hasTimestamps
    ? panel.messages.filter(m => m.time != null && m.time <= elapsedMs).length
    : Math.min(totalMsgs, Math.floor(elapsedMs / (totalDurMs / totalMsgs)) + (elapsedMs > 0 ? 1 : 0))
  const ratio = Math.min(1, elapsedMs / totalDurMs)
  const hasStepTimestamps = panel.steps[0]?.doneAt != null
  const checkedCount = hasStepTimestamps
    ? panel.steps.filter(s => s.doneAt != null && s.doneAt <= elapsedMs).length
    : Math.floor(visibleMsgs * totalSteps / totalMsgs)

  // Escape key closes mobile modal
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobileOpen(false); setPlaying(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Reset on tab change
  useEffect(() => {
    setPlaying(false)
    setElapsedMs(0)
    if (tickRef.current) clearInterval(tickRef.current)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
  }, [active])

  // Sync audio with play state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.play().catch(() => {})
      // Sync elapsed time from audio position
      const syncInterval = setInterval(() => {
        if (audio.currentTime) setElapsedMs(Math.floor(audio.currentTime * 1000))
      }, 200)
      return () => clearInterval(syncInterval)
    } else {
      audio.pause()
    }
  }, [playing, active])

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
          if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
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

  const bars = Array.from({ length: 80 }, (_, i) => ({
    h: 18 + Math.abs(Math.sin(i * 0.35) * 28 + Math.sin(i * 0.9) * 18),
    filled: i / 80 < ratio,
  }))

  return (
    <section id="workflows" className="py-20 bg-[#f8f5f0] relative overflow-hidden">
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1320px] mx-auto px-4 md:px-12 relative z-10">

        {/* Header */}
        <RevealOnScroll className="mb-12">
          <SectionTextBg>
            <SectionEyebrow icon="🔁" label="Workflows" />
            <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.035em] mt-4 mb-3">
              Many scenarios.<br /><span className="text-[#fd5000]">One agent.</span>
            </h2>
            <p className="font-inter text-[15px] text-[#7A7A7A] max-w-[480px] leading-[1.7]">
              See exactly how the CSR Agent handles your most critical call types with real sample transcripts.
            </p>
          </SectionTextBg>
        </RevealOnScroll>

        {/* Workflow selector cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {WORKFLOWS.map((wf, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setPlaying(false); setMobileOpen(true) }}
              className="relative text-left rounded-[18px] px-6 py-5 flex flex-col gap-1.5 cursor-pointer"
              style={{
                background: 'white',
                boxShadow: active === i
                  ? '0 8px 28px rgba(0,0,0,0.08), 0 0 0 2px #fd5000'
                  : '0 2px 10px rgba(0,0,0,0.04)',
                transform: active === i ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <span className={`text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full w-fit font-['Roboto',sans-serif] ${BADGE_STYLES[wf.badgeColor]}`}>{wf.badge}</span>
              <span className="font-jakarta text-[14px] font-bold text-[#191919] leading-snug mt-0.5">{wf.tabName}</span>
              <span className="font-inter text-[12px] text-[#ABABAB]">{wf.tabNote}</span>
              {/* Mobile arrow hint */}
              <svg className="md:hidden absolute right-5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>

        <style>{`
          @keyframes playerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
          @keyframes waveSmooth{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}
        `}</style>

        {/* Mobile modal */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => { setMobileOpen(false); setPlaying(false) }}>
            <div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-white rounded-t-[24px] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                <h3 className="font-jakarta font-bold text-[16px] text-[#191919]">{panel.h3}</h3>
                <button aria-label="Close modal" onClick={() => { setMobileOpen(false); setPlaying(false) }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#f5f2ee' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1 px-5 pb-4 overflow-x-auto shrink-0">
                {panel.steps.map((s, si) => {
                  const done = si < checkedCount
                  return (
                    <div key={si} className="flex items-center gap-1 shrink-0">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold"
                        style={done ? { background: '#22c55e', color: 'white' } : { background: '#f0ede8', color: '#6b6b6b' }}>
                        {done ? <Check size={10} strokeWidth={3} color="white" /> : si + 1}
                      </div>
                      <span className="font-inter text-[9px] text-[#6b6b6b] max-w-[60px] truncate">{s.title}</span>
                      {si < panel.steps.length - 1 && <div className="w-3 h-[1px]" style={{ background: '#e0dbd4' }} />}
                    </div>
                  )
                })}
              </div>

              {/* Player */}
              <div className="px-5 py-3 shrink-0" style={{ borderTop: '1px solid #f0ebe3', borderBottom: '1px solid #f0ebe3' }}>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => setPlaying(p => !p)}
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: playing ? '#191919' : '#fd5000', boxShadow: playing ? '0 2px 8px rgba(0,0,0,0.12)' : '0 2px 10px rgba(253,80,0,0.25)' }}
                  >
                    {playing
                      ? <svg width="9" height="9" viewBox="0 0 10 10" fill="white"><rect x="1" y="0" width="3" height="10" rx="1"/><rect x="6" y="0" width="3" height="10" rx="1"/></svg>
                      : <svg width="9" height="11" viewBox="0 0 10 12" fill="white" style={{ marginLeft: 1 }}><path d="M0 0L10 6L0 12Z"/></svg>
                    }
                  </button>
                  <div className="flex-1">
                    <div className="font-inter text-[12px] font-semibold text-[#191919]">{panel.callName}</div>
                    <div className="font-inter text-[10px] text-[#767676]">{panel.callInfo}</div>
                  </div>
                  <span className="font-['Roboto',sans-serif] text-[9px] text-[#6b6b6b] tabular-nums">{formatMs(elapsedMs)} / {panel.callDur}</span>
                </div>
                <div className="flex items-center gap-[1px] h-5">
                  {bars.map((b, bi) => (
                    <div key={bi} className="flex-1 rounded-full" style={{
                      height: `${b.h}%`,
                      background: b.filled ? '#fd5000' : 'rgba(0,0,0,0.08)',
                      transition: 'background 0.2s ease',
                    }} />
                  ))}
                </div>
              </div>

              {/* Transcript */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ minHeight: 0 }}>
                {panel.messages.map((m, mi) => {
                  const isActive = elapsedMs > 0 && mi === visibleMsgs - 1
                  const isPast = elapsedMs > 0 && mi < visibleMsgs - 1
                  return (
                    <div key={mi} className="flex gap-3 transition-opacity duration-500"
                      style={{ opacity: elapsedMs === 0 ? 1 : isPast ? 1 : isActive ? 1 : 0.15 }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5"
                        style={m.role === 'ai' ? { background: 'rgba(253,80,0,0.10)', color: '#c2410c' } : { background: 'rgba(37,99,235,0.10)', color: '#2563eb' }}>
                        {m.role === 'ai' ? 'AI' : m.who.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-inter text-[9px] font-semibold uppercase tracking-[0.08em] mb-0.5 ${m.role === 'ai' ? 'text-[#fd5000]' : 'text-[#ABABAB]'}`}>{m.who}</div>
                        <div className="font-inter text-[12px] leading-[1.6] text-[#5A5A5A]">{renderBlurredText(m.text, m.blurText)}</div>
                        {m.tag && <span className="inline-flex mt-1 font-['Roboto',sans-serif] text-[8px] font-medium px-2 py-[2px] rounded-full" style={{ background: 'rgba(253,80,0,0.08)', color: '#fd5000' }}>{m.tag}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main workflow card — desktop only */}
        <div className="hidden lg:block rounded-[28px] overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-0 overflow-hidden" style={{ minHeight: 580, height: 600, maxHeight: '80vh' }}>

            {/* Left — title + checklist on white bg */}
            <div className="flex flex-col overflow-hidden bg-white p-6">
              <div className="pb-5 shrink-0">
                <h3 className="font-jakarta font-bold text-[#191919] text-[20px] leading-[1.2] tracking-[-0.02em] mb-2">{panel.h3}</h3>
                <p className="font-inter text-[13.5px] text-[#7A7A7A] leading-[1.7]">{panel.desc}</p>
              </div>
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {panel.steps.map((s, i) => {
                  const done = i < checkedCount
                  return (
                    <div key={i} className="flex items-start gap-4 px-5 py-4 rounded-[14px] transition-all" style={{
                      background: done ? '#f0fdf4' : '#fcfbf9',
                      opacity: done ? 1 : elapsedMs === 0 ? 1 : 0.5,
                    }}>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all"
                        style={done
                          ? { background: '#22C55E' }
                          : { background: 'rgba(253,80,0,0.08)', color: '#fd5000' }}
                      >
                        {done
                          ? <Check size={12} strokeWidth={2.5} color="white" />
                          : <span className="font-['Roboto',sans-serif] text-[10px] font-bold tracking-tight">{i + 1}</span>
                        }
                      </div>
                      <div>
                        <strong className={`font-inter block text-[13px] font-semibold mb-0.5 transition-colors ${done ? 'text-[#15803d]' : 'text-[#191919]'}`}>{s.title}</strong>
                        <span className="font-inter text-[12.5px] text-[#7A7A7A] leading-[1.55]">{s.desc}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right — background image with white card inside, bleeds to edges */}
            <div className="overflow-hidden p-6 flex flex-col" style={{
              backgroundImage: 'url(/workflow-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div className="bg-white overflow-hidden flex flex-col flex-1 min-h-0" style={{
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                borderRadius: 18,
              }}>

              {/* Call header with player */}
              <div className="px-5 py-4 shrink-0" style={{ borderBottom: '1px solid #f0ebe3' }}>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => setPlaying(p => !p)}
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      background: playing ? '#191919' : '#fd5000',
                      boxShadow: playing ? '0 2px 8px rgba(0,0,0,0.12)' : '0 2px 10px rgba(253,80,0,0.25)',
                    }}
                  >
                    {playing
                      ? <svg width="9" height="9" viewBox="0 0 10 10" fill="white"><rect x="1" y="0" width="3" height="10" rx="1"/><rect x="6" y="0" width="3" height="10" rx="1"/></svg>
                      : <svg width="9" height="11" viewBox="0 0 10 12" fill="white" style={{ marginLeft: 1 }}><path d="M0 0L10 6L0 12Z"/></svg>
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-inter text-[13px] font-semibold text-[#191919] truncate leading-tight">{panel.callName}</div>
                    <div className="font-inter text-[10px] text-[#BFBFBF] mt-0.5">{panel.callInfo}</div>
                  </div>
                  <span className="font-['Roboto',sans-serif] text-[10px] text-[#6b6b6b] shrink-0 tabular-nums">{formatMs(elapsedMs)} / {panel.callDur}</span>
                </div>
                {/* Waveform */}
                <div className="flex items-center gap-[1px] h-7">
                  {bars.map((b, i) => (
                    <div key={i} className="flex-1 rounded-full"
                      style={{
                        height: `${b.h}%`,
                        background: b.filled ? '#fd5000' : 'rgba(0,0,0,0.08)',
                        transformOrigin: 'bottom',
                        transition: 'background 0.2s ease',
                      }} />
                  ))}
                </div>
              </div>

              {/* Scrollable transcript */}
              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-5 space-y-3" style={{ minHeight: 0 }}>
                {panel.messages.map((m, i) => {
                  const isActive = elapsedMs > 0 && i === visibleMsgs - 1
                  const isPast   = elapsedMs > 0 && i < visibleMsgs - 1
                  const msgDuration = hasTimestamps && i < panel.messages.length - 1 && panel.messages[i + 1].time != null && m.time != null
                    ? panel.messages[i + 1].time! - m.time!
                    : 3000
                  const msgElapsed = isActive && m.time != null ? elapsedMs - m.time : msgDuration
                  const charProgress = isActive ? Math.min(m.text.length, Math.floor((msgElapsed / msgDuration) * m.text.length * 1.5)) : m.text.length
                  return (
                  <div key={i}
                    ref={isActive ? (el) => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }) } : undefined}
                    className="flex gap-3 transition-opacity duration-500"
                    style={{ opacity: elapsedMs === 0 ? 1 : isPast ? 1 : isActive ? 1 : 0.15 }}>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 font-inter"
                      style={m.role === 'ai'
                        ? { background: 'rgba(253,80,0,0.10)', color: '#c2410c' }
                        : { background: 'rgba(37,99,235,0.10)', color: '#2563eb' }}
                    >
                      {m.role === 'ai' ? 'AI' : m.who.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-inter text-[10px] font-semibold uppercase tracking-[0.08em] mb-1 ${m.role === 'ai' ? 'text-[#fd5000]' : 'text-[#ABABAB]'}`}>
                        {m.who}
                      </div>
                      <div className={`font-inter text-[13px] leading-[1.65] ${isActive ? 'text-[#191919]' : m.highlight ? 'text-[#191919] font-medium' : 'text-[#5A5A5A]'}`}>
                        {isActive
                          ? renderBlurredTypewriter(m.text, charProgress, m.blurText)
                          : renderBlurredText(m.text, m.blurText)}
                      </div>
                      {m.tag && (
                        <span className="inline-flex mt-1.5 font-['Roboto',sans-serif] text-[10px] font-medium px-[9px] py-[4px] rounded-full"
                          style={{ background: 'rgba(253,80,0,0.08)', color: '#fd5000' }}>
                          {m.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  )
                })}
              </div>

              </div>{/* close white card */}
            </div>{/* close bg wrapper */}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────── REVENUE MULTIPLIER ─────────────────────────── */
const RM_ITEMS = [
  { Icon: TrendingUp,     title: 'Higher Close Rates',       desc: 'Speed to lead is the #1 driver of close rate in home services. When every call is answered on the first ring, you win the job before your competitor even sees the missed call.', color: '#059669', iconBg: 'rgba(5,150,105,0.10)', iconBorder: 'rgba(5,150,105,0.20)', illusBg: 'linear-gradient(155deg, #f0faf5, #e8f5ee)' },
  { Icon: CloudLightning, title: 'Capacity on Demand',       desc: 'Storm season, emergency leaks, seasonal rushes. When your call volume spikes, the CSR Agent scales with it and handles every call the same way your team would.', color: '#d97706', iconBg: 'rgba(217,119,6,0.10)', iconBorder: 'rgba(217,119,6,0.20)', illusBg: 'linear-gradient(155deg, #fef8ee, #fdf2e0)' },
  { Icon: BarChart2,      title: 'Pipeline Stays Pristine',  desc: 'Every call creates a structured lead record in Zuper. Your team wakes up to a qualified pipeline, not a pile of voicemails to parse.', color: '#2563eb', iconBg: 'rgba(37,99,235,0.10)', iconBorder: 'rgba(37,99,235,0.20)', illusBg: 'linear-gradient(155deg, #f0f5ff, #e8effe)' },
  { Icon: Users,          title: 'Revenue Per CSR',          desc: 'The CSR Agent handles routine intake, booking, and status updates so your team can focus on complex conversations and customer relationships that drive revenue.', color: '#e11d48', iconBg: 'rgba(225,29,72,0.10)', iconBorder: 'rgba(225,29,72,0.20)', illusBg: 'linear-gradient(155deg, #fef2f4, #fde8ec)' },
  { Icon: Zap,            title: 'Fraction of the Cost',     desc: "Adding another CSR to cover nights, weekends, and overflow is expensive. The CSR Agent covers those gaps around the clock, so your team's time goes further.", color: '#4f46e5', iconBg: 'rgba(79,70,229,0.10)', iconBorder: 'rgba(79,70,229,0.20)', illusBg: 'linear-gradient(155deg, #f5f2ff, #eee8fc)' },
  { Icon: Link2,          title: 'One Platform, One Workflow', desc: 'Intake, qualification, booking, and job creation all happen inside Zuper. One system your team already uses. Nothing extra to learn, connect, or pay for.', color: '#7c3aed', iconBg: 'rgba(124,58,237,0.10)', iconBorder: 'rgba(124,58,237,0.20)', illusBg: 'linear-gradient(155deg, #f6f2ff, #f0eafc)' },
]

function RMCardIllustration({ item }: { item: typeof RM_ITEMS[number]; hovered: boolean }) {
  const c = item.color

  const cardStyle: React.CSSProperties = { background: 'white', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }

  // Higher Close Rates — single card with call info + waveform + status
  if (item.title.includes('Close')) return (
    <div className="w-full flex flex-col gap-2">
      <style>{`
        @keyframes closeWave{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
        @keyframes closeRing{0%{transform:scale(0.8);opacity:0.25}100%{transform:scale(1.6);opacity:0}}
        @keyframes closeListen{0%,42%{opacity:1}48%,100%{opacity:0}}
        @keyframes closeCaptured{0%,48%{opacity:0}55%,100%{opacity:1}}
      `}</style>
      <style>{`
        @keyframes closeCardIn{0%,2%{opacity:0;transform:translateY(12px)}8%,85%{opacity:1;transform:translateY(0)}93%,100%{opacity:0;transform:translateY(-5px)}}
        @keyframes closeTagIn{0%,12%{opacity:0;transform:translateY(8px)}18%,85%{opacity:1;transform:translateY(0)}93%,100%{opacity:0;transform:translateY(-5px)}}
        @keyframes closeListenTag{0%,18%{opacity:1}40%,100%{opacity:0}}
        @keyframes closeCapturedTag{0%,40%{opacity:0}50%,85%{opacity:1}93%,100%{opacity:0}}
      `}</style>
      {/* Single compact card — call info + wave inline */}
      <div className="px-2.5 py-2 flex items-center gap-2" style={{ ...cardStyle, animation: 'closeCardIn 5s cubic-bezier(0.4,0,0.2,1) infinite' }}>
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${c}18`, animation: 'closeRing 2.5s ease-out infinite' }} />
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: c }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-5.16-5.16A19.79 19.79 0 013 5.18 2 2 0 015.18 3h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 14.92z"/></svg>
          </div>
        </div>
        <div className="shrink-0">
          <div className="font-inter text-[8px] font-semibold text-[#191919] leading-tight">Isaac</div>
          <div className="font-inter text-[8px] text-[#636363]">Greenville, OH</div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-[0.5px]" style={{ height: 16 }}>
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="rounded-full" style={{
              width: 1.5,
              height: Math.min(3 + Math.abs(Math.sin(i * 0.4) * 8 + Math.cos(i * 0.8) * 5), 16),
              background: `${c}80`,
              transformOrigin: 'center',
              animation: `closeWave ${1.6 + Math.sin(i * 0.2) * 0.5}s cubic-bezier(0.4,0,0.6,1) ${i * 0.025}s infinite`,
            }} />
          ))}
        </div>
        <span className="font-['Roboto',sans-serif] text-[8px] text-[#636363] shrink-0">0:42</span>
      </div>
      {/* Status swap */}
      <div className="relative h-7 flex items-center justify-center" style={{ animation: 'closeTagIn 5s cubic-bezier(0.4,0,0.2,1) infinite' }}>
        <div className="absolute flex items-center gap-1.5 px-3 py-1 rounded-[3px]" style={{ ...cardStyle, animation: 'closeListenTag 5s ease infinite' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
          <span className="font-inter text-[9px] font-medium" style={{ color: c }}>Listening...</span>
        </div>
        <div className="absolute flex items-center gap-1.5 px-3 py-1 rounded-[3px]" style={{ ...cardStyle, animation: 'closeCapturedTag 5s ease infinite' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          <span className="font-inter text-[9px] font-medium" style={{ color: c }}>Lead Captured</span>
        </div>
      </div>
    </div>
  )

  // Fraction of the Cost — user msg → typing → AI reply → fade out → loop
  if (item.title.includes('Fraction')) return (
    <div className="w-full flex flex-col gap-2">
      <style>{`
        @keyframes chatUserIn{0%,2%{opacity:0;transform:translateY(10px)}8%,82%{opacity:1;transform:translateY(0)}92%,100%{opacity:0;transform:translateY(-4px)}}
        @keyframes chatTyping{0%,12%{opacity:0;transform:translateY(8px)}18%,38%{opacity:1;transform:translateY(0)}44%,100%{opacity:0;transform:translateY(0)}}
        @keyframes chatAiIn{0%,42%{opacity:0;transform:translateY(8px)}48%,82%{opacity:1;transform:translateY(0)}92%,100%{opacity:0;transform:translateY(-4px)}}
        @keyframes chatBadgeIn{0%,52%{opacity:0;transform:translateY(6px)}58%,82%{opacity:1;transform:translateY(0)}92%,100%{opacity:0;transform:translateY(-4px)}}
        @keyframes typingDot{0%,80%,100%{opacity:0.25}40%{opacity:0.9}}
      `}</style>
      {/* User message */}
      <div className="flex items-end gap-1.5" style={{ animation: 'chatUserIn 6s cubic-bezier(0.4,0,0.2,1) infinite' }}>
        <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-white" style={{ background: '#555' }}>I</div>
        <div className="px-2.5 py-1.5" style={{ ...cardStyle, borderRadius: '4px 4px 4px 1px' }}>
          <span className="font-inter text-[9px] text-[#666]">I need a roof inspection...</span>
        </div>
      </div>
      {/* Typing indicator */}
      <div className="flex items-end gap-1.5 justify-end" style={{ animation: 'chatTyping 6s cubic-bezier(0.4,0,0.2,1) infinite' }}>
        <div className="px-3 py-2 flex gap-1" style={{ background: `${c}0c`, borderRadius: '4px 4px 1px 4px' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: c, animation: 'typingDot 0.8s ease infinite' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: c, animation: 'typingDot 0.8s ease 0.2s infinite' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: c, animation: 'typingDot 0.8s ease 0.4s infinite' }} />
        </div>
        <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-white" style={{ background: c }}>N</div>
      </div>
      {/* AI response */}
      <div className="flex items-end gap-1.5 justify-end" style={{ animation: 'chatAiIn 6s cubic-bezier(0.4,0,0.2,1) infinite' }}>
        <div className="px-2.5 py-1.5" style={{ background: `${c}0c`, borderRadius: '4px 4px 1px 4px' }}>
          <span className="font-inter text-[9px]" style={{ color: c }}>Let me schedule that right away.</span>
        </div>
        <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-white" style={{ background: c }}>N</div>
      </div>
      {/* Speed badge */}
      <div className="flex justify-end" style={{ animation: 'chatBadgeIn 6s cubic-bezier(0.4,0,0.2,1) infinite' }}>
        <span className="font-['Roboto',sans-serif] text-[8px] px-2 py-0.5" style={{ ...cardStyle, color: c }}>{'<'}2s response</span>
      </div>
    </div>
  )

  // Capacity on Demand — smooth animated surge visualization
  if (item.title.includes('Capacity')) return (
    <div className="w-full flex flex-col gap-2">
      <style>{`
        @keyframes stormPulse{0%,100%{opacity:0.7}50%{opacity:1}}
        @keyframes stormBar{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
        @keyframes stormSurge{0%{transform:scaleY(0.2);opacity:0.3}40%,60%{transform:scaleY(1);opacity:1}100%{transform:scaleY(0.2);opacity:0.3}}
        @keyframes stormCount{0%,15%{opacity:0;transform:translateY(4px)}25%,85%{opacity:1;transform:translateY(0)}95%,100%{opacity:0;transform:translateY(-4px)}}
      `}</style>
      {/* Top row — alert + live counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2 py-1" style={{ ...cardStyle }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: c, animation: 'stormPulse 1.2s ease infinite' }} />
          <span className="font-['Roboto',sans-serif] text-[8px] font-medium" style={{ color: c }}>SURGE</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1" style={cardStyle}>
          <span className="font-['Roboto',sans-serif] text-[9px] font-bold" style={{ color: c, animation: 'stormCount 4s ease infinite' }}>458%</span>
        </div>
      </div>
      {/* Smooth bar chart with surge effect */}
      <div className="flex items-end gap-[2.5px] h-14 px-0.5">
        {[8, 10, 9, 14, 22, 38, 60, 90, 100, 85, 65, 45, 30, 18, 12, 10].map((h, i) => {
          const isSurge = h > 55
          return (
            <div key={i} className="flex-1 rounded-t-[3px]" style={{
              height: `${h}%`,
              background: isSurge
                ? `linear-gradient(to top, ${c}, ${c}88)`
                : `${c}18`,
              transformOrigin: 'bottom',
              animation: isSurge
                ? `stormSurge ${4 + i * 0.1}s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s infinite`
                : `stormBar ${3.5 + i * 0.12}s ease-in-out ${i * 0.06}s infinite`,
              transition: 'height 0.3s ease',
            }} />
          )
        })}
      </div>
      {/* Bottom — active calls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {[c, '#3b82f6', '#8b5cf6'].map((bg, i) => (
              <div key={i} className="w-4 h-4 rounded-full border-[1.5px] border-[#f7f4f0] flex items-center justify-center text-[6px] font-bold text-white" style={{ background: bg }}>{String.fromCharCode(65 + i)}</div>
            ))}
          </div>
          <span className="font-inter text-[8px] text-[#636363]">+9 active</span>
        </div>
      </div>
    </div>
  )

  // Pipeline — mini kanban with staggered card entrance
  if (item.title.includes('Pipeline')) return (
    <div className="w-full flex gap-1.5">
      <style>{`
        @keyframes pipeCardIn{0%,var(--start){opacity:0;transform:translateY(8px)}var(--show),85%{opacity:1;transform:translateY(0)}93%,100%{opacity:0;transform:translateY(-4px)}}
        @keyframes pipeSlide{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes pipeLoop{0%,3%{opacity:0;transform:translateY(8px)}8%,82%{opacity:1;transform:translateY(0)}90%,100%{opacity:0;transform:translateY(-4px)}}
      `}</style>
      {[
        { label: 'New', n: 3, color: c },
        { label: 'Qualified', n: 2, color: '#3b82f6' },
        { label: 'Booked', n: 2, color: '#22c55e' },
      ].map((col, ci) => (
        <div key={ci} className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-[2px]" style={{ background: col.color }} />
            <span className="font-inter text-[8px] font-semibold text-[#636363]">{col.label}</span>
          </div>
          {Array.from({ length: Math.min(col.n, 3) }).map((_, i) => {
            const delay = ci * 0.25 + i * 0.15
            return (
              <div key={i} className="rounded-[3px] p-1.5" style={{
                ...cardStyle,
                borderRadius: 3,
                animation: `pipeLoop 5s cubic-bezier(0.4,0,0.2,1) ${delay}s infinite`,
              }}>
                <div className="h-1 rounded-[1px]" style={{ background: '#e8e5e0', width: `${60 + i * 12}%` }} />
                <div className="h-1 rounded-[1px] mt-0.5" style={{ background: '#f2f0ec', width: `${35 + i * 10}%` }} />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  // Revenue Per CSR — AI vs Team animated comparison
  if (item.title.includes('Revenue')) return (
    <div className="w-full flex flex-col gap-3">
      <style>{`
        @keyframes revBarFill{0%,5%{width:0}25%,80%{width:78%}90%,100%{width:0}}
        @keyframes revTeamFill{0%,5%{width:0}25%,80%{width:22%}90%,100%{width:0}}
        @keyframes revCardIn{0%,8%{opacity:0;transform:translateY(6px)}18%,80%{opacity:1;transform:translateY(0)}90%,100%{opacity:0;transform:translateY(-4px)}}
      `}</style>
      {/* AI bar */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: c }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div className="flex-1 h-3.5 rounded-[2px] overflow-hidden" style={{ background: `${c}12` }}>
          <div className="h-full rounded-[2px]" style={{ background: c, animation: 'revBarFill 5s cubic-bezier(0.4,0,0.2,1) infinite' }} />
        </div>
        <span className="font-['Roboto',sans-serif] text-[8px] font-bold shrink-0" style={{ color: c }}>78%</span>
      </div>
      {/* Team bar */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1 shrink-0">
          {[c, '#3b82f6'].map((bg, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full border border-[#f7f4f0]" style={{ background: bg, opacity: 0.4 }} />
          ))}
        </div>
        <div className="flex-1 h-3.5 rounded-[2px] overflow-hidden" style={{ background: '#e8e4e0' }}>
          <div className="h-full rounded-[2px]" style={{ background: '#a8a4a0', animation: 'revTeamFill 5s cubic-bezier(0.4,0,0.2,1) infinite' }} />
        </div>
        <span className="font-['Roboto',sans-serif] text-[8px] font-bold text-[#767676] shrink-0">22%</span>
      </div>
      {/* Metric cards */}
      <div className="flex gap-1.5">
        {[{ v: '40h', l: 'Saved/wk', icon: '⏱' }, { v: '+23%', l: 'Revenue', icon: '📈' }].map((m, i) => (
          <div key={m.l} className="flex-1 p-1.5 flex items-center gap-1.5 rounded-[3px]" style={{
            ...cardStyle, borderRadius: 3,
            animation: `revCardIn 5s cubic-bezier(0.4,0,0.2,1) ${0.5 + i * 0.2}s infinite`,
          }}>
            <span className="text-[9px]">{m.icon}</span>
            <div>
              <div className="font-['Roboto',sans-serif] text-[9px] font-bold leading-none" style={{ color: c }}>{m.v}</div>
              <div className="font-inter text-[8px] text-[#636363] leading-none mt-0.5">{m.l}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // One Platform, One Workflow — workflow pipeline with staggered reveal
  return (
    <div className="w-full flex flex-col gap-2">
      <style>{`
        @keyframes flowNodeIn{0%,3%{opacity:0;transform:scale(0.8)}8%,85%{opacity:1;transform:scale(1)}93%,100%{opacity:0;transform:scale(0.8)}}
        @keyframes flowLineGrow{0%,5%{transform:scaleX(0)}12%,85%{transform:scaleX(1)}93%,100%{transform:scaleX(0)}}
        @keyframes flowDotTravel{0%{left:-4px;opacity:0}10%{opacity:0.8}50%{opacity:1}90%{opacity:0.8}100%{left:calc(100% - 4px);opacity:0}}
      `}</style>
      {/* Main flow row */}
      <div className="flex items-center w-full">
        {[
          { label: 'Call', color: '#059669', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-5.16-5.16A19.79 19.79 0 013 5.18 2 2 0 015.18 3h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 14.92z"/></svg> },
          { label: 'Qualify', color: '#4f46e5', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
          { label: 'Book', color: '#d97706', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label: 'Pipeline', color: '#2563eb', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
        ].map((step, i) => (
          <div key={i} className="flex items-center" style={{ flex: i < 3 ? '1' : '0 0 auto' }}>
            {/* Node */}
            <div className="flex flex-col items-center gap-1" style={{ animation: `flowNodeIn 6s cubic-bezier(0.4,0,0.2,1) ${i * 0.3}s infinite` }}>
              <div className="w-9 h-9 flex items-center justify-center" style={{ ...cardStyle, borderRadius: 10 }}>
                {step.icon}
              </div>
              <span className="font-inter text-[8px] text-[#636363]">{step.label}</span>
            </div>
            {/* Connector */}
            {i < 3 && (
              <div className="flex-1 mx-1 relative" style={{ height: 8, marginTop: -10 }}>
                {/* Line */}
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] origin-left" style={{
                  background: `${c}20`,
                  animation: `flowLineGrow 6s cubic-bezier(0.4,0,0.2,1) ${i * 0.3 + 0.15}s infinite`,
                  transformOrigin: 'left',
                }} />
                {/* Traveling dot */}
                <div className="absolute top-1/2 -mt-[2.5px] w-[5px] h-[5px] rounded-full" style={{
                  background: c,
                  boxShadow: `0 0 4px ${c}40`,
                  animation: `flowDotTravel ${1.8 + i * 0.1}s cubic-bezier(0.4,0,0.6,1) ${i * 0.3 + 0.4}s infinite`,
                }} />
                {/* Arrow tip */}
                <div className="absolute top-1/2 right-0 -mt-[3px]" style={{
                  width: 0, height: 0,
                  borderTop: '3px solid transparent',
                  borderBottom: '3px solid transparent',
                  borderLeft: `4px solid ${c}30`,
                  animation: `flowNodeIn 6s cubic-bezier(0.4,0,0.2,1) ${i * 0.3 + 0.2}s infinite`,
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Bottom status */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1.5 px-2.5 py-1" style={{ ...cardStyle, animation: `flowNodeIn 6s cubic-bezier(0.4,0,0.2,1) 1.5s infinite` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
          <span className="font-inter text-[8px] font-medium" style={{ color: c }}>One workflow · Zero tools</span>
        </div>
      </div>
    </div>
  )
}

function RMCard({ item, i }: { item: typeof RM_ITEMS[number]; i: number }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <RevealOnScroll delay={(i % 3) * 70} className="h-full">
      <div
        ref={cardRef}
        className="rounded-[20px] cursor-default overflow-hidden h-full flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white',
          boxShadow: hovered
            ? `0 0 0 2px ${item.color}40, 0 0 24px ${item.color}20, 0 8px 24px rgba(0,0,0,0.06)`
            : `0 0 0 1.5px ${item.color}18, 0 1px 4px rgba(0,0,0,0.03)`,
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Title + description on top */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="font-jakarta font-bold text-[16px] text-[#191919] tracking-[-0.01em] mb-2">{item.title}</h3>
          <p className="font-inter text-[13px] text-[#6b6b6b] leading-[1.6]">{item.desc}</p>
        </div>

        {/* Illustration area at bottom — enters from bottom when visible */}
        <div
          className="flex-1 flex items-center justify-center mx-3 mb-3 rounded-[12px] overflow-hidden"
          style={{
            background: item.illusBg,
            padding: '14px 16px',
            minHeight: 145,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + (i % 3) * 0.15}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + (i % 3) * 0.15}s`,
            animationPlayState: visible ? 'running' : 'paused',
          }}
        >
          {visible && <RMCardIllustration item={item} hovered={hovered} />}
        </div>
      </div>
    </RevealOnScroll>
  )
}

function RevenueMultiplier() {


  return (
    <section
      id="impact"
      className="py-20 bg-[#f8f5f0] relative overflow-hidden"
    >
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 relative z-10">
        <RevealOnScroll className="text-center mb-14">
          <SectionTextBg>
            <SectionEyebrow icon="📊" label="Impact" />
            <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
              Results from <span className="text-[#fd5000]">Day One.</span>
            </h2>
            <p className="font-inter text-[15px] text-[#7A7A7A] max-w-[620px] mx-auto leading-[1.7]">
              From the first call it answers, the CSR Agent is already improving your close rates, your pipeline, and your bottom line.
            </p>
          </SectionTextBg>
        </RevealOnScroll>

        {/* Bento grid */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{
          gridTemplateRows: 'auto auto',
        }}>
          {/* Row 1: Large + Small + Small */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"><RMCard item={RM_ITEMS[0]} i={0} /></div>
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[1]} i={1} /></div>
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[2]} i={2} /></div>
          {/* Row 2: Small + Small + Large */}
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[3]} i={3} /></div>
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[4]} i={4} /></div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"><RMCard item={RM_ITEMS[5]} i={5} /></div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────── CASE STUDY ─────────────────────────── */
const CS_STATS = [
  { num: '$440K', label: 'Deal Value Captured During Storm' },
  { num: '95',    label: 'Calls Handled at Peak Demand' },
  { num: '100%',  label: 'Response Rate' },
  { num: '458%',  label: 'Call Surge Absorbed' },
  { num: '21',    label: 'New Jobs Auto-Logged' },
  { num: '30',    label: 'Callbacks Captured' },
]

function SlotNumber({ value, active, delay = 0 }: { value: string; active: boolean; delay?: number }) {
  const [display, setDisplay] = useState(value)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!active) { setStarted(false); setDisplay(value); return }
    const delayTimer = setTimeout(() => {
      setStarted(true)
      const chars = value.split('')
      const digitIndices = chars.map((ch, i) => /[0-9]/.test(ch) ? i : -1).filter(i => i >= 0)
      let settled = 0
      const current = chars.map(ch => /[0-9]/.test(ch) ? '0' : ch)

      // Settle one digit at a time
      const settleNext = () => {
        if (settled >= digitIndices.length) {
          setDisplay(value)
          return
        }
        const idx = digitIndices[settled]
        const target = parseInt(chars[idx])
        let count = 0
        const totalSpins = 8 + Math.floor(Math.random() * 4)

        const spin = setInterval(() => {
          count++
          current[idx] = String(count % 10)
          setDisplay(current.join(''))
          if (count >= totalSpins) {
            clearInterval(spin)
            current[idx] = String(target)
            setDisplay(current.join(''))
            settled++
            setTimeout(settleNext, 80)
          }
        }, 60)
      }
      settleNext()
    }, delay)
    return () => clearTimeout(delayTimer)
  }, [active, value, delay])

  return <span>{started || !active ? display : value.replace(/[0-9]/g, '0')}</span>
}

function CaseStudy() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="case-study" className="py-20 bg-[#f8f5f0] relative overflow-hidden rounded-b-[40px]" style={{ zIndex: 2 }}>
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 relative z-10">

        <RevealOnScroll className="mb-12">
          <SectionTextBg>
            <SectionEyebrow icon="📖" label="Customer Story" />
            <div className="mt-4">
              <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.035em]">
                Proven in a <span className="text-[#fd5000]">real storm surge.</span>
              </h2>
              <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.7] max-w-[520px] mt-3">
                A&A Roofing. December 2025. 458% call surge. Zero missed leads.
              </p>
            </div>
          </SectionTextBg>
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
                    <p className="font-inter font-semibold text-white text-[14px] tracking-[0.02em]">Watch the A&amp;A Roofing Story</p>
                    <p className="font-inter text-[12px] mt-1" style={{ color: '#ABABAB' }}>3 min · Storm Surge Response</p>
                  </div>
                )}
              </div>
              <div ref={statsRef} className="flex border-t border-white/10">
                {CS_STATS.slice(0, 3).map((s, i) => (
                  <div key={s.label} className={`flex-1 px-5 py-5 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                    <div className="font-jakarta font-extrabold text-white text-[24px] leading-none tracking-[-0.04em]">
                      <SlotNumber value={s.num} active={statsVisible} delay={i * 400} />
                    </div>
                    <div className="font-inter text-[10px] mt-1.5 leading-snug" style={{ color: '#9A9A9A' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — light panel */}
            <div className="flex flex-col bg-white">
              <div className="flex-1 px-5 md:px-10 pt-8 md:pt-10 pb-8 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-[#fd5000]" />
                  <span className="font-['Roboto',sans-serif] text-[10.5px] font-medium text-[#ABABAB] uppercase tracking-[0.12em]">
                    A&amp;A Roofing · Storm Surge · Dec 2025
                  </span>
                </div>
                <blockquote className="flex-1" style={{ borderLeft: '3px solid #fd5000', paddingLeft: 20 }}>
                  <span className="font-jakarta font-extrabold text-[#fd5000] text-[52px] leading-[0.6] block mb-3 select-none">"</span>
                  <p className="font-jakarta font-bold text-[#191919] text-[20px] leading-[1.4] tracking-[-0.02em]">
                    When the storm hit, we didn't miss a single call. The AI Agent handled the surge and we captured every opportunity, without adding a single person to the team.
                  </p>
                </blockquote>
                <p className="font-inter text-[13.5px] text-[#7A7A7A] leading-[1.75] mt-6">
                  A major storm struck A&amp;A Roofing's service area in December 2025, a <strong className="text-[#191919] font-semibold">458% spike in inbound calls</strong> with every crew already in the field. Instead of losing leads to voicemail, the AI Agent answered every call, qualified every lead, and logged every job. When crews freed up, the pipeline was full and dispatch was ready.
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
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────── CTA SECTION ─────────────────────────── */
function CTAConfetti({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.parentElement!.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)

    const colors = ['#fff', '#FFD700', '#FF6B35', '#ff3e6c', '#4ade80', '#60a5fa', '#c084fc', '#fbbf24']
    const particles: { x: number; y: number; vx: number; vy: number; w: number; h: number; color: string; rot: number; rotV: number; life: number; opacity: number }[] = []

    // 160 particles — 80 from each side
    for (let i = 0; i < 160; i++) {
      const fromLeft = i < 80
      particles.push({
        x: fromLeft ? rect.width * 0.12 : rect.width * 0.88,
        y: rect.height * 0.55 + (Math.random() - 0.5) * rect.height * 0.2,
        vx: (fromLeft ? 1 : -1) * (2 + Math.random() * 7),
        vy: -5 - Math.random() * 9,
        w: 4 + Math.random() * 6,
        h: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.3,
        life: 1,
        opacity: 1,
      })
    }

    let rafId = 0
    // ~3 seconds at 60fps = ~180 frames, life decrements per frame
    const lifeDecay = 1 / 180

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)
      let alive = false

      for (const p of particles) {
        if (p.life <= 0) continue
        alive = true
        p.vy += 0.15
        p.vx *= 0.988
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotV
        p.life -= lifeDecay
        p.opacity = Math.min(1, p.life * 2.5)

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      if (alive) rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [trigger])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />
}

function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [confettiFired, setConfettiFired] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !confettiFired) {
          setTimeout(() => setConfettiFired(true), 1000)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [confettiFired])

  return (
    <div ref={sectionRef} id="cta" className="relative overflow-hidden text-center pt-52 pb-40 px-6 -mt-10" style={{ background: 'linear-gradient(135deg, #8B1A0A 0%, #C83A14 40%, #fd5000 70%, #F5832B 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 15 }}>
        <CTAConfetti trigger={confettiFired} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,0,0,0.2), transparent)' }} />
      {/* Diagonal line pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E\")", backgroundSize: '40px 40px' }}
      />
      <RevealOnScroll>
        <div className="relative">
          <h2 className="font-jakarta font-extrabold text-white text-[clamp(34px,4.5vw,58px)] leading-[1.1] tracking-[-0.04em] max-w-[680px] mx-auto mb-4">
            Stop losing leads<br />to voicemail.
          </h2>
          <p className="font-inter text-[18px] font-light max-w-[520px] mx-auto mb-11 leading-[1.65]" style={{ color: '#E8E8E8' }}>
            Book a demo and hear the CSR Agent take a real call as your company.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://www.zuper.co/demo" className="font-inter bg-white text-[#fd5000] px-9 py-4 rounded-[12px] text-[15px] font-semibold transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.18)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}>
              Schedule a Demo
            </a>
            <a href="https://www.youtube.com/watch?v=njtFIVu4iAo" target="_blank" rel="noreferrer" className="font-inter text-white px-9 py-4 rounded-[12px] text-[15px] font-semibold transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'transparent' }}>
              See How It Works
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  )
}

/* ─────────────────────────── FOOTER ─────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#1a1a1a]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 py-4 flex items-center justify-between">
        <img src="/zuper-logo.svg" alt="Zuper" className="h-5 w-auto object-contain" />
        <span className="font-inter text-[11px] text-[#666]">© 2026 Zuper Inc. All rights reserved.</span>
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
      <GetStarted />
      {/* <MeetAgents /> */}
      {/* <VoiceLanguages /> */}
      <Workflows />
      <RevenueMultiplier />
      <CaseStudy />
      <CTASection />
      <Footer />
    </div>
  )
}
