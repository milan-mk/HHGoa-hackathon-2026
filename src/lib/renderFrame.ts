import {
  COLORS,
  drawCoverImage,
  dashedCircle,
  palmBadge,
  loadImage,
  drawDualColorPalmTree,
  drawBeachWave,
  drawSparkleStar,
  drawSurfboardsPair,
  drawGoanScooter,
  drawTornTapeBadge,
  drawHackerHouseGoaLogo,
  drawGoaBeachIllustrationBackground,
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

  // Draw vector illustration background (matching uploaded image)
  drawGoaBeachIllustrationBackground(ctx, size, size)

  // Top Header Logo Banner: Official Goa Hacker House Logo
  drawHackerHouseGoaLogo(ctx, size / 2 - 135, 12, 270, 42)

  // Yellow Torn Paper Badge ("VERIFIED!")
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

  // --- BUILDER NAME & ROLE (WITH PADDED BLURRY WHITE BACKGROUNDS) ---
  ctx.textAlign = 'center'

  // 1. Builder Name with Blurry White Padded Container Box
  const nameText = state.name || 'Your Name'
  ctx.font = `900 28px 'Playfair Display', Georgia, serif`
  const nameWidth = ctx.measureText(nameText).width
  const nameBoxW = Math.min(size - 80, Math.max(200, nameWidth + 40))
  const nameBoxH = 44
  const nameBoxX = (size - nameBoxW) / 2
  const nameBoxY = cy + circleR + 32

  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
  roundRect(ctx, nameBoxX, nameBoxY, nameBoxW, nameBoxH, 22)
  ctx.fill()
  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 2
  roundRect(ctx, nameBoxX, nameBoxY, nameBoxW, nameBoxH, 22)
  ctx.stroke()

  ctx.fillStyle = COLORS.emeraldDark
  ctx.fillText(nameText, cx, nameBoxY + 31)

  // 2. Role / Builder Class (Hot Pink Pill Badge)
  const roleText = (state.builderClass || 'Goa Wildcard Builder').toUpperCase()
  ctx.font = `800 13px 'Inter', sans-serif`
  const roleWidth = ctx.measureText(roleText).width
  const badgeW = Math.max(190, roleWidth + 28)
  const badgeH = 28
  const badgeX = (size - badgeW) / 2
  const badgeY = nameBoxY + nameBoxH + 12

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
