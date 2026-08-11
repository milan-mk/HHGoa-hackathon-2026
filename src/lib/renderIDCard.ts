import QRCode from 'qrcode'
import {
  drawCoverImage,
  roundRect,
  idHash,
  loadImage,
  drawDualColorPalmTree,
  drawBeachWave,
  drawGoaSunset,
  drawSparkleStar,
  drawSurfboardsPair,
  drawGoanScooter,
  drawGoanVilla,
  drawTornTapeBadge,
  drawHackerHouseGoaLogo,
  COLORS,
} from './canvasRenderer'
import type { BuilderState, CardTheme } from '../types'

interface ThemeColors {
  headerBgStart: string
  headerBgEnd: string
  cardBg: string
  cardBorder: string
  textPrimary: string
  textSecondary: string
  accent: string
  badgeBg: string
  badgeText: string
  chipBg: string
  chipText: string
  qrDark: string
  qrLight: string
  iconColor: string
  sunColor: string
}

const THEMES: Record<CardTheme, ThemeColors> = {
  emerald: {
    headerBgStart: '#072E1C',
    headerBgEnd: '#0D6E43',
    cardBg: '#FFFDF5',
    cardBorder: '#D4C49E',
    textPrimary: '#052416',
    textSecondary: '#4A422D',
    accent: '#E91467',
    badgeBg: '#E91467',
    badgeText: '#FFFFFF',
    chipBg: '#0D6E43',
    chipText: '#FFC72C',
    qrDark: '#072E1C',
    qrLight: '#FFFFFF',
    iconColor: '#FFC72C',
    sunColor: '#FFC72C',
  },
  sunset: {
    headerBgStart: '#E91467',
    headerBgEnd: '#D946EF',
    cardBg: '#0F172A',
    cardBorder: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accent: '#00F0FF',
    badgeBg: '#00F0FF',
    badgeText: '#0F172A',
    chipBg: '#1E293B',
    chipText: '#38BDF8',
    qrDark: '#0F172A',
    qrLight: '#FFFFFF',
    iconColor: '#FFC72C',
    sunColor: '#FFC72C',
  },
  midnight: {
    headerBgStart: '#1E1B18',
    headerBgEnd: '#332D27',
    cardBg: '#121212',
    cardBorder: '#3D3429',
    textPrimary: '#FAF5E4',
    textSecondary: '#A39985',
    accent: '#FFC72C',
    badgeBg: '#FFC72C',
    badgeText: '#121212',
    chipBg: '#26221D',
    chipText: '#FFC72C',
    qrDark: '#121212',
    qrLight: '#FAF5E4',
    iconColor: '#FFC72C',
    sunColor: '#FFC72C',
  },
  solana: {
    headerBgStart: '#9945FF',
    headerBgEnd: '#14F195',
    cardBg: '#0D1117',
    cardBorder: '#21262D',
    textPrimary: '#F0F6FC',
    textSecondary: '#8B949E',
    accent: '#14F195',
    badgeBg: '#14F195',
    badgeText: '#0D1117',
    chipBg: '#161B22',
    chipText: '#14F195',
    qrDark: '#0D1117',
    qrLight: '#FFFFFF',
    iconColor: '#14F195',
    sunColor: '#FFC72C',
  },
}

const qrCache = new Map<string, HTMLImageElement>()

async function getCachedQR(url: string, dark: string, light: string): Promise<HTMLImageElement> {
  const cacheKey = `${url}_${dark}_${light}`
  if (qrCache.has(cacheKey)) {
    return qrCache.get(cacheKey)!
  }
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    color: { dark, light },
  })
  const img = await loadImage(qrDataUrl)
  qrCache.set(cacheKey, img)
  return img
}

export async function renderIDCard(canvas: HTMLCanvasElement, state: BuilderState) {
  const scale = 2
  const logicalW = 480
  const logicalH = 760
  const targetW = logicalW * scale
  const targetH = logicalH * scale

  if (canvas.width !== targetW) canvas.width = targetW
  if (canvas.height !== targetH) canvas.height = targetH

  const offscreen = document.createElement('canvas')
  offscreen.width = targetW
  offscreen.height = targetH

  const ctx = offscreen.getContext('2d')
  if (!ctx) return

  ctx.save()
  ctx.scale(scale, scale)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const theme = THEMES[state.cardTheme] || THEMES.emerald
  const w = logicalW
  const h = logicalH

  // Main Background Card Body
  ctx.fillStyle = theme.cardBg
  roundRect(ctx, 0, 0, w, h, 28)
  ctx.fill()

  ctx.save()
  roundRect(ctx, 0, 0, w, h, 28)
  ctx.clip()

  // Outer Border Line
  ctx.strokeStyle = theme.cardBorder
  ctx.lineWidth = 4
  roundRect(ctx, 2, 2, w - 4, h - 4, 26)
  ctx.stroke()

  // Header Gradient Banner (Goa Beach Style)
  const headerGradient = ctx.createLinearGradient(0, 0, 0, 150)
  headerGradient.addColorStop(0, theme.headerBgStart)
  headerGradient.addColorStop(1, theme.headerBgEnd)
  ctx.fillStyle = headerGradient
  ctx.fillRect(0, 0, w, 150)

  // Golden Sunset Disk & Rays in Header Center
  drawGoaSunset(ctx, w / 2, 42, 26, theme.sunColor, theme.sunColor)

  // Lanyard Slot Cutout Graphic
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
  roundRect(ctx, w / 2 - 35, 10, 70, 10, 5)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Yellow Torn Paper Tape Badge ("VERIFIED! ✦")
  drawTornTapeBadge(ctx, 78, 24, 'VERIFIED! ✦')

  // Header Dual-Color Palm Trees on Left and Right
  drawDualColorPalmTree(ctx, 24, 25, 0.95, COLORS.emeraldDark, theme.sunColor)
  drawDualColorPalmTree(ctx, w - 24, 25, 0.95, COLORS.emeraldDark, theme.sunColor)

  // --- TOP LOGO: OFFICIAL GOA HACKER HOUSE LOGO BANNER ---
  drawHackerHouseGoaLogo(ctx, w / 2 - 135, 68, 270, 44)

  // Subtitle Pass Label under Logo
  ctx.fillStyle = theme.sunColor
  ctx.font = `800 11px 'JetBrains Mono', monospace`
  ctx.textAlign = 'center'
  ctx.fillText('🌴 OFFICIAL BUILDER PASS 🌴', w / 2, 134)

  // Verified Status Indicator Dot & Label
  ctx.fillStyle = '#10B981'
  ctx.beginPath()
  ctx.arc(36, 112, 4.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `800 9px 'JetBrains Mono', monospace`
  ctx.textAlign = 'left'
  ctx.fillText('VERIFIED', 45, 115)

  // --- TROPICAL THEME SIDEWAYS VIBRANT VECTOR ICONS ---
  // Left Margin Icons:
  drawDualColorPalmTree(ctx, 24, 195, 0.85, theme.chipBg, theme.iconColor)
  drawSurfboardsPair(ctx, 26, 310, 0.7) // Standing Dual Surfboards
  drawGoanScooter(ctx, 26, 430, 0.75) // Pink Goan Scooter / Vespa
  drawBeachWave(ctx, 10, 545, 45, 4, theme.accent)
  drawSparkleStar(ctx, 26, 655, 6, theme.accent)

  // Right Margin Icons:
  drawDualColorPalmTree(ctx, w - 24, 195, 0.85, theme.chipBg, theme.iconColor)
  drawGoanVilla(ctx, w - 28, 310, 0.6) // Pink Goan Villa House
  drawSurfboardsPair(ctx, w - 28, 430, 0.7) // Standing Dual Surfboards
  drawBeachWave(ctx, w - 55, 545, 45, 4, theme.accent)
  drawSparkleStar(ctx, w - 26, 655, 6, theme.accent)

  // Profile Photo Section (Centered)
  const photoSize = 170
  const px = (w - photoSize) / 2
  const py = 165

  ctx.save()
  roundRect(ctx, px, py, photoSize, photoSize, 20)
  ctx.clip()

  const photoIndex = state.photos.findIndex(Boolean)
  if (photoIndex !== -1 && state.photos[photoIndex]) {
    try {
      const img = await loadImage(state.photos[photoIndex] as string)
      const pos = state.photoPositions[photoIndex] || { x: 0, y: 0, zoom: 1 }
      drawCoverImage(ctx, img, px, py, photoSize, photoSize, pos.x, pos.y, pos.zoom)
    } catch {
      ctx.fillStyle = theme.headerBgStart
      ctx.fillRect(px, py, photoSize, photoSize)
    }
  } else {
    ctx.fillStyle = theme.headerBgStart
    ctx.fillRect(px, py, photoSize, photoSize)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `900 52px 'Playfair Display', serif`
    ctx.textAlign = 'center'
    ctx.fillText((state.name || 'B')[0].toUpperCase(), px + photoSize / 2, py + photoSize / 2 + 18)
  }
  ctx.restore()

  // Photo Accent Frame Border
  ctx.strokeStyle = theme.accent
  ctx.lineWidth = 3.5
  roundRect(ctx, px, py, photoSize, photoSize, 20)
  ctx.stroke()

  // Role Badge under photo (Hot Pink Badge with Crisp White Border)
  ctx.fillStyle = theme.badgeBg
  roundRect(ctx, px + 15, py + photoSize - 28, photoSize - 30, 24, 12)
  ctx.fill()
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  roundRect(ctx, px + 17, py + photoSize - 26, photoSize - 34, 20, 10)
  ctx.stroke()

  ctx.fillStyle = theme.badgeText
  ctx.font = `800 11px 'JetBrains Mono', monospace`
  ctx.textAlign = 'center'
  ctx.fillText('HACKER PASS 🌴', px + photoSize / 2, py + photoSize - 12)

  // --- BUILDER NAME & ROLE (HIGH-CONTRAST & PROMINENT VISIBILITY) ---
  ctx.textAlign = 'center'

  // 1. Builder Name (Ultra-Bold Crisp Deep Dark Emerald Text)
  ctx.fillStyle = theme.textPrimary
  ctx.font = `900 30px 'Playfair Display', Georgia, serif`
  const displayName = state.name || 'Your Name'
  const truncatedName = displayName.length > 20 ? displayName.slice(0, 20) + '...' : displayName
  ctx.fillText(truncatedName, w / 2, 380)

  // 2. Builder Class / Role Badge (High-Contrast Styled Pill Badge)
  const roleText = (state.builderClass || 'Goa Wildcard Builder').toUpperCase()
  ctx.font = `800 13px 'Inter', sans-serif`
  const roleTextWidth = ctx.measureText(roleText).width
  const roleBadgeW = Math.max(180, roleTextWidth + 28)
  const roleBadgeH = 28
  const roleBadgeX = (w - roleBadgeW) / 2
  const roleBadgeY = 398

  // Pill Badge Fill & Stroke
  ctx.fillStyle = COLORS.hotPink
  roundRect(ctx, roleBadgeX, roleBadgeY, roleBadgeW, roleBadgeH, 14)
  ctx.fill()
  ctx.strokeStyle = COLORS.amberGold
  ctx.lineWidth = 1.5
  roundRect(ctx, roleBadgeX, roleBadgeY, roleBadgeW, roleBadgeH, 14)
  ctx.stroke()

  // Role Text Inside Badge
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(roleText, w / 2, roleBadgeY + 19)

  // Skill Badges / Stack Chips (Max 5 items for clean spacing)
  const allSkills = state.selectedSkills.length > 0
    ? state.selectedSkills
    : state.stack ? state.stack.split(',').map(s => s.trim()) : ['Fullstack', 'Web3', 'AI']

  const skills = allSkills.slice(0, 5)

  ctx.font = `800 11px 'JetBrains Mono', monospace`
  const chipsWithWidth = skills.map(skill => ({
    skill,
    w: ctx.measureText(skill).width + 20,
  }))

  const totalSkillW = chipsWithWidth.reduce((acc, c) => acc + c.w + 6, -6)
  let skillStartX = (w - totalSkillW) / 2
  const skillY = 442

  chipsWithWidth.forEach(c => {
    ctx.fillStyle = theme.chipBg
    roundRect(ctx, skillStartX, skillY, c.w, 24, 7)
    ctx.fill()

    ctx.fillStyle = theme.chipText
    ctx.textAlign = 'left'
    ctx.fillText(c.skill, skillStartX + 10, skillY + 16)
    skillStartX += c.w + 6
  })

  // Scannable QR Code Section (Centered & High-Contrast)
  const qrBoxSize = 140
  const qrX = (w - qrBoxSize) / 2
  const qrY = 490

  try {
    const webUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0].split('#')[0] : 'https://hhgoa.com'
    const qrImg = await getCachedQR(webUrl, theme.qrDark, theme.qrLight)

    // QR Background Box
    ctx.fillStyle = theme.qrLight
    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 14)
    ctx.fill()

    ctx.strokeStyle = theme.cardBorder
    ctx.lineWidth = 2
    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 14)
    ctx.stroke()

    // Draw QR Image inside
    ctx.drawImage(qrImg, qrX + 8, qrY + 8, qrBoxSize - 16, qrBoxSize - 16)

    // Corner Bracket Highlights around QR
    ctx.strokeStyle = theme.accent
    ctx.lineWidth = 3
    const bracketSize = 12
    // Top-left
    ctx.beginPath()
    ctx.moveTo(qrX - 4, qrY - 4 + bracketSize)
    ctx.lineTo(qrX - 4, qrY - 4)
    ctx.lineTo(qrX - 4 + bracketSize, qrY - 4)
    ctx.stroke()
    // Top-right
    ctx.beginPath()
    ctx.moveTo(qrX + qrBoxSize + 4 - bracketSize, qrY - 4)
    ctx.lineTo(qrX + qrBoxSize + 4, qrY - 4)
    ctx.lineTo(qrX + qrBoxSize + 4, qrY - 4 + bracketSize)
    ctx.stroke()
    // Bottom-left
    ctx.beginPath()
    ctx.moveTo(qrX - 4, qrY + qrBoxSize + 4 - bracketSize)
    ctx.lineTo(qrX - 4, qrY + qrBoxSize + 4)
    ctx.lineTo(qrX - 4 + bracketSize, qrY + qrBoxSize + 4)
    ctx.stroke()
    // Bottom-right
    ctx.beginPath()
    ctx.moveTo(qrX + qrBoxSize + 4 - bracketSize, qrY + qrBoxSize + 4)
    ctx.lineTo(qrX + qrBoxSize + 4, qrY + qrBoxSize + 4)
    ctx.lineTo(qrX + qrBoxSize + 4, qrY + qrBoxSize + 4 - bracketSize)
    ctx.stroke()

    // QR Scan Label
    ctx.fillStyle = theme.textSecondary
    ctx.font = `800 10px 'JetBrains Mono', monospace`
    ctx.textAlign = 'center'
    ctx.fillText('SCAN FOR WEB APP 🌴', w / 2, qrY + qrBoxSize + 22)
  } catch (err) {
    console.error('Failed to generate QR code:', err)
  }

  // Bottom Footer Section
  ctx.setLineDash([6, 6])
  ctx.strokeStyle = theme.cardBorder
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(30, h - 50)
  ctx.lineTo(w - 30, h - 50)
  ctx.stroke()
  ctx.setLineDash([])

  // Footer Text
  ctx.fillStyle = theme.textSecondary
  ctx.font = `700 11px 'JetBrains Mono', monospace`
  ctx.textAlign = 'left'
  ctx.fillText(`ID-${idHash(state.name)} • 2026.11.08`, 30, h - 22)

  ctx.textAlign = 'right'
  ctx.fillText(`🌴 GOA, INDIA 🌊`, w - 30, h - 22)

  ctx.restore()
  ctx.restore()

  // Copy offscreen double buffer to target visible canvas atomically
  const targetCtx = canvas.getContext('2d')
  if (targetCtx) {
    targetCtx.clearRect(0, 0, targetW, targetH)
    targetCtx.drawImage(offscreen, 0, 0)
  }
}
