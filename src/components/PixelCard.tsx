import { useRef, useEffect, useState } from 'react'

interface PixelCardProps {
  children: React.ReactNode
  gap?: number
  speed?: number
  colors?: string
  opacity?: number
}

export default function PixelCard({
  children,
  gap = 6,
  speed = 35,
  colors = '#fd5000,#ff7849,#ffa07a',
  opacity = 0.3,
}: PixelCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [hovered, setHovered] = useState(false)
  const hoveredRef = useRef(false)
  const fadeRef = useRef(0)

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colorArr = colors.split(',').map(c => c.trim())
    let w = 0
    let h = 0

    const resize = () => {
      const rect = container.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w
      canvas.height = h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const draw = () => {
      timeRef.current += speed * 0.001

      // Smooth fade in/out
      const target = hoveredRef.current ? 1 : 0
      fadeRef.current += (target - fadeRef.current) * 0.08

      ctx.clearRect(0, 0, w, h)

      if (fadeRef.current < 0.01) {
        animRef.current = requestAnimationFrame(draw)
        return
      }

      const g = gap
      const cols = Math.ceil(w / g)
      const rows = Math.ceil(h / g)
      const t = timeRef.current
      const globalFade = fadeRef.current

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Sparse — ~40% of cells
          const hash = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453
          const rand = hash - Math.floor(hash)
          if (rand > 0.4) continue

          // Gentle shimmer
          const shimmer = 0.4 + Math.sin(t * 1.2 + rand * 25 + i * 0.3 + j * 0.2) * 0.35
          if (shimmer < 0.2) continue

          const x = i * g
          const y = j * g
          const ci = Math.floor(Math.abs(Math.sin(i * 0.5 + j * 0.4 + t * 0.2)) * colorArr.length)

          ctx.globalAlpha = Math.max(0, Math.min(1, shimmer * globalFade * opacity))
          ctx.fillStyle = colorArr[ci % colorArr.length]
          ctx.fillRect(x, y, g - 1, g - 1)
        }
      }

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [gap, speed, colors, opacity])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2, borderRadius: 'inherit' }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
