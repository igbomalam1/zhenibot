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

    // Handle visibility to save CPU/GPU cycles
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.05 },
    )
    observer.observe(canvas)

    let mouseX = width / 2
    let mouseY = height / 2
    let targetMouseX = mouseX
    let targetMouseY = mouseY

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseX = e.clientX - rect.left
      targetMouseY = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Synthetic execution nodes
    interface Node {
      x: number
      y: number
      radius: number
      pulse: number
      speed: number
      label: string
      yieldPct: string
    }

    const nodes: Node[] = [
      { x: 0.22, y: 0.35, radius: 3, pulse: 0, speed: 0.03, label: 'BTC/USDT', yieldPct: '+0.42%' },
      { x: 0.68, y: 0.25, radius: 3.5, pulse: 1.2, speed: 0.025, label: 'ETH/USDT', yieldPct: '+0.58%' },
      { x: 0.45, y: 0.72, radius: 2.8, pulse: 2.4, speed: 0.035, label: 'SOL/USDT', yieldPct: '+0.91%' },
      { x: 0.82, y: 0.65, radius: 3.2, pulse: 3.8, speed: 0.02, label: 'XAU/USD', yieldPct: '+0.36%' },
      { x: 0.15, y: 0.80, radius: 2.5, pulse: 4.5, speed: 0.04, label: 'NVDA/USD', yieldPct: '+0.64%' },
    ]

    let frame = 0

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render)
        return
      }

      frame += 0.015
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      ctx.clearRect(0, 0, width, height)

      // Draw faint architectural coordinate grid
      const gridSize = 48
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw mathematical volatility wave 1 (Primary Emerald Yield Stream)
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(0, 229, 153, 0.45)'
      ctx.lineWidth = 1.5

      const waveOffset = Math.sin(frame * 0.8) * 12
      for (let x = 0; x <= width; x += 4) {
        const nx = x / width
        const y =
          height * 0.52 +
          Math.sin(nx * 7 + frame * 1.5) * 22 +
          Math.cos(nx * 14 - frame * 0.8) * 12 +
          waveOffset * (1 - nx)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Volatility wave 2 (Secondary Telemetry Cobalt)
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)'
      ctx.lineWidth = 1
      for (let x = 0; x <= width; x += 6) {
        const nx = x / width
        const y =
          height * 0.52 +
          Math.cos(nx * 9 + frame * 1.2) * 28 +
          Math.sin(nx * 4 - frame * 0.5) * 16
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // High-frequency sweep scan line
      const sweepX = (frame * 120) % (width + 100) - 50
      const sweepGrad = ctx.createLinearGradient(sweepX - 40, 0, sweepX, 0)
      sweepGrad.addColorStop(0, 'rgba(0, 229, 153, 0)')
      sweepGrad.addColorStop(1, 'rgba(0, 229, 153, 0.15)')
      ctx.fillStyle = sweepGrad
      ctx.fillRect(sweepX - 40, 0, 40, height)

      ctx.strokeStyle = 'rgba(0, 229, 153, 0.6)'
      ctx.beginPath()
      ctx.moveTo(sweepX, 0)
      ctx.lineTo(sweepX, height)
      ctx.stroke()

      // Render execution nodes
      nodes.forEach((node) => {
        node.pulse += node.speed
        const px = node.x * width + Math.sin(frame + node.pulse) * 6
        const py = node.y * height + Math.cos(frame * 0.8 + node.pulse) * 6

        // Ping ring
        const ringSize = (node.pulse % 2.5) * 10 + node.radius
        const ringAlpha = Math.max(0, 1 - (node.pulse % 2.5) / 2.5) * 0.4
        ctx.strokeStyle = `rgba(0, 229, 153, ${ringAlpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(px, py, ringSize, 0, Math.PI * 2)
        ctx.stroke()

        // Core dot
        ctx.fillStyle = '#00e599'
        ctx.beginPath()
        ctx.arc(px, py, node.radius, 0, Math.PI * 2)
        ctx.fill()

        // Node label and yield tag
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
        ctx.fillText(node.label, px + 8, py - 4)

        ctx.font = 'bold 9px "JetBrains Mono", monospace'
        ctx.fillStyle = '#00e599'
        ctx.fillText(node.yieldPct, px + 8, py + 8)
      })

      if (!reducedMotion) {
        animId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}
