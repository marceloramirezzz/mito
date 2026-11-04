import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Quest } from '../content'

const W = 512
const H = 736
const RADIUS = 34
const PALETTES = [
  ['#ff3d17', '#ffc400'],
  ['#0b5fe0', '#a9e3f5'],
  ['#f0c8f6', '#6f5a48'],
  ['#ffc400', '#6f5a48'],
  ['#ff3d17', '#f0c8f6'],
]

function surface(paint: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.beginPath()
  ctx.roundRect(0, 0, W, H, RADIUS)
  ctx.clip()
  paint(ctx)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

export function questTexture(quest: Quest, index: number) {
  const [accent, second] = PALETTES[index % PALETTES.length]
  return surface((ctx) => {
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.arc(W / 2, 74, 34, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = second
    ctx.beginPath()
    ctx.arc(W / 2, 74, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#8e8e93'
    ctx.font = '500 20px "Inter Variable", sans-serif'
    ctx.fillText(quest.category, 36, 152)

    ctx.fillStyle = '#050505'
    ctx.font = '800 50px "Inter Variable", sans-serif'
    let y = 214
    for (const line of wrap(ctx, quest.text, W - 72)) {
      ctx.fillText(line, 36, y)
      y += 56
    }

    ctx.fillStyle = '#6e6e73'
    ctx.font = '400 21px "Inter Variable", sans-serif'
    y += 10
    for (const line of wrap(ctx, quest.body, W - 72)) {
      ctx.fillText(line, 36, y)
      y += 29
    }

    PALETTES.slice(0, 4).forEach(([color], i) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(62 + i * 56, H - 54, 20, 0, Math.PI * 2)
      ctx.fill()
    })
  })
}

const PATTERNS: ((ctx: CanvasRenderingContext2D, a: string, b: string) => void)[] = [
  // Diamonds
  (ctx, a, b) => {
    ctx.fillStyle = a
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = b
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 7; x++) {
        const cx = x * 92 + (y % 2) * 46
        const cy = y * 92
        ctx.beginPath()
        ctx.moveTo(cx, cy - 38)
        ctx.lineTo(cx + 38, cy)
        ctx.lineTo(cx, cy + 38)
        ctx.lineTo(cx - 38, cy)
        ctx.fill()
      }
    }
  },
  // Half-circle scales
  (ctx, a, b) => {
    ctx.fillStyle = a
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = b
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 6; x++) {
        ctx.beginPath()
        ctx.arc(x * 102 + (y % 2) * 51, y * 92, 42, 0, Math.PI)
        ctx.fill()
      }
    }
  },
  // Rising sun over bars
  (ctx, a, b) => {
    ctx.fillStyle = a
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = b
    ctx.beginPath()
    ctx.arc(W / 2, H * 0.42, 150, 0, Math.PI * 2)
    ctx.fill()
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(0, H * 0.62 + i * 56, W, 28)
    }
  },
  // Stacked chevrons
  (ctx, a, b) => {
    ctx.fillStyle = a
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = b
    ctx.lineWidth = 42
    for (let i = -1; i < 9; i++) {
      ctx.beginPath()
      ctx.moveTo(-20, i * 100 + 90)
      ctx.lineTo(W / 2, i * 100)
      ctx.lineTo(W + 20, i * 100 + 90)
      ctx.stroke()
    }
  },
]

export function patternTexture(index: number) {
  const [a, b] = PALETTES[index % PALETTES.length]
  return surface((ctx) => PATTERNS[index % PATTERNS.length](ctx, a, b))
}
