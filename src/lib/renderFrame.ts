import {
  COLORS,
  drawCoverImage,
  dashedCircle,
  palmBadge,
  loadImage,
  drawDualColorPalmTree,
  drawBeachWave,
  drawGoaSunset,
  drawSparkleStar,
  drawSurfboardsPair,
  drawGoanScooter,
  drawTornTapeBadge,
  drawHackerHouseGoaLogo,
  roundRect,
} from './canvasRenderer'
import type { BuilderState } from '../types'

export async function renderFrame(canvas: HTMLCanvasElement, state: BuilderState) {
  const scale = 2
  const logicalSize = 640
  const targetSize = logicalSize * scale

  if (canvas.width !== targetSize) canvas.width = targetSize
  if (canvas.height !== targetSize) canvas.height = targetSize

  const offscreen = document.createElement('canvas')
  offscreen.width = targetSize
  offscreen.height = targetSize

  const ctx = offscreen.getContext('2d')
  if (!ctx) return

  ctx.save()
  ctx.scale(scale, scale)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const size = logicalSize

  // Vibrant Goa Beach Sky Gradient (Emerald to Sand Cream)
  const bgGradient = ctx.createLinearGradient(0, 0, 0, size)
  bgGradient.addColorStop(0, COLORS.emeraldDark)
  bgGradient.addColorStop(0.35, COLORS.emerald)
  bgGradient.addColorStop(0.7, COLORS.sandCream)
  bgGradient.addColorStop(1, '#FFFFFF')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, size, size)

  // Golden Goa Sunset Disk at Top Horizon
  drawGoaSunset(ctx, size / 2, 70, 48, COLORS.amberGold, COLORS.amberGold)

  // Top Header Logo Banner: Official Goa Hacker House Logo (hhgoa.com)
  drawHackerHouseGoaLogo(ctx, size / 2 - 135, 12, 270, 42)

  // Yellow Torn Paper Badge ("VERIFIED!" - matching Image 1)
  drawTornTapeBadge(ctx, 85, 24, 'VERIFIED! ✦')

  // Tall Goa Beach Palm Trees on Left and Right Sides
  drawDualColorPalmTree(ctx, 50, 40, 1.4, COLORS.emeraldDark, COLORS.amberGold)
  drawDualColorPalmTree(ctx, size - 50, 40, 1.4, COLORS.emeraldDark, COLORS.amberGold)

  // Standing Dual Surfboards (Yellow & Hot Pink)
  drawSurfboardsPair(ctx, 60, size - 130, 0.95)

  // Vintage Pink Goan Scooter / Vespa
  drawGoanScooter(ctx, size - 70, size - 130, 1.1)

  // Ocean Beach Waves & Sparkles
  drawBeachWave(ctx, 30, 140, 120, 8, COLORS.amberGold)
  drawBeachWave(ctx, size - 150, 140, 120, 8, COLORS.amberGold)
  drawBeachWave(ctx, 20, 360, 100, 6, COLORS.hotPink)
  drawBeachWave(ctx, size - 120, 360, 100, 6, COLORS.hotPink)

  drawSparkleStar(ctx, 130, 80, 8, COLORS.amberGold)
  drawSparkleStar(ctx, size - 130, 80, 8, COLORS.amberGold)
  drawSparkleStar(ctx, 80, 180, 6, COLORS.hotPink)
  drawSparkleStar(ctx, size - 80, 180, 6, COLORS.hotPink)

  // PERFECT GEOMETRY: RADIUS 178px & CENTER Y 285px TO PREVENT CUTOFF AT BOTTOM
  const circleR = 178
  const cx = size / 2
  const cy = 285

  const photos =
    state.mode === 'solo' ? [state.photos[0]].filter(Boolean) : state.photos.filter(Boolean)

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, circleR, 0, Math.PI * 2)
  ctx.clip()

  if (photos.length === 0) {
    ctx.fillStyle = COLORS.emeraldDark
    ctx.fillRect(cx - circleR, cy - circleR, circleR * 2, circleR * 2)
  } else if (photos.length === 1) {
    const img = await loadImage(photos[0] as string)
    const pos = state.photoPositions[0] || { x: 0, y: 0, zoom: 1 }
    drawCoverImage(ctx, img, cx - circleR, cy - circleR, circleR * 2, circleR * 2, pos.x, pos.y, pos.zoom)
  } else {
    const cols = photos.length <= 2 ? photos.length : 2
    const rows = Math.ceil(photos.length / cols)
    const cellW = (circleR * 2) / cols
    const cellH = (circleR * 2) / rows
    for (let i = 0; i < photos.length; i++) {
      const img = await loadImage(photos[i] as string)
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = cx - circleR + col * cellW
      const y = cy - circleR + row * cellH
      const pos = state.photoPositions[i] || { x: 0, y: 0, zoom: 1 }
      drawCoverImage(ctx, img, x, y, cellW, cellH, pos.x, pos.y, pos.zoom)
    }
  }
  ctx.restore()

  // Frame Circle Accents
  dashedCircle(ctx, cx, cy, circleR + 6, COLORS.hotPink, [12, 8])
  palmBadge(ctx, cx + circleR * 0.78, cy - circleR * 0.78, size * 0.055)

  // Bottom Wave Divider under Photo Circle
  drawBeachWave(ctx, cx - 150, cy + circleR + 14, 300, 8, COLORS.amberGold)

  // --- BUILDER NAME & ROLE (HIGH-CONTRAST, PROMINENT, NEVER CUT OFF) ---
  ctx.textAlign = 'center'

  // 1. Builder Name (Ultra-Bold Crisp Deep Dark Emerald Text)
  ctx.fillStyle = COLORS.emeraldDark
  ctx.font = `900 32px 'Playfair Display', Georgia, serif`
  ctx.fillText(state.name || 'Your Name', cx, cy + circleR + 56)

  // 2. Role / Builder Class (Hot Pink Pill Badge)
  const roleText = (state.builderClass || 'Goa Wildcard Builder').toUpperCase()
  ctx.font = `800 13px 'Inter', sans-serif`
  const roleWidth = ctx.measureText(roleText).width
  const badgeW = Math.max(190, roleWidth + 28)
  const badgeH = 28
  const badgeX = (size - badgeW) / 2
  const badgeY = cy + circleR + 72

  ctx.fillStyle = COLORS.hotPink
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 14)
  ctx.fill()
  ctx.strokeStyle = COLORS.amberGold
  ctx.lineWidth = 1.5
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 14)
  ctx.stroke()

  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(roleText, cx, badgeY + 19)

  ctx.restore()

  const targetCtx = canvas.getContext('2d')
  if (targetCtx) {
    targetCtx.clearRect(0, 0, targetSize, targetSize)
    targetCtx.drawImage(offscreen, 0, 0)
  }
}
