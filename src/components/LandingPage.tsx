import { useState, useRef, useEffect } from 'react'
import { ChevronDown, FileText, Calendar, MessageCircle, Radio, HelpCircle, BoltIcon, Check as LucideCheck, ArrowUpRight, BarChart3, UsersRound, CloudRain, Workflow } from 'lucide-react'

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

function SectionEyebrow({ label }: { icon?: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full text-[11px] font-['Space_Mono',monospace] font-medium tracking-[0.06em] uppercase"
      style={{ background: '#fff3ed', color: '#fd5000' }}
    >
      <span className="relative flex items-center justify-center">
        <span className="w-[5px] h-[5px] rounded-full bg-[#fd5000]" />
        <span className="absolute w-[5px] h-[5px] rounded-full bg-[#fd5000] animate-ping opacity-40" />
      </span>
      {label}
    </span>
  )
}

function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" style={{ overflow: 'hidden' }}>
      {/* Vertical left */}
      <div className="absolute top-0 bottom-0" style={{ left: 140, width: 1, background: '#d7d7d7', opacity: 0.5 }} />
      {/* Vertical right */}
      <div className="absolute top-0 bottom-0" style={{ right: 140, width: 1, background: '#d7d7d7', opacity: 0.5 }} />
      {/* Horizontal top */}
      <div className="absolute left-0 right-0" style={{ top: 0, height: 0.5, background: '#d7d7d7', opacity: 0.5 }} />
      {/* Horizontal bottom */}
      <div className="absolute left-0 right-0" style={{ bottom: 0, height: 0.5, background: '#d7d7d7', opacity: 0.5 }} />
    </div>
  )
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
  const navLinks = ['Solutions', 'Industries', 'Resources', 'Company']
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <a href="/" className="flex items-center shrink-0">
          <img src={assets.logo} alt="Zuper" className="h-7 w-auto object-contain object-left" style={{ maxWidth: 110 }} />
        </a>
        <nav className="hidden lg:flex items-center justify-center gap-0.5">
          {navLinks.map((link) => (
            <button key={link} className="flex items-center gap-1 px-4 py-2 font-inter font-medium text-white/85 text-[15px] rounded-[8px] whitespace-nowrap transition-all duration-300 hover:text-white hover:bg-white/[0.06]">
              {link}<ChevronDown size={12} className="opacity-50 mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
            </button>
          ))}
        </nav>
        <span className="lg:hidden" />
        <div className="hidden lg:flex items-center gap-3">
          <button className="text-[#f8f5f1] font-inter font-semibold text-[14px] px-6 py-[11px] rounded-[10px] whitespace-nowrap transition-all duration-300 hover:-translate-y-[1px]"
            style={{ border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'transparent' }}>
            Customer Login
          </button>
          <button className="bg-white text-[#b5271c] font-inter font-semibold text-[14px] px-6 py-[11px] rounded-[10px] whitespace-nowrap transition-all duration-300 hover:-translate-y-[1px]"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.10)'}>
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

// Words for the reading highlight effect
const HERO_WORDS: { word: string; lineBreak?: boolean; stroke?: boolean }[] = [
  { word: 'Every' },
  { word: 'Call', lineBreak: true },
  { word: 'Answered.', lineBreak: true },
  { word: 'Every', stroke: true },
  { word: 'Lead', stroke: true, lineBreak: true },
  { word: 'Captured.', stroke: true },
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
  { speaker: 'Agent', text: 'Hi, this is ZuperAI — how can I help with your roofing inquiry today?' },
  { speaker: 'Caller', text: "Yeah, we had a big hailstorm last night and I think my roof's damaged." },
  { speaker: 'Agent', text: "I'm sorry to hear that. Let me get your details and schedule an inspection right away." },
  { speaker: 'Caller', text: "That'd be great. My name is Marcus, I'm at 412 Oak Street." },
  { speaker: 'Agent', text: "Got it, Marcus. I have a crew available tomorrow at 10 AM. Does that work for you?" },
]

function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const [trigger, setTrigger] = useState(0)
  const [cardsFanned, setCardsFanned] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [activeMsg, setActiveMsg] = useState(-1)
  const [activeWordIdx, setActiveWordIdx] = useState(-1)
  const { activeIndex: activeWord, phase } = useReadingHighlight(HERO_WORDS.length, trigger)

  // Demo playback: cycle through transcript messages with word-by-word highlight
  useEffect(() => {
    if (!playing) return
    let msgIdx = 0
    let wordIdx = -1
    let timeout: ReturnType<typeof setTimeout>
    let timerInterval: ReturnType<typeof setInterval>

    // Elapsed timer
    setElapsed(0)
    timerInterval = setInterval(() => setElapsed(t => t + 1), 1000)

    const nextWord = () => {
      const words = DEMO_TRANSCRIPT[msgIdx].text.split(' ')
      wordIdx++
      if (wordIdx >= words.length) {
        // Move to next message after a pause
        msgIdx++
        wordIdx = -1
        if (msgIdx >= DEMO_TRANSCRIPT.length) {
          // Loop back
          msgIdx = 0
          setActiveMsg(0)
          setActiveWordIdx(-1)
          setElapsed(0)
          timeout = setTimeout(nextWord, 800)
          return
        }
        setActiveMsg(msgIdx)
        setActiveWordIdx(-1)
        timeout = setTimeout(nextWord, 600)
        return
      }
      setActiveWordIdx(wordIdx)
      timeout = setTimeout(nextWord, 80 + Math.random() * 60)
    }

    setActiveMsg(0)
    setActiveWordIdx(-1)
    timeout = setTimeout(nextWord, 400)

    return () => { clearTimeout(timeout); clearInterval(timerInterval) }
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
    <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: '100vh' }}>

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

      {/* Orange tint overlay to dominate */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: '#d95a3a', opacity: 0.55 }} />

      {/* Subtle scrim for bottom legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15 pointer-events-none" />

      <Navbar />

      {/* ── Main content ── */}
      <div
        className="relative z-10 max-w-[1240px] mx-auto px-4 md:px-10 flex flex-col lg:flex-row items-start lg:items-center gap-14 justify-between pt-[100px] md:pt-[160px] pb-[96px]"
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
            <span className="font-['Space_Mono',monospace] text-[10.5px] font-medium text-white tracking-[0.13em] uppercase">
              Calls &amp; Texts · 24/7 · Powered by Zuper AI
            </span>
          </div>

          {/* Headline — reading highlight: all text visible at low opacity, word by word lights up */}
          <h1 className="font-jakarta font-extrabold tracking-[-0.035em] leading-[0.95]" style={{ fontSize: 'clamp(58px, 6.5vw, 96px)' }}>
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

          <p className="font-inter leading-[1.7] mt-6" style={{
            fontSize: 16, maxWidth: 460, color: '#D4D4D4',
            animation: 'smoothFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both',
          }}>
            Your AI-powered CSR handles overflow calls, after-hours inquiries, and storm surge — so your roofing business never loses revenue to voicemail.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mt-9" style={{ animation: 'smoothFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s both' }}>
            <button
              className="font-inter font-semibold text-[15px] text-[#b5271c] px-8 py-[14px] rounded-[12px] transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.18)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
            >
              Schedule a Demo
            </button>
            <button
              className="flex items-center gap-2 font-inter font-semibold text-[15px] text-white px-8 py-[14px] rounded-[12px] transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0L10 6L0 12V0Z"/></svg>
              See How It Works
            </button>
          </div>

          {/* Social proof — #BCBCBC on dark ≈ 7.6:1 ✓ */}
          <div className="flex items-center gap-2.5 mt-7" style={{ animation: 'smoothFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.8s both' }}>
            <div className="flex -space-x-1.5">
              {['/logo-maven.png', '/logo-aa.png', '/logo-bmr.png'].map((src, i) => (
                <img key={i} src={src} alt="" className="w-7 h-7 rounded-full object-cover bg-white border-2 border-white/40" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
              ))}
            </div>
            <p className="font-inter text-[13px]" style={{ color: '#BCBCBC' }}>
              Trusted by <span className="font-semibold text-white">Maven</span>, <span className="font-semibold text-white">A&A</span>, <span className="font-semibold text-white">Brothers Metal</span> & 50+ others
            </p>
          </div>
        </div>

        {/* Right card stack — tilts toward cursor */}
        <div
          className="hidden lg:flex flex-col gap-3 shrink-0 relative"
          style={{ width: 370, perspective: 800 }}
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
              width: 370,
              top: 12,
              bottom: 70,
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
              width: 370,
              top: 12,
              bottom: 70,
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
            className="flex flex-col rounded-[22px] overflow-hidden relative"
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
                <span className="font-inter text-[12px] font-semibold text-white tracking-wide uppercase">AI Agent Demo</span>
              </div>
              {/* #8A8A8A on #0C0806 ≈ 5.1:1 ✓ */}
              <span className="font-['Space_Mono',monospace] text-[11px]" style={{ color: '#8A8A8A' }}>
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
            <div className="flex items-center justify-center px-8 py-3">
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
                    width: 200, height: 200, borderRadius: '50%', objectFit: 'cover',
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
                <p className="font-['Space_Mono',monospace] text-[11px] leading-[1.6]">
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
                <p className="font-['Space_Mono',monospace] text-[11px] leading-[1.6]" style={{ color: '#B0B0B0' }}>
                  <span style={{ color: '#fd7040' }}>Agent</span>{"  "}Hi, this is ZuperAI — how can I help with your roofing inquiry today?
                </p>
              )}
            </div>

            {/* Play / Stop button */}
            <div className="px-4 pb-4">
              <button
                onClick={() => { setPlaying(p => !p); if (playing) { setActiveMsg(-1); setActiveWordIdx(-1); setElapsed(0) } }}
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

          {/* Two small floating stat pills — dark bg for legibility */}
          <div className="grid grid-cols-2 gap-3 relative" style={{ zIndex: 1 }}>
            {[['21', 'Jobs auto-logged'], ['100%', 'Response rate']].map(([v, l]) => (
              <div key={l} className="rounded-[14px] px-4 py-3 flex flex-col gap-0.5"
                style={{ background: 'rgba(12,8,6,0.58)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}>
                <span className="font-jakarta font-extrabold text-white text-[20px] leading-none tracking-[-0.03em]">{v}</span>
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
        <div className="max-w-[1240px] mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
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
    name: 'Emergency Line', tag: 'Storm & Hail Surge',
  },
]

function ChannelBand() {
  return (
    <div className="bg-white border-y border-[#ede8e2] relative">
      <GridLines />
      <div className="max-w-[1240px] mx-auto px-5 md:px-12 py-5 flex items-center justify-center gap-3 flex-wrap">
        <span className="font-['Space_Mono',monospace] text-[10px] tracking-[0.14em] uppercase font-semibold text-[#ABABAB] mr-2 whitespace-nowrap">
          Works Across
        </span>
        {CHANNELS.map((ch) => (
          <div
            key={ch.name}
            className="flex items-center gap-2.5 bg-white rounded-[12px] px-4 py-2.5 transition-all cursor-default"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
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
  { tag: 'Lead Intake',      Icon: ClipboardList, title: 'Intake & Qualification',     desc: 'Captures name, address, damage type, insurance carrier, and urgency — routed straight into your Zuper pipeline.', color: '#fd5000' },
  { tag: 'Scheduling',       Icon: CalendarCheck,  title: 'Appointment Booking',        desc: 'Checks real-time crew availability, offers slots, and confirms inspections with no dispatcher required.', color: '#2563eb' },
  { tag: 'Sales Support',    Icon: MessageSquare,  title: 'Estimation & Quote Queries', desc: 'Answers pricing and scope questions instantly. Flags complex deals for your sales team to own and close.', color: '#059669' },
  { tag: 'Customer Service', Icon: Activity,       title: 'Job Status Updates',         desc: 'Pulls live job data from Zuper and communicates progress, schedule changes, and next steps to homeowners.', color: '#7c3aed' },
  { tag: 'FAQ Handling',     Icon: BookOpen,       title: 'Business & Services FAQ',    desc: 'Handles services, coverage areas, warranties, insurance claims, and financing — consistently, every time.', color: '#d97706' },
  { tag: 'Storm Response',   Icon: Zap,            title: 'Emergency Triage',           desc: 'Identifies storm, hail, and water urgency. Escalates critical cases to on-call crews while capturing full intake.', color: '#e11d48' },
]

// Capabilities scroll constants — visible count only, scroll measured dynamically

function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [colorOpacity, setColorOpacity] = useState(0)
  const [cardTranslate, setCardTranslate] = useState(0)
  const [maxScroll, setMaxScroll] = useState(500)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Dynamically measure overflow
  useEffect(() => {
    const measure = () => {
      const cards = cardsRef.current
      const viewport = viewportRef.current
      if (!cards || !viewport) return
      const overflow = cards.scrollHeight - viewport.clientHeight
      setMaxScroll(Math.max(0, overflow))
    }
    measure()
    requestAnimationFrame(measure)
    const t = setTimeout(measure, 500)
    window.addEventListener('resize', measure)
    return () => { window.removeEventListener('resize', measure); clearTimeout(t) }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const entered = -rect.top
      const clamped = Math.max(0, entered)

      setCardTranslate(Math.min(clamped, maxScroll))

      const opacity = Math.min(1, Math.max(0, clamped / 150))
      setColorOpacity(opacity)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [maxScroll])

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="bg-[#f8f5f0] relative pt-24"
    >
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      {/* Scroll runway: viewport + extra scroll for remaining cards — disabled on mobile */}
      <div className="relative z-10" style={{ height: isMobile ? 'auto' : `calc(100vh + ${maxScroll}px)` }}>
        {/* Sticky container — locks to viewport on desktop, normal flow on mobile */}
        <div className={isMobile ? '' : 'sticky top-0'} style={{ height: isMobile ? 'auto' : '100vh', overflow: 'hidden' }}>
          <div className="max-w-[1240px] mx-auto px-5 md:px-12 h-full flex flex-col" style={{ paddingTop: 48, paddingBottom: 40 }}>

            {/* ── Title ── */}
            <div className="mb-6 shrink-0">
              <SectionTextBg>
                <SectionEyebrow icon="⚡" label="Capabilities" />
                <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4">
                  Not a chatbot.<br />
                  <span className="text-[#fd5000]">A roofing expert.</span>
                </h2>
                <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.75] mt-3">
                  Trained on roofing workflows. Ready to qualify, book, and convert — across calls and text.
                </p>
              </SectionTextBg>
            </div>

            {/* ── Body: image left + cards right ── */}
            <div className="flex gap-8 items-stretch flex-1 min-h-0">

              {/* Left: big image */}
              <div className="hidden lg:block shrink-0" style={{ width: 480 }}>
                <div className="rounded-[24px] overflow-hidden h-full" style={{ position: 'relative', boxShadow: '0 8px 48px rgba(0,0,0,0.13)' }}>
                  <img
                    src={assets.csrAgentDesk}
                    alt="CSR Agent"
                    className="w-full h-full block"
                    style={{ objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.15)' }}
                  />
                  <img
                    src={assets.csrAgentColor}
                    alt=""
                    aria-hidden
                    style={{
                      objectFit: 'cover', objectPosition: 'center top',
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      transform: 'scale(1.15)',
                      opacity: colorOpacity,
                      transition: 'opacity 0.2s ease-out',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-6 pt-14 pb-6"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.50) 50%, transparent 100%)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-[8px] h-[8px] rounded-full bg-[#4ade80] shrink-0" style={{ boxShadow: '0 0 8px #4ade80' }} />
                      <span className="font-['Space_Mono',monospace] text-[11px] font-medium text-white/80 tracking-[0.12em] uppercase">Live · Available 24/7</span>
                    </div>
                    <p className="font-jakarta font-extrabold text-white text-[22px] leading-tight tracking-[-0.02em]">Nova — CSR Agent</p>
                    <p className="font-inter text-[13px] mt-1" style={{ color: '#ddd' }}>Handles calls, texts &amp; storm surge — automatically.</p>
                  </div>
                </div>
              </div>

              {/* Right: cards — clips to ~3 visible, scroll drives translateY */}
              <div ref={viewportRef} className="flex-1 relative overflow-hidden">
                <div
                  ref={cardsRef}
                  className={`flex flex-col gap-4 ${isMobile ? '' : 'absolute left-0 right-0'}`}
                  style={isMobile ? {} : {
                    top: 0,
                    transform: `translateY(-${cardTranslate}px)`,
                    willChange: 'transform',
                  }}
                >
                  {CAPS.map((c, i) => (
                    <div
                      key={c.title}
                      className="group bg-white rounded-[20px] px-7 py-8 flex items-start gap-5 cursor-default"
                      style={{
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget
                        el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.10)'
                        el.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget
                        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
                        el.style.transform = 'translateY(0)'
                      }}
                    >
                      {/* icon */}
                      <div
                        className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0"
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
                          <span className="font-['Space_Mono',monospace] text-[11px] text-[#C8C0B8] font-medium shrink-0 ml-3">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="font-inter text-[14px] text-[#7A7A7A] leading-[1.65] mb-3">{c.desc}</p>
                        <span className="inline-flex items-center font-['Space_Mono',monospace] text-[11px] font-medium px-3 py-[4px] rounded-full"
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
    <div ref={sectionRef} className="snap-section bg-[#f8f5f0] relative">
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
    <div className="snap-section py-24 bg-[#f8f5f0] relative overflow-hidden">
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1120px] mx-auto px-5 md:px-12 relative z-10">
        <RevealOnScroll className="text-center mb-14">
          <SectionEyebrow icon="" label="Voices" />
          <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
            Support 100+ languages with<br /><span className="text-[#fd5000]">localized voice.</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
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
const STEPS: { num: string; title: string; desc: string; tag: string; icon: React.ReactNode; illustration: React.ReactNode }[] = [
  { num: '01', title: 'Agent profile', desc: 'Name your agent, set her personality, and define her expertise areas.', tag: 'Identity',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    illustration: (
      <div className="rounded-[14px] p-4" style={{ background: '#faf8f5' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-bold"
            style={{ background: 'linear-gradient(145deg, #ff7a35, #e04500)', boxShadow: '0 4px 12px rgba(253,80,0,0.2), inset 0 1px 2px rgba(255,255,255,0.2)' }}>N</div>
          <div>
            <div className="font-jakarta font-bold text-[13px] text-[#191919]">Nova</div>
            <div className="font-inter text-[10px] text-[#bbb]">CSR Agent · Roofing</div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[10px] p-3" style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between">
            <span className="font-inter text-[10px] text-[#999]">Personality</span>
            <div className="flex gap-1">{['Friendly', 'Professional'].map(t => <span key={t} className="text-[8px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#fff3ed', color: '#fd5000' }}>{t}</span>)}</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-inter text-[10px] text-[#999]">Voice</span>
            <span className="font-inter text-[10px] font-medium text-[#191919]">Female · English</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-inter text-[10px] text-[#999]">Tone</span>
            <span className="font-inter text-[10px] font-medium text-[#191919]">Warm & helpful</span>
          </div>
        </div>
      </div>
    ),
  },
  { num: '02', title: 'Superpowers', desc: 'Toggle capabilities — answer calls, take bookings, share updates, reschedule.', tag: 'Capabilities',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    illustration: (
      <div className="rounded-[14px] p-4" style={{ background: '#faf8f5' }}>
        <div className="flex flex-col gap-3 rounded-[10px] p-3" style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          {[
            { label: 'Answer calls', on: true, icon: '📞' },
            { label: 'Book inspections', on: true, icon: '📅' },
            { label: 'Share updates', on: true, icon: '📊' },
            { label: 'Reschedule', on: false, icon: '🔄' },
          ].map(cap => (
            <div key={cap.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px]">{cap.icon}</span>
                <span className="font-inter text-[11px] text-[#555]">{cap.label}</span>
              </div>
              <div className="w-8 h-[18px] rounded-full flex items-center px-[3px] transition-all" style={{ background: cap.on ? '#fd5000' : '#e5e0d8' }}>
                <div className="w-3 h-3 rounded-full bg-white" style={{ marginLeft: cap.on ? 12 : 0, transition: 'margin 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  { num: '03', title: 'Knowledge base', desc: 'Upload your docs, FAQs, and SOPs. Nova learns your business in minutes.', tag: 'Intelligence',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    illustration: (
      <div className="rounded-[14px] p-4" style={{ background: '#faf8f5' }}>
        <div className="flex flex-col gap-2.5">
          {[
            { name: 'Service_FAQ.pdf', size: '2.4 MB', done: true },
            { name: 'Pricing_Guide.pdf', size: '1.1 MB', done: true },
            { name: 'Company_SOPs.doc', size: '840 KB', done: false },
          ].map(f => (
            <div key={f.name} className="flex items-center gap-3 rounded-[10px] p-2.5" style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: f.done ? '#f0fdf4' : '#fff7ed' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.done ? '#22c55e' : '#fd5000'} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-inter text-[11px] font-medium text-[#191919] truncate">{f.name}</div>
                <div className="font-inter text-[9px] text-[#bbb]">{f.size}</div>
              </div>
              {f.done ? (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#fd5000] border-t-transparent animate-spin" />
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  { num: '04', title: 'Add to route', desc: 'Connect your phone lines and channels. Nova starts answering immediately.', tag: 'Deployment',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
    illustration: (
      <div className="rounded-[14px] p-4" style={{ background: '#faf8f5' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" style={{ boxShadow: '0 0 8px #22c55e' }} />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping opacity-30" />
            </div>
            <span className="font-['Space_Mono',monospace] text-[10px] text-[#22c55e] font-medium">LIVE</span>
          </div>
          <span className="font-inter text-[9px] text-[#bbb]">Just now</span>
        </div>
        <div className="flex flex-col gap-2 rounded-[10px] p-3" style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          {[
            { ch: '📞', label: 'Main Line', status: 'Connected', color: '#22c55e' },
            { ch: '💬', label: 'SMS', status: 'Connected', color: '#22c55e' },
            { ch: '🌐', label: 'Web Chat', status: 'Ready', color: '#d97706' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px]">{r.ch}</span>
                <span className="font-inter text-[11px] text-[#555]">{r.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
                <span className="font-inter text-[9px] font-medium" style={{ color: r.color }}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

function GetStarted() {
  return (
    <section className="py-24 bg-[#f8f5f0] relative overflow-hidden">
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[960px] mx-auto px-5 md:px-12 relative z-10">
        <RevealOnScroll className="text-center mb-16">
          <SectionTextBg>
            <SectionEyebrow icon="" label="Get Started" />
            <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
              Go live in under<br /><span className="text-[#fd5000]">10 minutes.</span>
            </h2>
            <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.7] max-w-[440px] mx-auto mt-3">
              Four steps. No engineering team required. Nova configures herself around your business.
            </p>
          </SectionTextBg>
        </RevealOnScroll>

        {/* Vertical timeline — alternating sides */}
        <div className="relative">
          {/* Center vertical line — hidden on mobile */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] rounded-full hidden md:block" style={{ background: '#e8e3dc' }} />

          {STEPS.map((step, i) => {
            const isLeft = i % 2 === 0
            return (
              <RevealOnScroll key={step.num} delay={i * 120}>
                {/* Mobile: stacked single column */}
                <div className="md:hidden flex flex-col items-center mb-12 last:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0"
                      style={{
                        background: 'linear-gradient(145deg, #ff7a35, #e04500)',
                        boxShadow: '0 6px 16px rgba(253,80,0,0.25)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                      {step.icon}
                    </div>
                    <span className="font-jakarta font-extrabold text-[11px] text-[#ccc] tracking-[0.04em]">{step.num}</span>
                  </div>
                  <div className="w-full max-w-[400px] rounded-[20px] overflow-hidden"
                    style={{ background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
                    <div className="px-6 pt-6 pb-4">
                      <span className="inline-block font-['Space_Mono',monospace] text-[9px] font-medium tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-[4px] mb-3"
                        style={{ background: '#fff3ed', color: '#fd5000' }}>
                        {step.tag}
                      </span>
                      <h3 className="font-jakarta font-bold text-[18px] text-[#191919] mb-2">{step.title}</h3>
                      <p className="font-inter text-[13.5px] text-[#999] leading-[1.65]">{step.desc}</p>
                    </div>
                    <div className="px-4 pb-4">{step.illustration}</div>
                  </div>
                </div>

                {/* Desktop: alternating timeline */}
                <div className="hidden md:flex relative items-start mb-20 last:mb-0" style={{ minHeight: 120 }}>

                  {/* Left content or spacer */}
                  <div className="w-1/2 pr-12 flex justify-end">
                    {isLeft && (
                      <div className="max-w-[360px] rounded-[20px] p-0 transition-all duration-400 text-right overflow-hidden"
                        style={{ background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05)' }}
                      >
                        <div className="px-6 pt-6 pb-4">
                          <span className="inline-block font-['Space_Mono',monospace] text-[9px] font-medium tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-[4px] mb-3"
                            style={{ background: '#fff3ed', color: '#fd5000' }}>
                            {step.tag}
                          </span>
                          <h3 className="font-jakarta font-bold text-[18px] text-[#191919] mb-2">{step.title}</h3>
                          <p className="font-inter text-[13.5px] text-[#999] leading-[1.65]">{step.desc}</p>
                        </div>
                        <div className="px-4 pb-4">{step.illustration}</div>
                      </div>
                    )}
                  </div>

                  {/* Center node */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-white transition-all duration-400"
                      style={{
                        background: 'linear-gradient(145deg, #ff7a35, #e04500)',
                        boxShadow: '0 8px 20px rgba(253,80,0,0.25), inset 0 2px 3px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(253,80,0,0.3), inset 0 2px 3px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(253,80,0,0.25), inset 0 2px 3px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.12)' }}
                    >
                      {step.icon}
                    </div>
                    {/* Step number below node */}
                    <div className="text-center mt-2">
                      <span className="font-jakarta font-extrabold text-[11px] text-[#ccc] tracking-[0.04em]">{step.num}</span>
                    </div>
                  </div>

                  {/* Right content or spacer */}
                  <div className="w-1/2 pl-12">
                    {!isLeft && (
                      <div className="max-w-[360px] rounded-[20px] p-0 transition-all duration-400 overflow-hidden"
                        style={{ background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05)' }}
                      >
                        <div className="px-6 pt-6 pb-4">
                          <span className="inline-block font-['Space_Mono',monospace] text-[9px] font-medium tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-[4px] mb-3"
                            style={{ background: '#fff3ed', color: '#fd5000' }}>
                            {step.tag}
                          </span>
                          <h3 className="font-jakarta font-bold text-[18px] text-[#191919] mb-2">{step.title}</h3>
                          <p className="font-inter text-[13.5px] text-[#999] leading-[1.65]">{step.desc}</p>
                        </div>
                        <div className="px-4 pb-4">{step.illustration}</div>
                      </div>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── WORKFLOWS ─────────────────────────── */
interface Step { title: string; desc: string; doneAt?: number }
interface Message { role: 'ai' | 'cu'; who: string; text: string; tag?: string; highlight?: boolean; time?: number }
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
    tabName: 'Regular Hour Lead Intake', tabNote: 'New roof inspection booking',
    h3: 'Full Roof Replacement Intake',
    desc: "Nova handles the full intake — greets Isaac, confirms the address, qualifies the job type, and books the inspection. No hold music, no voicemail, no missed opportunity.",
    steps: [
      { title: 'Instant Pickup',       desc: 'Greets Isaac by name within 2 seconds as Brothers Metal Roofing.', doneAt: 6000 },
      { title: 'Identify Intent',      desc: 'Determines Isaac is calling about a new roof inspection.', doneAt: 15000 },
      { title: 'Confirm Address',      desc: 'Verifies property at 5265 Sebring-Warner Road, Greenville, Ohio 45331.', doneAt: 28000 },
      { title: 'Qualify the Job',      desc: 'Confirms homeowner status and that it\'s a full roof replacement.', doneAt: 76000 },
      { title: 'Book the Inspection',  desc: 'Schedules Monday, November 24th at 3 PM and confirms.', doneAt: 107000 },
    ],
    callAvatar: '🏠', callName: 'Isaac — Brothers Metal Roofing', callInfo: 'Today · 2:34 PM · New Roof Inspection', callDur: '2:18',
    messages: [
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Hi there, Isaac. You've reached Brothers Metal Roofing. This is Nova. I'm here to help you get the support you need.", time: 2000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Are you calling about a new roof inspection, an existing project, or something else today?", time: 9000 },
      { role: 'cu', who: 'Isaac', text: "New roof inspection.", time: 15000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "I have your property address as 5265 Sebring-Warner Road, Greenville, Ohio 45331. Should we use this for your booking?", tag: 'Address Confirm', time: 17000 },
      { role: 'cu', who: 'Isaac', text: "Yes, that's correct.", time: 28000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Are you the homeowner?", time: 29000 },
      { role: 'cu', who: 'Isaac', text: "Yes.", time: 32000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Thanks for confirming. Just to clarify, are you the homeowner of the property?", tag: 'Qualifying', time: 34000 },
      { role: 'cu', who: 'Isaac', text: "Yes.", time: 40000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Great. And could you tell me a bit about the issue you'd like us to inspect? For example, is it a leak, damage, or something else?", time: 41000 },
      { role: 'cu', who: 'Isaac', text: "Um, I want a new roof.", time: 55000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Understood. You're looking to get a new roof. Could you share a bit more detail? For example, are there specific concerns like old shingles, storm damage, or is it just time for a full replacement?", time: 59000 },
      { role: 'cu', who: 'Isaac', text: "It's time for a full replacement.", time: 76000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Thanks for that. When would be the best date and time for us to come out and do the inspection?", tag: 'Booking', time: 79000 },
      { role: 'cu', who: 'Isaac', text: "Um, Monday afternoon at approximately 3 o'clock.", time: 89000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Got it. Monday afternoon at around 3 o'clock. That would be November 24th. Does that sound right to you?", time: 95000 },
      { role: 'cu', who: 'Isaac', text: "Yes.", time: 101000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "All right, let me get that set up for you now. This will just take a moment.", time: 102000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Your roof inspection is all set for Monday, November 24th at 3 PM. We'll see you then for the full roof replacement inspection.", tag: 'Confirmed ✓', highlight: true, time: 107000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "If anything changes or you need more help, just let me know.", time: 115000 },
      { role: 'cu', who: 'Isaac', text: "All right, thank you.", time: 120000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "You're very welcome. We look forward to helping you with your new roof. Have a great day, Isaac.", time: 123000 },
      { role: 'cu', who: 'Isaac', text: "Thank you.", time: 129000 },
      { role: 'ai', who: 'Nova · Brothers Metal Roofing', text: "Take care, Isaac. If you need anything else, just reach out. Bye for now.", time: 131000 },
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

// Message interval is now dynamic per panel: totalDurMs / totalMsgs

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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const panel = WORKFLOWS[active]

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio('/roofing-audio-01.mp3')
    audioRef.current.preload = 'auto'
    return () => { audioRef.current?.pause(); audioRef.current = null }
  }, [])

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

  // Reset on tab change
  useEffect(() => {
    setPlaying(false)
    setElapsedMs(0)
    if (tickRef.current) clearInterval(tickRef.current)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
  }, [active])

  // Sync audio with play state (only on tab 0 — Isaac)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing && active === 0) {
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

  const bars = Array.from({ length: 52 }, (_, i) => ({
    h: 18 + Math.abs(Math.sin(i * 0.45) * 28 + Math.sin(i * 1.2) * 18),
    filled: i / 52 < ratio,
  }))

  return (
    <section id="workflows" className="py-24 bg-[#f8f5f0] relative overflow-hidden">
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1320px] mx-auto px-4 md:px-12 relative z-10">

        {/* Header */}
        <RevealOnScroll className="mb-12">
          <SectionTextBg>
            <SectionEyebrow icon="🔁" label="Workflows" />
            <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.035em] mt-4 mb-3">
              Three scenarios.<br /><span className="text-[#fd5000]">One agent.</span>
            </h2>
            <p className="font-inter text-[15px] text-[#7A7A7A] max-w-[480px] leading-[1.7]">
              See exactly how the CSR Agent handles your most critical call types — with real sample transcripts.
            </p>
          </SectionTextBg>
        </RevealOnScroll>

        {/* Outer card */}
        {/* Workflow selector cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {WORKFLOWS.map((wf, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setPlaying(false) }}
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
              <span className={`text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full w-fit font-['Space_Mono',monospace] ${BADGE_STYLES[wf.badgeColor]}`}>{wf.badge}</span>
              <span className="font-inter text-[14px] font-bold text-[#191919] leading-snug mt-0.5">{wf.tabName}</span>
              <span className="font-inter text-[12px] text-[#ABABAB]">{wf.tabNote}</span>
            </button>
          ))}
        </div>

        <style>{`
          @keyframes playerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
          @keyframes waveSmooth{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}
        `}</style>

        {/* Main workflow card */}
        <div className="bg-white rounded-[24px] overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <style>{`
            @keyframes playerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
            @keyframes waveSmooth{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}
          `}</style>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px]" style={{ minHeight: 580 }}>

            {/* Left — steps */}
            <div className="flex flex-col overflow-hidden">
              <div className="px-8 pt-8 pb-6 shrink-0" style={{ borderBottom: '1px solid #f0ebe3' }}>
                <h3 className="font-jakarta font-bold text-[#191919] text-[20px] leading-[1.2] tracking-[-0.02em] mb-2">{panel.h3}</h3>
                <p className="font-inter text-[13.5px] text-[#7A7A7A] leading-[1.7]">{panel.desc}</p>
              </div>
              <ul className="divide-y divide-[#f5f0ea]">
                {panel.steps.map((s, i) => {
                  const done = i < checkedCount
                  return (
                    <li key={i} className="flex items-start gap-4 px-8 py-5 transition-opacity" style={{ opacity: done ? 1 : elapsedMs === 0 ? 1 : 0.45 }}>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all"
                        style={done
                          ? { background: '#22C55E' }
                          : { background: 'rgba(253,80,0,0.08)', color: '#fd5000' }}
                      >
                        {done
                          ? <Check size={12} strokeWidth={2.5} color="white" />
                          : <span className="font-['Space_Mono',monospace] text-[10px] font-bold tracking-tight">{i + 1}</span>
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

            {/* Right — call card */}
            <div className="relative flex flex-col overflow-hidden" style={{ background: '#faf7f4', borderLeft: '1px solid #f0ebe3' }}>

              {/* Call header with player */}
              <div className="px-5 py-4 bg-white shrink-0" style={{ borderBottom: '1px solid #f0ebe3' }}>
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
                  <span className="font-['Space_Mono',monospace] text-[10px] text-[#999] shrink-0 tabular-nums">{formatMs(elapsedMs)} / {panel.callDur}</span>
                </div>
                {/* Waveform */}
                <div className="flex items-center gap-[2px] h-7">
                  {bars.map((b, i) => (
                    <div key={i} className="flex-1 rounded-full"
                      style={{
                        height: `${b.h}%`,
                        background: b.filled ? (playing ? '#fd5000' : 'rgba(253,80,0,0.4)') : 'rgba(0,0,0,0.05)',
                        transformOrigin: 'bottom',
                        animation: playing && b.filled ? `waveSmooth ${2.5 + Math.sin(i * 0.3) * 1}s ease-in-out ${i * 0.08}s infinite` : 'none',
                        transition: 'background 0.3s ease',
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
                        ? { background: 'rgba(253,80,0,0.10)', color: '#fd5000' }
                        : { background: '#f0ede8', color: '#888' }}
                    >
                      {m.role === 'ai' ? 'AI' : 'CU'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-inter text-[10px] font-semibold uppercase tracking-[0.08em] mb-1 ${m.role === 'ai' ? 'text-[#fd5000]' : 'text-[#ABABAB]'}`}>
                        {m.who}
                      </div>
                      <div className={`font-inter text-[13px] leading-[1.65] ${isActive ? 'text-[#191919]' : m.highlight ? 'text-[#191919] font-medium' : 'text-[#5A5A5A]'}`}>
                        {isActive ? (
                          <>{m.text.slice(0, charProgress)}<span className="text-[#ccc]">{m.text.slice(charProgress)}</span></>
                        ) : m.text}
                      </div>
                      {m.tag && (
                        <span className="inline-flex mt-1.5 font-['Space_Mono',monospace] text-[10px] font-medium px-[9px] py-[4px] rounded-full"
                          style={{ background: 'rgba(253,80,0,0.08)', color: '#fd5000' }}>
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
  { Icon: TrendingUp,     title: 'Higher Close Rates',       desc: 'Answer instantly while homeowner intent is at its peak. Never lose a warm lead to a competitor who picked up faster.', color: '#059669', iconBg: 'rgba(5,150,105,0.10)', iconBorder: 'rgba(5,150,105,0.20)' },
  { Icon: Zap,            title: 'Shorter Response Windows', desc: "Speed-to-contact is the #1 driver of close rate in home services. You'll always be the fastest response — regardless of time of day.", color: '#4f46e5', iconBg: 'rgba(79,70,229,0.10)', iconBorder: 'rgba(79,70,229,0.20)' },
  { Icon: CloudLightning, title: 'Storm Surge Readiness',    desc: 'When hail hits your market, volume spikes 10x overnight. Scale instantly with no overtime, hiring chaos, or capacity limits.', color: '#d97706', iconBg: 'rgba(217,119,6,0.10)', iconBorder: 'rgba(217,119,6,0.20)' },
  { Icon: BarChart2,      title: 'Pipeline Stays Pristine',  desc: 'Every call creates a structured lead record in Zuper. Your team wakes up to a qualified pipeline — not a pile of voicemails to parse.', color: '#2563eb', iconBg: 'rgba(37,99,235,0.10)', iconBorder: 'rgba(37,99,235,0.20)' },
  { Icon: Users,          title: 'Revenue Per CSR',          desc: 'Your team handles complex conversations and customer relationships. Routine intake and booking handled automatically.', color: '#e11d48', iconBg: 'rgba(225,29,72,0.10)', iconBorder: 'rgba(225,29,72,0.20)' },
  { Icon: Link2,          title: 'Zero Tool Sprawl',         desc: 'Intake, qualification, booking, and pipeline updates all live in one connected Zuper workflow. No third-party glue required.', color: '#7c3aed', iconBg: 'rgba(124,58,237,0.10)', iconBorder: 'rgba(124,58,237,0.20)' },
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
          <div className="font-inter text-[7px] text-[#bbb]">Greenville, OH</div>
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
        <span className="font-['Space_Mono',monospace] text-[7px] text-[#ccc] shrink-0">0:42</span>
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

  // Shorter Response — user msg → typing → AI reply → fade out → loop
  if (item.title.includes('Response')) return (
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
        <span className="font-['Space_Mono',monospace] text-[8px] px-2 py-0.5" style={{ ...cardStyle, color: c }}>{'<'}2s response</span>
      </div>
    </div>
  )

  // Storm Surge — smooth animated surge visualization
  if (item.title.includes('Storm')) return (
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
          <span className="font-['Space_Mono',monospace] text-[8px] font-medium" style={{ color: c }}>SURGE</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1" style={cardStyle}>
          <span className="font-['Space_Mono',monospace] text-[9px] font-bold" style={{ color: c, animation: 'stormCount 4s ease infinite' }}>458%</span>
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
          <span className="font-inter text-[7px] text-[#bbb]">+9 active</span>
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
            <span className="font-inter text-[7px] font-semibold text-[#aaa]">{col.label}</span>
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
        <div className="flex-1 h-3.5 rounded-[2px] overflow-hidden" style={{ background: '#eee' }}>
          <div className="h-full rounded-[2px]" style={{ background: c, animation: 'revBarFill 5s cubic-bezier(0.4,0,0.2,1) infinite' }} />
        </div>
        <span className="font-['Space_Mono',monospace] text-[8px] font-bold shrink-0" style={{ color: c }}>78%</span>
      </div>
      {/* Team bar */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1 shrink-0">
          {[c, '#3b82f6'].map((bg, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full border border-[#f7f4f0]" style={{ background: bg, opacity: 0.4 }} />
          ))}
        </div>
        <div className="flex-1 h-3.5 rounded-[2px] overflow-hidden" style={{ background: '#eee' }}>
          <div className="h-full rounded-[2px]" style={{ background: '#bbb', animation: 'revTeamFill 5s cubic-bezier(0.4,0,0.2,1) infinite' }} />
        </div>
        <span className="font-['Space_Mono',monospace] text-[8px] font-bold text-[#bbb] shrink-0">22%</span>
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
              <div className="font-['Space_Mono',monospace] text-[9px] font-bold leading-none" style={{ color: c }}>{m.v}</div>
              <div className="font-inter text-[6px] text-[#bbb] leading-none mt-0.5">{m.l}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Zero Tool Sprawl — workflow pipeline with staggered reveal
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
              <span className="font-inter text-[7px] text-[#aaa]">{step.label}</span>
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
          boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.05)',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Title + description on top */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="font-jakarta font-bold text-[16px] text-[#191919] tracking-[-0.01em] mb-2">{item.title}</h3>
          <p className="font-inter text-[13px] text-[#999] leading-[1.6]">{item.desc}</p>
        </div>

        {/* Illustration area at bottom — enters from bottom when visible */}
        <div
          className="flex-1 flex items-center justify-center mx-3 mb-3 rounded-[12px] overflow-hidden"
          style={{
            background: '#f7f4f0',
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
      className="py-24 bg-[#f8f5f0] relative overflow-hidden"
    >
      <DotGrid {...DOT_GRID_PROPS} />
      <GridLines />
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 relative z-10">
        <RevealOnScroll className="text-center mb-14">
          <SectionTextBg>
            <SectionEyebrow icon="📊" label="Impact" />
            <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
              From Feature to <span className="text-[#fd5000]">Revenue Multiplier</span>
            </h2>
            <p className="font-inter text-[17px] font-light text-[#5A5A5A] max-w-[520px] mx-auto leading-[1.7]">
              The CSR Agent isn't just a feature — it's a measurable lift across your most critical business metrics.
            </p>
          </SectionTextBg>
        </RevealOnScroll>

        {/* Bento grid */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{
          gridTemplateRows: 'auto auto',
        }}>
          {/* Row 1: Large + Small + Small */}
          <div className="col-span-1 lg:col-span-2 row-span-1"><RMCard item={RM_ITEMS[0]} i={0} /></div>
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[1]} i={1} /></div>
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[2]} i={2} /></div>
          {/* Row 2: Small + Small + Large */}
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[3]} i={3} /></div>
          <div className="col-span-1 row-span-1"><RMCard item={RM_ITEMS[4]} i={4} /></div>
          <div className="col-span-1 lg:col-span-2 row-span-1"><RMCard item={RM_ITEMS[5]} i={5} /></div>
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
    <section id="case-study" className="py-24 bg-[#f8f5f0] relative overflow-hidden">
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
                    <p className="font-inter font-semibold text-white text-[14px] tracking-[0.02em]">Watch the A&A Roofing Story</p>
                    <p className="font-inter text-[12px] mt-1" style={{ color: '#ABABAB' }}>3 min · Storm Surge Response</p>
                  </div>
                )}
              </div>
              <div className="flex border-t border-white/10">
                {CS_STATS.slice(0, 3).map((s, i) => (
                  <div key={s.label} className={`flex-1 px-5 py-5 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                    <div className="font-jakarta font-extrabold text-white text-[24px] leading-none tracking-[-0.04em]">{s.num}</div>
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
                  <span className="font-['Space_Mono',monospace] text-[10.5px] font-medium text-[#ABABAB] uppercase tracking-[0.12em]">
                    A&amp;A Roofing · Storm Surge · Dec 2025
                  </span>
                </div>
                <blockquote className="flex-1" style={{ borderLeft: '3px solid #fd5000', paddingLeft: 20 }}>
                  <span className="font-jakarta font-extrabold text-[#fd5000] text-[52px] leading-[0.6] block mb-3 select-none" style={{ fontFamily: 'Georgia, serif' }}>"</span>
                  <p className="font-jakarta font-bold text-[#191919] text-[20px] leading-[1.4] tracking-[-0.02em]">
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
    <div id="cta" className="snap-section relative overflow-hidden text-center py-24 px-6" style={{ background: 'linear-gradient(135deg, #8B1A0A 0%, #C83A14 40%, #fd5000 70%, #F5832B 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,0,0,0.2), transparent)' }} />
      {/* Diagonal line pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E\")", backgroundSize: '40px 40px' }}
      />
      <RevealOnScroll>
        <div className="relative">
          <h2 className="font-jakarta font-extrabold text-white text-[clamp(34px,4.5vw,58px)] leading-[1.1] tracking-[-0.04em] max-w-[680px] mx-auto mb-4">
            Ready to never miss<br />another lead?
          </h2>
          <p className="text-[18px] font-light max-w-[480px] mx-auto mb-11 leading-[1.65]" style={{ color: '#E8E8E8' }}>
            See Nova handle a live workflow customized with your company name, services, and real availability.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://www.zuper.co/demo" className="bg-white text-[#fd5000] px-9 py-4 rounded-[12px] text-[15px] font-semibold transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.18)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}>
              Schedule a Demo
            </a>
            <a href="#workflows" className="text-white px-9 py-4 rounded-[12px] text-[15px] font-semibold transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0"
              style={{ border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'transparent' }}>
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
  const productLinks = ['CSR Agent', 'Workflows', 'Integrations', 'Pricing']
  const companyLinks = ['About', 'Careers', 'Blog', 'Contact']
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Security']

  return (
    <footer className="bg-[#191919]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">

        {/* Top section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-12">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-[8px] bg-[#fd5000] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M14 2L4 14h7l-1 8 10-12h-7l1-8z"/></svg>
              </div>
              <span className="font-jakarta font-extrabold text-white text-[22px] tracking-[-0.03em]">zuper</span>
            </div>
            <p className="font-inter text-[14px] text-[#888] leading-[1.7] mb-6 max-w-[280px]">
              AI-powered CSR that handles overflow calls, after-hours inquiries, and storm surge — so your roofing business never misses a lead.
            </p>
            <div className="flex items-center gap-3">
              {['twitter', 'linkedin', 'youtube'].map(platform => (
                <a key={platform} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:-translate-y-[1px]"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(253,80,0,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {platform === 'twitter' && <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />}
                    {platform === 'linkedin' && <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>}
                    {platform === 'youtube' && <><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-jakarta font-bold text-white text-[13px] tracking-[0.04em] uppercase mb-5">Product</h4>
            <ul className="flex flex-col gap-3">
              {productLinks.map(l => (
                <li key={l}><a href="#" className="font-inter text-[14px] text-[#888] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-jakarta font-bold text-white text-[13px] tracking-[0.04em] uppercase mb-5">Company</h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map(l => (
                <li key={l}><a href="#" className="font-inter text-[14px] text-[#888] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-jakarta font-bold text-white text-[13px] tracking-[0.04em] uppercase mb-5">Legal</h4>
            <ul className="flex flex-col gap-3">
              {legalLinks.map(l => (
                <li key={l}><a href="#" className="font-inter text-[14px] text-[#888] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="font-['Space_Mono',monospace] text-[11px] text-[#555]">
            © 2025 Zuper Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 4px #4ade80' }} />
            <span className="font-['Space_Mono',monospace] text-[10px] text-[#555]">All systems operational</span>
          </div>
        </div>
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
