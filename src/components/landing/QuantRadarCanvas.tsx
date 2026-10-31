import { useEffect, useRef } from 'react'

export function QuantRadarCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let isVisible = true
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

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.05 },
    )
    observer.observe(canvas)

    // Interactive automation nodes
    const nodeCount = 38
    const nodes: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      pulse: number
      kind: string
    }[] = []

    const colors = ['#6366F1', '#818CF8', '#06B6D4', '#22D3EE', '#10B981', '#A855F7']
    const kinds = ['EMAIL', 'DISPATCH', 'SUPPORT', 'INVOICE', 'WEBHOOK']

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 2 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        kind: kinds[Math.floor(Math.random() * kinds.length)],
      })
    }

    let time = 0

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render)
        return
      }

      time += 0.02
      ctx.clearRect(0, 0, width, height)

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (!reducedMotion) {
          n.x += n.vx
          n.y += n.vy

          if (n.x < 0) n.x = width
          if (n.x > width) n.x = 0
          if (n.y < 0) n.y = height
          if (n.y > height) n.y = 0
        }

        // Connect nearby nodes with glowing data conduits
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const dx = n.x - n2.x
          const dy = n.y - n2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22
            ctx.beginPath()
            ctx.strokeStyle = n.color
            ctx.globalAlpha = alpha
            ctx.lineWidth = 1
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius + Math.sin(time + n.pulse) * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.shadowColor = n.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
