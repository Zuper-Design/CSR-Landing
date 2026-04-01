import { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import { gsap } from 'gsap'

function hexToRgba(color: string): { r: number; g: number; b: number; a: number } {
  // Handle rgba()
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    }
  }
  // Handle hex
  const m = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return { r: 0, g: 0, b: 0, a: 1 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16), a: 1 }
}

interface DotGridProps {
  dotSize?: number
  gap?: number
  baseColor?: string
  activeColor?: string
  proximity?: number
  shockRadius?: number
  shockStrength?: number
  resistance?: number
  returnDuration?: number
}

interface Dot {
  cx: number
  cy: number
  xOffset: number
  yOffset: number
  _pushed: boolean
}

export default function DotGrid({
  dotSize = 3,
  gap = 20,
  baseColor = 'rgba(255, 107, 53, 0.12)',
  activeColor = '#FF6B35',
  proximity = 100,
  shockRadius = 200,
  shockStrength = 3,
  returnDuration = 1.8,
}: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const pointerRef = useRef({ x: -9999, y: -9999 })
  const needsDrawRef = useRef(true)
  const rafRef = useRef<number>(0)
  const [isMobile] = useState(() => typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768))

  const baseRgba = useMemo(() => hexToRgba(baseColor), [baseColor])
  const activeRgba = useMemo(() => hexToRgba(activeColor), [activeColor])

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const { width, height } = wrap.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)

    const cell = dotSize + gap
    const cols = Math.floor((width + gap) / cell)
    const rows = Math.floor((height + gap) / cell)
    const gridW = cell * cols - gap
    const gridH = cell * rows - gap
    const startX = (width - gridW) / 2 + dotSize / 2
    const startY = (height - gridH) / 2 + dotSize / 2

    const dots: Dot[] = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ cx: startX + x * cell, cy: startY + y * cell, xOffset: 0, yOffset: 0, _pushed: false })
      }
    }
    dotsRef.current = dots
    needsDrawRef.current = true
  }, [dotSize, gap])

  // Draw loop — only runs when needed
  useEffect(() => {
    if (isMobile) return

    const proxSq = proximity * proximity
    const halfDot = dotSize / 2
    let idleFrames = 0

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return }

      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x: px, y: py } = pointerRef.current
      let anyActive = false

      for (const dot of dotsRef.current) {
        // Lerp offsets back to 0 if not pushed
        if (!dot._pushed) {
          if (Math.abs(dot.xOffset) > 0.01 || Math.abs(dot.yOffset) > 0.01) {
            dot.xOffset *= 0.94
            dot.yOffset *= 0.94
            anyActive = true
          } else {
            dot.xOffset = 0
            dot.yOffset = 0
          }
        } else {
          anyActive = true
        }

        const ox = dot.cx + dot.xOffset
        const oy = dot.cy + dot.yOffset
        const dx = dot.cx - px
        const dy = dot.cy - py
        const dsq = dx * dx + dy * dy

        // Edge fade — dots near edges fade out
        const edgeFadeX = Math.min(dot.cx / 60, (width - dot.cx) / 60, 1)
        const edgeFadeY = Math.min(dot.cy / 60, (height - dot.cy) / 60, 1)
        const edgeFade = Math.min(edgeFadeX, edgeFadeY)

        let r = baseRgba.r, g = baseRgba.g, b = baseRgba.b, a = baseRgba.a
        let scale = 1

        if (dsq <= proxSq) {
          anyActive = true
          const dist = Math.sqrt(dsq)
          const t = 1 - dist / proximity
          const s = t * t * (3 - 2 * t) // smoothstep

          r = Math.round(baseRgba.r + (activeRgba.r - baseRgba.r) * s)
          g = Math.round(baseRgba.g + (activeRgba.g - baseRgba.g) * s)
          b = Math.round(baseRgba.b + (activeRgba.b - baseRgba.b) * s)
          a = baseRgba.a + (activeRgba.a - baseRgba.a) * s
          scale = 1 + s * 0.5
        }

        ctx.save()
        ctx.globalAlpha = a * edgeFade
        ctx.translate(ox, oy)
        ctx.scale(scale, scale)
        ctx.beginPath()
        ctx.arc(0, 0, halfDot, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fill()
        ctx.restore()
      }

      // Only keep looping if something is animating
      if (anyActive || needsDrawRef.current) {
        needsDrawRef.current = false
        idleFrames = 0
      } else {
        idleFrames++
      }

      // Stop loop after 30 idle frames to save CPU
      if (idleFrames < 30) {
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    const startLoop = () => {
      idleFrames = 0
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(draw)
    }

    startLoop()

    // Restart loop on mouse activity
    const onActivity = () => {
      needsDrawRef.current = true
      startLoop()
    }
    window.addEventListener('mousemove', onActivity, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onActivity)
    }
  }, [proximity, dotSize, baseColor, activeColor, activeRgba, baseRgba, isMobile])

  // Resize
  useEffect(() => {
    buildGrid()
    const ro = new ResizeObserver(() => { buildGrid(); needsDrawRef.current = true })
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [buildGrid])

  // Mouse tracking — window-level, works behind all content
  useEffect(() => {
    if (isMobile) return
    const onMove = (e: MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x >= -proximity && x <= rect.width + proximity && y >= -proximity && y <= rect.height + proximity) {
        pointerRef.current.x = x
        pointerRef.current.y = y
      } else {
        pointerRef.current.x = -9999
        pointerRef.current.y = -9999
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobile, proximity])

  // Click shockwave
  useEffect(() => {
    if (isMobile) return
    const onClick = (e: MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      if (cx < -10 || cx > rect.width + 10 || cy < -10 || cy > rect.height + 10) return

      needsDrawRef.current = true

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy)
        if (dist < shockRadius && !dot._pushed) {
          dot._pushed = true
          gsap.killTweensOf(dot)
          const falloff = Math.max(0, 1 - dist / shockRadius)
          const angle = Math.atan2(dot.cy - cy, dot.cx - cx)
          const pushDist = shockStrength * falloff * (dotSize + gap)
          const pushX = Math.cos(angle) * pushDist
          const pushY = Math.sin(angle) * pushDist

          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.2,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
                onComplete: () => { dot._pushed = false },
              })
            },
          })
        }
      }
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [shockRadius, shockStrength, returnDuration, dotSize, gap, isMobile])

  // Don't render on mobile
  if (isMobile) return null

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'multiply' }} />
    </div>
  )
}
