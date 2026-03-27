import { useRef, useState } from 'react'

interface ProfileCardProps {
  name: string
  title: string
  status?: string
  contactText?: string
  avatarUrl: string
  showUserInfo?: boolean
  enableTilt?: boolean
  onContactClick?: () => void
  behindGlowColor?: string
  behindGlowEnabled?: boolean
  children?: React.ReactNode
}

export default function ProfileCard({
  name,
  title,
  status = 'Online',
  contactText = 'View Agent',
  avatarUrl,
  showUserInfo = true,
  enableTilt = true,
  onContactClick,
  behindGlowColor = 'rgba(253, 80, 0, 0.4)',
  behindGlowEnabled = true,
}: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const onMouseMove = (e: React.MouseEvent) => {
    if (!enableTilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({ x: (y - 0.5) * -20, y: (x - 0.5) * 20 })
    setGlowPos({ x: x * 100, y: y * 100 })
  }

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      {/* Behind glow */}
      {behindGlowEnabled && (
        <div
          className="absolute inset-0 rounded-[24px]"
          style={{
            background: behindGlowColor,
            filter: 'blur(40px)',
            opacity: hovered ? 0.7 : 0.3,
            transform: `scale(0.85) translateY(8px)`,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}

      {/* Card */}
      <div
        ref={cardRef}
        className="relative rounded-[24px] overflow-hidden"
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Inner gradient overlay — disabled, kept for API compat */}

        {/* Shine effect following cursor */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Avatar area with card background */}
        <div className="relative overflow-hidden" style={{ height: 360 }}>
          {/* Background pattern */}
          <img
            src="/card-bg.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scale(1.15)' }}
          />
          {/* Character image */}
          <img
            src={avatarUrl}
            alt={name}
            className="relative z-[5] w-full h-full block"
            style={{
              objectFit: 'contain',
              objectPosition: 'center bottom',
              padding: '20px 10px 0',
            }}
          />
        </div>

        {/* Info section at bottom */}
        {showUserInfo && (
          <div className="relative z-30 px-6 pt-4 pb-5" style={{ background: 'white' }}>
            {/* Badge — top right */}
            <div className="flex justify-end mb-2">
              <span className="text-[11px] font-medium px-3 py-1 rounded-full"
                style={{ fontFamily: 'Space Mono, monospace', color: '#fd5000', border: '1.5px solid #fd5000' }}>
                {status === 'Online' ? 'Z-367' : status}
              </span>
            </div>
            <h3 className="font-bold text-[26px] text-[#191919] tracking-[-0.03em] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {name}
            </h3>
            <p className="text-[15px] mt-1 mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#fd5000' }}>{title}</p>
            <button
              onClick={onContactClick}
              className="w-full flex items-center justify-center gap-2 font-semibold text-[13px] py-3 rounded-[12px] text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                fontFamily: 'Inter, sans-serif',
                background: '#fd5000',
                boxShadow: '0 4px 16px rgba(253,80,0,0.3)',
              }}
            >
              {contactText}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
