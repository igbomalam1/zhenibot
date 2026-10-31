import { useEffect, useRef } from 'react'

export function QuantRadarCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Calm architectural grid points
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const gridSize = 48
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'

      for (let x = 24; x < width; x += gridSize) {
        for (let y = 24; y < height; y += gridSize) {
          ctx.beginPath()
          ctx.arc(x, y, 0.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    draw()
    if (!reducedMotion) {
      // Static architectural grid doesn't need 60fps churn
      animId = window.setTimeout(draw, 1000)
    }

    return () => {
      window.clearTimeout(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
