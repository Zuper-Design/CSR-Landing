import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ClipboardList, CalendarCheck, MessageSquare, Activity, BookOpen, Zap, Check, TrendingUp, BarChart2, Users, Link2, CloudLightning } from 'lucide-react'
import { assets } from '../assets'
import ProfileCard from './ProfileCard'


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
      className={`inline-flex items-center gap-1.5 px-3 py-[5px] rounded-[88px] text-[11px] font-['Space_Mono',monospace] font-medium text-[#fd5000] whitespace-nowrap ${className}`}
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

function useDotGrid() {
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false })
  const onMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true })
  }
  const onMouseLeave = () => setMouse(m => ({ ...m, active: false }))
  return { mouse, onMouseMove, onMouseLeave }
}

function DotGridBg({ mouse }: { mouse: { x: number; y: number; active: boolean } }) {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(253,80,0,0.10) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: 'radial-gradient(circle, #fd5000 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage: `radial-gradient(circle 280px at ${mouse.x}px ${mouse.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(circle 280px at ${mouse.x}px ${mouse.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 75%)`,
          opacity: mouse.active ? 1 : 0,
          transition: mouse.active ? 'opacity 0.1s' : 'opacity 0.6s ease',
        }}
      />
    </>
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
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-[1440px] mx-auto px-10 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
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
            // Loop again after 10 seconds
            timeout = setTimeout(startReading, 10000)
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
      {/* SVG gradient background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="heroGlow1" cx="20%" cy="15%" r="60%">
            <stop offset="0%" stopColor="#3d0a00" />
            <stop offset="50%" stopColor="#8b2010" />
            <stop offset="100%" stopColor="#c43a1a" />
          </radialGradient>
          <radialGradient id="heroGlow2" cx="75%" cy="70%" r="65%">
            <stop offset="0%" stopColor="#f08030" />
            <stop offset="60%" stopColor="#d85a20" />
            <stop offset="100%" stopColor="#b83a15" />
          </radialGradient>
          <radialGradient id="heroGlow3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#e05828" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="heroBlur">
            <feGaussianBlur stdDeviation="50" />
          </filter>
          <filter id="heroNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        {/* Base gradient */}
        <rect width="1440" height="900" fill="url(#heroGlow1)" />
        {/* Warm overlay */}
        <rect width="1440" height="900" fill="url(#heroGlow2)" opacity="0.7" />
        {/* Center glow */}
        <rect width="1440" height="900" fill="url(#heroGlow3)" />
        {/* Geometric shapes for depth — blurred */}
        <g filter="url(#heroBlur)">
          <polygon points="0,0 500,0 300,500 0,400" fill="rgba(0,0,0,0.12)" />
          <polygon points="600,0 1440,0 1440,350 800,450" fill="rgba(0,0,0,0.08)" />
          <polygon points="200,400 700,300 900,700 400,900 0,900 0,600" fill="rgba(0,0,0,0.06)" />
          <polygon points="1000,200 1440,100 1440,600 1100,700 900,500" fill="rgba(0,0,0,0.10)" />
          <polygon points="0,700 300,500 600,800 400,900 0,900" fill="rgba(255,120,50,0.08)" />
        </g>
        {/* Subtle texture */}
        <rect width="1440" height="900" opacity="0.03" filter="url(#heroNoise)" />
      </svg>

      {/* Subtle scrim for bottom legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

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
                        : (isIdle ? 0.65 : (highlighted ? 0.65 : 0.15)),
                      transition: isTubelight ? 'none' : 'opacity 0.3s ease',
                      ...(isTubelight ? {
                        textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.2)',
                      } : {}),
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
          }}>
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
              {[
                { bg: '#fd5000', icon: '🏠' },
                { bg: '#6366f1', icon: '⚡' },
                { bg: '#0ea5e9', icon: '🔨' },
                { bg: '#e11d48', icon: '🏗' },
              ].map((a, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-[1.5px] border-white/40 flex items-center justify-center"
                  style={{ background: a.bg, fontSize: 10 }}>
                  {a.icon}
                </div>
              ))}
            </div>
            <p className="font-inter text-[13px]" style={{ color: '#BCBCBC' }}>
              Trusted by <span className="font-semibold text-white">500+</span> roofing companies
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
                <span className="font-inter text-[12px] font-semibold text-white tracking-wide uppercase">Live Demo</span>
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

            {/* Orb — animated breathing glow */}
            <div className="flex items-center justify-center px-8 py-3">
              <div className="relative">
                {/* Breathing glow */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'radial-gradient(circle, rgba(253,80,0,0.35) 0%, transparent 70%)',
                  transform: 'scale(1.3)',
                  animation: playing ? 'orbBreath 2s ease-in-out infinite' : 'orbBreath 3.5s ease-in-out infinite',
                }} />
                {/* Pulse rings — always visible, faster when playing */}
                {[0, 0.8, 1.6].map((d,i) => (
                  <div key={i} className="absolute inset-0 rounded-full" style={{
                    border: `1.5px solid rgba(253,80,0,${playing ? 0.3 : 0.15})`,
                    animation: `${playing ? 'orbPulseRing' : 'orbIdlePulse'} ${playing ? 2.1 : 3.5}s ease-out infinite ${d}s`,
                  }} />
                ))}
                <img
                  src={assets.agentOverlay}
                  alt="AI voice agent"
                  style={{
                    width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', position: 'relative',
                    filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.50))',
                    animation: playing ? 'none' : 'orbGlow 3.5s ease-in-out infinite',
                    boxShadow: playing ? '0 0 0 3px rgba(253,80,0,0.35), 0 0 30px rgba(253,80,0,0.20)' : undefined,
                    transition: 'box-shadow 0.4s ease',
                  }}
                />
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
        <div className="max-w-[1240px] mx-auto px-10 grid grid-cols-4 divide-x divide-white/15">
          {HERO_STATS.map(([v, l]) => (
            <div key={l} className="py-5 flex flex-col items-center gap-[4px]">
              {/* white on rgba(0,0,0,0.55)+dark photo ≈ #0A0A0A effective → ~20:1 ✓ */}
              <span className="font-jakarta font-extrabold text-white text-[20px] leading-none tracking-[-0.03em]">{v}</span>
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
  { tag: 'Lead Intake',      Icon: ClipboardList, title: 'Intake & Qualification',     desc: 'Captures name, address, damage type, insurance carrier, and urgency — routed straight into your Zuper pipeline.' },
  { tag: 'Scheduling',       Icon: CalendarCheck,  title: 'Appointment Booking',        desc: 'Checks real-time crew availability, offers slots, and confirms inspections with no dispatcher required.' },
  { tag: 'Sales Support',    Icon: MessageSquare,  title: 'Estimation & Quote Queries', desc: 'Answers pricing and scope questions instantly. Flags complex deals for your sales team to own and close.' },
  { tag: 'Customer Service', Icon: Activity,       title: 'Job Status Updates',         desc: 'Pulls live job data from Zuper and communicates progress, schedule changes, and next steps to homeowners.' },
  { tag: 'FAQ Handling',     Icon: BookOpen,       title: 'Business & Services FAQ',    desc: 'Handles services, coverage areas, warranties, insurance claims, and financing — consistently, every time.' },
  { tag: 'Storm Response',   Icon: Zap,            title: 'Emergency Triage',           desc: 'Identifies storm, hail, and water urgency. Escalates critical cases to on-call crews while capturing full intake.' },
]

// Fixed card height + gap to calculate exact scroll needed
const CAP_CARD_H = 152 // approx height of each card (py-8 + content)
const CAP_GAP = 16
const CAP_VISIBLE = 3
const CAP_TOTAL = CAPS.length
// How much the cards need to scroll: (total - visible) cards * (card height + gap)
const CAP_SCROLL = (CAP_TOTAL - CAP_VISIBLE) * (CAP_CARD_H + CAP_GAP)

function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [colorOpacity, setColorOpacity] = useState(0)
  const [cardTranslate, setCardTranslate] = useState(0)
  const dotGrid = useDotGrid()

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const entered = -rect.top
      const clamped = Math.max(0, entered)

      setCardTranslate(Math.min(clamped, CAP_SCROLL))

      const opacity = Math.min(1, Math.max(0, clamped / 150))
      setColorOpacity(opacity)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="bg-[#f8f5f0] relative"
      onMouseMove={dotGrid.onMouseMove}
      onMouseLeave={dotGrid.onMouseLeave}
    >
      <DotGridBg mouse={dotGrid.mouse} />
      {/* Scroll runway: viewport + extra scroll for remaining cards */}
      <div className="relative z-10" style={{ height: `calc(100vh + ${CAP_SCROLL}px)` }}>
        {/* Sticky container — locks to viewport */}
        <div className="sticky top-0" style={{ height: '100vh', overflow: 'hidden' }}>
          <div className="max-w-[1240px] mx-auto px-12 h-full flex flex-col" style={{ paddingTop: 48, paddingBottom: 40 }}>

            {/* ── Title ── */}
            <div className="mb-6 shrink-0">
              <SectionEyebrow icon="⚡" label="Capabilities" />
              <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4">
                Not a chatbot.<br />
                <span className="text-[#fd5000]">A roofing expert.</span>
              </h2>
              <p className="font-inter text-[15px] text-[#7A7A7A] leading-[1.75] mt-3">
                Trained on roofing workflows. Ready to qualify, book, and convert — across calls and text.
              </p>
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
                  <div className="absolute bottom-0 left-0 right-0 px-5 pt-10 pb-5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.40) 55%, transparent 100%)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#4ade80] shrink-0" style={{ boxShadow: '0 0 5px #4ade80' }} />
                      <span className="font-['Space_Mono',monospace] text-[10px] font-medium text-white/70 tracking-[0.12em] uppercase">Live · Available 24/7</span>
                    </div>
                    <p className="font-jakarta font-bold text-white text-[16px] leading-tight tracking-[-0.01em]">Zuper CSR Agent</p>
                    <p className="font-inter text-[12px] mt-0.5" style={{ color: '#C8C8C8' }}>Handles calls, texts &amp; storm surge — automatically.</p>
                  </div>
                </div>
              </div>

              {/* Right: cards — clips to ~3 visible, scroll drives translateY */}
              <div className="flex-1 relative overflow-hidden">
                <div
                  className="flex flex-col gap-4 absolute left-0 right-0"
                  style={{
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
                        style={{ background: 'linear-gradient(135deg, rgba(253,80,0,0.15) 0%, rgba(253,80,0,0.07) 100%)' }}
                      >
                        <c.Icon size={22} strokeWidth={1.7} color="#fd5000" />
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
                        <span className="inline-flex items-center font-['Space_Mono',monospace] text-[11px] font-medium text-[#fd5000] px-3 py-[4px] rounded-full"
                          style={{ background: 'rgba(253,80,0,0.07)', border: '0.5px solid rgba(253,80,0,0.18)' }}>
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
    title: 'Lead Intake Specialist',
    img: '/agent-dominic.png',
    glowColor: 'rgba(253, 120, 50, 0.5)',
    gradient: 'linear-gradient(145deg, #2a150a88 0%, #fd500030 100%)',
  },
  {
    name: 'Nova',
    title: 'Scheduling Coordinator',
    img: '/agent-nova.png',
    glowColor: 'rgba(125, 190, 255, 0.5)',
    gradient: 'linear-gradient(145deg, #0a1a2a88 0%, #71C4FF30 100%)',
  },
  {
    name: 'Scott',
    title: 'Storm Surge Responder',
    img: '/agent-scott.png',
    glowColor: 'rgba(255, 160, 80, 0.5)',
    gradient: 'linear-gradient(145deg, #1a0f0588 0%, #ff8c3030 100%)',
  },
]

function MeetAgents() {
  const dotGrid = useDotGrid()

  return (
    <div className="py-24 bg-[#f8f5f0] relative overflow-hidden" onMouseMove={dotGrid.onMouseMove} onMouseLeave={dotGrid.onMouseLeave}>
      <DotGridBg mouse={dotGrid.mouse} />
      <div className="max-w-[1120px] mx-auto px-12 relative z-10">
        <RevealOnScroll className="text-center mb-14">
          <SectionEyebrow icon="🤖" label="Agents" />
          <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
            Meet Your <span className="text-[#fd5000]">AI Team</span>
          </h2>
          <p className="font-inter text-[17px] font-light text-[#5A5A5A] max-w-[480px] mx-auto leading-[1.7]">
            Three specialized agents, each trained for a different part of your roofing workflow.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-3 gap-8">
          {AGENTS.map((agent, i) => (
            <RevealOnScroll key={agent.name} delay={i * 100}>
              <ProfileCard
                name={agent.name}
                title={agent.title}
                status="Online"
                contactText="View Agent"
                avatarUrl={agent.img}
                enableTilt={true}
                behindGlowColor={agent.glowColor}
                behindGlowEnabled

                onContactClick={() => console.log(`View ${agent.name}`)}
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  )
}

/* AgentCard replaced by ProfileCard component */

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
  const dotGrid = useDotGrid()
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
    <section id="workflows" className="py-24 bg-[#f8f5f0] relative overflow-hidden" onMouseMove={dotGrid.onMouseMove} onMouseLeave={dotGrid.onMouseLeave}>
      <DotGridBg mouse={dotGrid.mouse} />
      <div className="max-w-[1320px] mx-auto px-12 relative z-10">

        {/* Header */}
        <RevealOnScroll className="mb-12">
          <SectionEyebrow icon="🔁" label="Workflows" />
          <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.035em] mt-4 mb-3">
            Three scenarios.<br /><span className="text-[#fd5000]">One agent.</span>
          </h2>
          <p className="font-inter text-[15px] text-[#7A7A7A] max-w-[480px] leading-[1.7]">
            See exactly how the CSR Agent handles your most critical call types — with real sample transcripts.
          </p>
        </RevealOnScroll>

        {/* Outer card */}
        {/* Workflow selector cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {WORKFLOWS.map((wf, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setPlaying(false) }}
              className="relative text-left rounded-[18px] px-6 py-5 flex flex-col gap-1.5 transition-all cursor-pointer"
              style={{
                background: 'white',
                boxShadow: active === i
                  ? '0 8px 28px rgba(0,0,0,0.08), 0 0 0 2px #fd5000'
                  : '0 2px 10px rgba(0,0,0,0.04)',
                transform: active === i ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <span className={`text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full w-fit font-['Space_Mono',monospace] ${BADGE_STYLES[wf.badgeColor]}`}>{wf.badge}</span>
              <span className="font-inter text-[14px] font-bold text-[#191919] leading-snug mt-0.5">{wf.tabName}</span>
              <span className="font-inter text-[12px] text-[#ABABAB]">{wf.tabNote}</span>
            </button>
          ))}
        </div>

        {/* Main workflow card */}
        <div className="bg-white rounded-[24px] overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>

          {/* Body */}
          <div className="grid grid-cols-[1fr_440px]" style={{ height: 580 }}>

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
                          ? { background: '#22C55E', border: '1px solid #16A34A' }
                          : { background: 'rgba(253,80,0,0.08)', color: '#fd5000', border: '1px solid rgba(253,80,0,0.15)' }}
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

              {/* Call header */}
              <div className="flex items-center gap-3 px-6 py-5 bg-white shrink-0" style={{ borderBottom: '1px solid #f0ebe3' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{ background: 'rgba(253,80,0,0.08)' }}>
                  {panel.callAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-inter text-[13px] font-semibold text-[#191919] truncate leading-tight">{panel.callName}</div>
                  <div className="font-inter text-[11px] text-[#BFBFBF] mt-0.5">{panel.callInfo}</div>
                </div>
                <Chip>{panel.callDur}</Chip>
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
                        <span className="inline-flex mt-1.5 font-['Space_Mono',monospace] text-[10px] font-medium px-[9px] py-[4px] rounded-full"
                          style={{ background: 'rgba(253,80,0,0.08)', color: '#fd5000', border: '1px solid rgba(253,80,0,0.25)' }}>
                          {m.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  )
                })}
              </div>

              {/* Fade gradient above floating player */}
              <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 120, background: 'linear-gradient(to top, #faf7f4 0%, #faf7f4 20%, transparent 100%)' }} />

              {/* Floating player card — bottom of right panel */}
              <style>{`@keyframes playerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
              <div className="absolute bottom-5 left-5 right-5 z-20" style={{ animation: 'playerFloat 3s ease-in-out infinite' }}>
                <div className="rounded-[16px] px-4 py-3.5 flex items-center gap-3"
                  style={{
                    background: 'white',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
                  }}
                >
                  <button
                    onClick={() => setPlaying(p => !p)}
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: playing ? '#191919' : '#fd5000',
                      boxShadow: playing ? '0 3px 10px rgba(0,0,0,0.15)' : '0 3px 12px rgba(253,80,0,0.30)',
                    }}
                  >
                    {playing
                      ? <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><rect x="1" y="0" width="3" height="10" rx="1"/><rect x="6" y="0" width="3" height="10" rx="1"/></svg>
                      : <svg width="10" height="12" viewBox="0 0 10 12" fill="white" style={{ marginLeft: 1 }}><path d="M0 0L10 6L0 12Z"/></svg>
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[2px] h-8 overflow-hidden">
                      {bars.map((b, i) => (
                        <div key={i} className="flex-1 rounded-full"
                          style={{ height: `${b.h}%`, background: b.filled ? (playing ? '#fd5000' : 'rgba(253,80,0,0.45)') : 'rgba(0,0,0,0.07)' }} />
                      ))}
                    </div>
                  </div>
                  <span className="font-['Space_Mono',monospace] text-[10px] text-[#999] shrink-0 tabular-nums">
                    {formatMs(elapsedMs)} / {panel.callDur}
                  </span>
                </div>
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

  // Higher Close Rates — check circle ticking animation
  if (item.title.includes('Close')) return (
    <svg viewBox="0 0 100 100" className="mx-auto" style={{ width: 90, height: 90 }}>
      {/* Circle draws in */}
      <circle cx="50" cy="50" r="38" fill="none" stroke={`${c}20`} strokeWidth="4" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={c} strokeWidth="4"
        strokeLinecap="round" strokeDasharray="240" strokeDashoffset="240" transform="rotate(-90 50 50)">
        <animate attributeName="stroke-dashoffset" values="240;0" dur="1s" fill="freeze" repeatCount="indefinite" begin="0s;2.5s" />
      </circle>
      {/* Check draws in after circle */}
      <path d="M32 52 L45 64 L68 38" fill="none" stroke={c} strokeWidth="5"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60">
        <animate attributeName="stroke-dashoffset" values="60;0" dur="0.4s" begin="1s;3.5s" fill="freeze" repeatCount="indefinite" />
      </path>
      {/* Soft pulse after complete */}
      <circle cx="50" cy="50" r="38" fill="none" stroke={c} strokeWidth="2" opacity="0">
        <animate attributeName="r" values="38;48" dur="0.6s" begin="1.4s;3.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0" dur="0.6s" begin="1.4s;3.9s" repeatCount="indefinite" />
      </circle>
    </svg>
  )

  // Shorter Response — minimal pulse dot
  if (item.title.includes('Response')) return (
    <svg viewBox="0 0 200 80" className="w-full" style={{ height: 80 }}>
      <line x1="20" y1="40" x2="180" y2="40" stroke="#e5e5e5" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="40" x2="170" y2="40" stroke={c} strokeWidth="2" strokeLinecap="round">
        <animate attributeName="x2" values="20;170;20" dur="3s" repeatCount="indefinite" />
      </line>
      <circle cx="170" cy="40" r="5" fill={c}>
        <animate attributeName="cx" values="20;170;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  )

  // Storm Surge — clean bar chart with subtle breathing
  if (item.title.includes('Storm')) return (
    <svg viewBox="0 0 200 80" className="w-full" style={{ height: 80 }}>
      {[12, 16, 14, 20, 30, 50, 72, 68, 55, 38, 25, 18].map((h, i) => (
        <rect key={i} x={8 + i * 16} y={80 - h} width="10" height={h} rx="2" fill={h > 45 ? c : `${c}30`}>
          <animate attributeName="height" values={`${h * 0.7};${h};${h * 0.7}`} dur={`${2 + i * 0.1}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`${80 - h * 0.7};${80 - h};${80 - h * 0.7}`} dur={`${2 + i * 0.1}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  )

  // Pipeline — horizontal progress segments
  if (item.title.includes('Pipeline')) return (
    <svg viewBox="0 0 200 80" className="w-full" style={{ height: 80 }}>
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="20" y={10 + i * 24} width="160" height="16" rx="8" fill="#eee" />
          <rect x="20" y={10 + i * 24} width="0" height="16" rx="8" fill={[c, '#3b82f6', '#8b5cf6'][i]} opacity="0.6">
            <animate attributeName="width" values={`0;${140 - i * 25}`} dur="1.5s" begin={`${i * 0.2}s`} fill="freeze" />
          </rect>
          <circle cx="0" cy={18 + i * 24} r="4" fill={[c, '#3b82f6', '#8b5cf6'][i]} opacity="0.6">
            <animate attributeName="cx" values="20;{160 - i * 25}" dur="1.5s" begin={`${i * 0.2}s`} fill="freeze" />
            <animate attributeName="r" values="3;4;3" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  )

  // Revenue Per CSR — donut ring
  if (item.title.includes('Revenue')) return (
    <svg viewBox="0 0 100 100" className="mx-auto" style={{ width: 90, height: 90 }}>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#eee" strokeWidth="8" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={c} strokeWidth="8"
        strokeLinecap="round" strokeDasharray="190 50" transform="rotate(-90 50 50)">
        <animate attributeName="stroke-dasharray" values="0 240;190 50" dur="1.5s" fill="freeze" />
      </circle>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e5e5" strokeWidth="8"
        strokeLinecap="round" strokeDasharray="50 190" strokeDashoffset="-190" transform="rotate(-90 50 50)" />
    </svg>
  )

  // Zero Tool Sprawl — connected nodes
  return (
    <svg viewBox="0 0 200 80" className="w-full" style={{ height: 80 }}>
      {[[30, 40], [80, 40], [130, 40], [180, 40]].map(([x, y], i) => (
        <g key={i}>
          {i < 3 && (
            <line x1={x + 8} y1={y} x2={x + 42} y2={y} stroke={`${c}25`} strokeWidth="2">
              <animate attributeName="stroke" values={`${c}15;${c}40;${c}15`} dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </line>
          )}
          <circle cx={x} cy={y} r="8" fill={`${c}10`} stroke={`${c}30`} strokeWidth="1.5">
            <animate attributeName="r" values="7;9;7" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r="3" fill={c} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  )
}

function RMCard({ item, i }: { item: typeof RM_ITEMS[number]; i: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <RevealOnScroll delay={(i % 3) * 70} className="h-full">
      <div
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
          <p className="font-inter text-[13px] text-[#888] leading-[1.65]">{item.desc}</p>
        </div>

        {/* Illustration area at bottom */}
        <div
          className="flex-1 flex items-center justify-center mx-4 mb-4 rounded-[14px] overflow-hidden"
          style={{
            background: '#f7f4f0',
            padding: '20px 24px',
            minHeight: 160,
          }}
        >
          <RMCardIllustration item={item} hovered={hovered} />
        </div>
      </div>
    </RevealOnScroll>
  )
}

function RevenueMultiplier() {
  const dotGrid = useDotGrid()

  return (
    <section
      className="py-24 bg-[#f8f5f0] relative overflow-hidden"
      onMouseMove={dotGrid.onMouseMove}
      onMouseLeave={dotGrid.onMouseLeave}
    >
      <DotGridBg mouse={dotGrid.mouse} />
      <div className="max-w-[1280px] mx-auto px-12 relative z-10">
        <RevealOnScroll className="text-center mb-14">
          <SectionEyebrow icon="📊" label="Impact" />
          <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.035em] mt-4 mb-3">
            From Feature to <span className="text-[#fd5000]">Revenue Multiplier</span>
          </h2>
          <p className="font-inter text-[17px] font-light text-[#5A5A5A] max-w-[520px] mx-auto leading-[1.7]">
            The CSR Agent isn't just a feature — it's a measurable lift across your most critical business metrics.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-3 gap-6">
          {RM_ITEMS.map((item, i) => (
            <RMCard key={item.title} item={item} i={i} />
          ))}
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
  const dotGrid = useDotGrid()

  return (
    <section id="case-study" className="py-24 bg-[#f8f5f0] relative overflow-hidden" onMouseMove={dotGrid.onMouseMove} onMouseLeave={dotGrid.onMouseLeave}>
      <DotGridBg mouse={dotGrid.mouse} />
      <div className="max-w-[1200px] mx-auto px-12 relative z-10">

        <RevealOnScroll className="mb-12">
          <SectionEyebrow icon="📖" label="Customer Story" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-4">
            <h2 className="font-jakarta font-extrabold text-[#191919] text-[clamp(32px,4vw,52px)] leading-[1.06] tracking-[-0.035em]">
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
                    <div className="font-jakarta font-extrabold text-white text-[28px] leading-none tracking-[-0.04em]">{s.num}</div>
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
              <div className="grid grid-cols-3 border-t border-[#ede8e2]" style={{ background: '#fafaf8' }}>
                {CS_STATS.slice(3).map((s, i) => (
                  <div key={s.label} className={`px-5 py-6 ${i < 2 ? 'border-r border-[#ede8e2]' : ''}`}>
                    <div className="font-jakarta font-extrabold text-[#fd5000] text-[28px] leading-none tracking-[-0.04em]">{s.num}</div>
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
          <h2 className="font-jakarta font-extrabold text-white text-[clamp(34px,4.5vw,58px)] leading-[1.1] tracking-[-0.04em] max-w-[680px] mx-auto mb-4">
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
            <div className="font-['Space_Mono',monospace] text-[10px] text-[#ABABAB] tracking-[0.08em] uppercase">AI Operating System for the Trades</div>
          </div>
        </div>
        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-5">
          {footerLinks.map(l => (
            <a key={l} href="#" className="font-inter text-[13px] text-[#7A7A7A] hover:text-[#191919] transition-colors">{l}</a>
          ))}
        </nav>
        {/* Copyright */}
        <div className="font-['Space_Mono',monospace] text-[11px] text-[#ABABAB]">© 2025 Zuper Inc.</div>
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
      <MeetAgents />
      <Workflows />
      <RevenueMultiplier />
      <CaseStudy />
      <CTASection />
      <Footer />
    </div>
  )
}
