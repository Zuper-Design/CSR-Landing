import { useRef, useState } from 'react'

interface ProfileCardProps {
  name: string
  title: string
  status?: string
  number?: string
  dotColor?: string
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
  number = '001',
  dotColor = '#22c55e',
  avatarUrl,
  showUserInfo = true,
  enableTilt = true,
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
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-[26px] text-[#191919] tracking-[-0.03em] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
                <span className="text-[12px] font-medium text-[#bbb]" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {number}
                </span>
              </div>
            </div>
            <p className="text-[13px] mt-1" style={{ fontFamily: 'Inter, sans-serif', color: '#888', lineHeight: 1.5 }}>{title}</p>
          </div>
        )}
      </div>
    </div>
  )
}
