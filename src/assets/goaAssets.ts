// Helper module that generates crisp Data URIs for the Beach Sunset Background and Hacker House Goa Logo

function createLogoDataUrl(): string {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 300
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Deep Emerald Green Banner Background
  ctx.fillStyle = '#0D6E43'
  ctx.fillRect(0, 0, 1200, 300)

  // Gold Inner Border
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 8
  ctx.strokeRect(6, 6, 1188, 288)

  // Tall Golden Serif "HACKER  HOUSE"
  ctx.fillStyle = '#052E1C'
  ctx.font = `900 190px 'Playfair Display', Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HACKER        HOUSE', 604, 154)

  ctx.fillStyle = '#FFD700'
  ctx.fillText('HACKER        HOUSE', 600, 150)

  // Center Hot Pink Overlay Badge ("गोवा" in yellow Hindi script)
  const badgeW = 280
  const badgeH = 170
  const badgeX = (1200 - badgeW) / 2
  const badgeY = (300 - badgeH) / 2

  ctx.fillStyle = '#E91467'
  ctx.beginPath()
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18)
  ctx.fill()
  ctx.strokeStyle = '#FFFF00'
  ctx.lineWidth = 5
  ctx.stroke()

  ctx.fillStyle = '#FFFF00'
  ctx.font = `900 110px sans-serif`
  ctx.fillText('गोवा', 600, 155)

  return canvas.toDataURL('image/png')
}

import { drawGoaBeachIllustrationBackground } from '../lib/canvasRenderer'

function createBeachBgDataUrl(): string {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = 960
  canvas.height = 1520
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  drawGoaBeachIllustrationBackground(ctx, 960, 1520)
  return canvas.toDataURL('image/jpeg', 0.92)
}

let cachedLogo: string | null = null
let cachedBg: string | null = null

export function getLogoDataUrl(): string {
  if (!cachedLogo) cachedLogo = createLogoDataUrl()
  return cachedLogo
}

export function getBeachBgDataUrl(): string {
  if (!cachedBg) cachedBg = createBeachBgDataUrl()
  return cachedBg
}
