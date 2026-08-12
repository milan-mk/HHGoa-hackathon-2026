export const COLORS = {
  emeraldDark: '#0A3F27',
  emerald: '#0D6E43',
  emeraldLight: '#16A34A',
  amberGold: '#FFC72C',
  amberSun: '#F59E0B',
  hotPink: '#E91467',
  magenta: '#D946EF',
  oceanTeal: '#0D9488',
  sandCream: '#FDFBF5',
  cardWhite: '#FFFFFF',
  inkDark: '#072E1C',
  skyBlue: '#2563EB',
  skyPink: '#F472B6',
  sunYellow: '#FFF176',
  // Backwards compatibility aliases
  cream: '#FDFBF5',
  green: '#0D6E43',
  greenDark: '#0A3F27',
  pink: '#E91467',
  amber: '#FFC72C',
  ink: '#072E1C',
}

const imageCache = new Map<string, HTMLImageElement>()

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (!src) return Promise.reject(new Error('No src provided'))
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached)
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(src, img)
      resolve(img)
    }
    img.onerror = reject
    img.src = src
  })
}

export function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  offsetX = 0,
  offsetY = 0,
  zoom = 1
) {
  const safeZoom = Math.max(1, zoom || 1)
  const imgRatio = img.width / img.height
  const boxRatio = w / h
  let baseW: number, baseH: number

  if (imgRatio > boxRatio) {
    baseH = img.height
    baseW = baseH * boxRatio
  } else {
    baseW = img.width
    baseH = baseW / boxRatio
  }

  const sw = baseW / safeZoom
  const sh = baseH / safeZoom

  const defaultSx = (img.width - sw) / 2
  const defaultSy = (img.height - sh) / 2

  const slackX = (img.width - sw) / 2
  const slackY = (img.height - sh) / 2

  let sx = defaultSx - offsetX * (slackX > 0 ? slackX : sw * 0.4)
  let sy = defaultSy - offsetY * (slackY > 0 ? slackY : sh * 0.4)

  const maxSx = Math.max(0, img.width - sw)
  const maxSy = Math.max(0, img.height - sh)

  sx = Math.max(0, Math.min(maxSx, sx))
  sy = Math.max(0, Math.min(maxSy, sy))

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

export function dashedCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  dash: number[]
) {
  ctx.save()
  ctx.setLineDash(dash)
  ctx.lineWidth = 4
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

export function palmBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save()
  ctx.fillStyle = COLORS.amberGold
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = COLORS.emeraldDark
  ctx.font = `${r * 1.1}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('\u{1F334}', cx, cy + r * 0.05)
  ctx.restore()
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ')
  let line = ''
  let curY = y
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY)
      line = word + ' '
      curY += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, curY)
}

export function idHash(name: string): string {
  if (!name) return '0000'
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return String(h).slice(0, 4)
}

// --- OFFICIAL HACKER HOUSE GOA LOGO BANNER (MATCHING IMAGE 2) ---

export function drawHackerHouseGoaLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save()
  ctx.translate(x, y)

  // 1. Deep Emerald Green Banner Background Bar
  ctx.fillStyle = '#0D6E43'
  roundRect(ctx, 0, 0, w, h, 8)
  ctx.fill()
  ctx.strokeStyle = '#FFC72C'
  ctx.lineWidth = 2
  roundRect(ctx, 1, 1, w - 2, h - 2, 7)
  ctx.stroke()

  const fontScale = h * 0.72
  ctx.font = `900 ${fontScale}px 'Playfair Display', Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Shadow for golden text
  ctx.fillStyle = '#052416'
  ctx.fillText('HACKER      HOUSE', w / 2 + 1.5, h / 2 + 1.5)

  // Tall Golden Yellow Serif Typography ("HACKER  HOUSE")
  ctx.fillStyle = '#FFC72C'
  ctx.fillText('HACKER      HOUSE', w / 2, h / 2)

  // 2. Center Hot Pink Overlay Badge ("गोवा" in yellow Hindi / Devanagari script)
  const badgeW = h * 0.9
  const badgeH = h * 0.75
  const badgeX = (w - badgeW) / 2
  const badgeY = (h - badgeH) / 2

  ctx.fillStyle = '#E91467'
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 6)
  ctx.fill()
  ctx.strokeStyle = '#FFFF00'
  ctx.lineWidth = 1.5
  roundRect(ctx, badgeX + 1, badgeY + 1, badgeW - 2, badgeH - 2, 5)
  ctx.stroke()

  // Devanagari "गोवा" text in bright yellow
  ctx.fillStyle = '#FFFF00'
  ctx.font = `900 ${h * 0.45}px sans-serif`
  ctx.fillText('गोवा', w / 2, h / 2 + 1)

  ctx.restore()
}

// --- GOA BEACH & ISOMETRIC VILLA VECTOR ILLUSTRATION BACKGROUND (MATCHING USER IMAGE) ---

export function drawBeachUmbrella(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  c1: string,
  c2: string,
  strokeColor: string
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = Math.max(1.5, r * 0.1)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, r * 1.8)
  ctx.stroke()

  ctx.fillStyle = c1
  ctx.beginPath()
  ctx.arc(0, 0, r, Math.PI, 0)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = c2
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, r, Math.PI * 0.8, Math.PI * 0.6, true)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, r, Math.PI * 0.4, Math.PI * 0.2, true)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

export function drawLoungeChair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  color: string,
  strokeColor: string
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = color
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = Math.max(1.2, w * 0.05)

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(w * 0.3, w * 0.2)
  ctx.lineTo(w, w * 0.2)
  ctx.lineTo(w, w * 0.35)
  ctx.lineTo(w * 0.25, w * 0.35)
  ctx.lineTo(-w * 0.05, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(w * 0.1, w * 0.35)
  ctx.lineTo(w * 0.1, w * 0.6)
  ctx.moveTo(w * 0.8, w * 0.35)
  ctx.lineTo(w * 0.8, w * 0.6)
  ctx.stroke()

  ctx.restore()
}

export function drawStandingSurfboard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  strokeColor: string
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = color
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = Math.max(1.2, w * 0.08)

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(w, h * 0.3, w * 0.8, h * 0.8)
  ctx.quadraticCurveTo(0, h, -w * 0.8, h * 0.8)
  ctx.quadraticCurveTo(-w, h * 0.3, 0, 0)
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

export function drawWalkingFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1.5, w * 0.2)
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.arc(0, 0, h * 0.15, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, h * 0.15)
  ctx.lineTo(0, h * 0.6)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, h * 0.6)
  ctx.lineTo(-w * 0.5, h)
  ctx.moveTo(0, h * 0.6)
  ctx.lineTo(w * 0.5, h * 0.95)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, h * 0.3)
  ctx.lineTo(-w * 0.4, h * 0.55)
  ctx.moveTo(0, h * 0.3)
  ctx.lineTo(w * 0.4, h * 0.45)
  ctx.stroke()

  ctx.restore()
}

export function drawIsometricVilla(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  roofColor = '#16A34A',
  wallColor = '#86EFAC',
  stripeColor = '#FFFFFF',
  windowColor = '#FACC15',
  strokeColor = '#0B3822'
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.lineWidth = Math.max(1.2, w * 0.015)
  ctx.strokeStyle = strokeColor
  ctx.lineJoin = 'round'

  ctx.fillStyle = wallColor
  ctx.beginPath()
  ctx.moveTo(0, h * 0.4)
  ctx.lineTo(w * 0.45, h * 0.25)
  ctx.lineTo(w * 0.45, h * 0.85)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#15803D'
  ctx.beginPath()
  ctx.moveTo(w * 0.45, h * 0.25)
  ctx.lineTo(w * 0.9, h * 0.4)
  ctx.lineTo(w * 0.9, h)
  ctx.lineTo(w * 0.45, h * 0.85)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = roofColor
  ctx.beginPath()
  ctx.moveTo(0, h * 0.4)
  ctx.lineTo(w * 0.22, h * 0.1)
  ctx.lineTo(w * 0.45, h * 0.25)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = roofColor
  ctx.beginPath()
  ctx.moveTo(w * 0.22, h * 0.1)
  ctx.lineTo(w * 0.7, h * 0.22)
  ctx.lineTo(w * 0.9, h * 0.4)
  ctx.lineTo(w * 0.45, h * 0.25)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = stripeColor
  ctx.lineWidth = Math.max(1, w * 0.01)
  for (let i = 1; i <= 4; i++) {
    const t = i / 5
    const rx1 = w * 0.22 + w * 0.48 * t
    const ry1 = h * 0.1 + h * 0.12 * t
    const rx2 = w * 0.45 + w * 0.45 * t
    const ry2 = h * 0.25 + h * 0.15 * t
    ctx.beginPath()
    ctx.moveTo(rx1, ry1)
    ctx.lineTo(rx2, ry2)
    ctx.stroke()
  }

  ctx.fillStyle = windowColor
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = Math.max(1, w * 0.01)

  ctx.fillRect(w * 0.1, h * 0.48, w * 0.12, h * 0.16)
  ctx.strokeRect(w * 0.1, h * 0.48, w * 0.12, h * 0.16)

  ctx.fillRect(w * 0.26, h * 0.42, w * 0.12, h * 0.16)
  ctx.strokeRect(w * 0.26, h * 0.42, w * 0.12, h * 0.16)

  ctx.fillStyle = strokeColor
  ctx.beginPath()
  ctx.arc(w * 0.22, h * 0.26, w * 0.05, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

export function drawColonialVilla(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  wallColor = '#FFFFFF',
  doorColor = '#064E3B',
  balconyColor = '#FACC15',
  strokeColor = '#0B3822',
  hasPinkShutters = false,
  pinkColor = '#E91467'
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.lineWidth = Math.max(1.2, w * 0.015)
  ctx.strokeStyle = strokeColor

  ctx.fillStyle = wallColor
  ctx.fillRect(0, 0, w, h)
  ctx.strokeRect(0, 0, w, h)

  ctx.fillStyle = doorColor
  ctx.fillRect(w * 0.3, h * 0.6, w * 0.4, h * 0.4)

  const shutterColor = hasPinkShutters ? pinkColor : doorColor
  ctx.fillStyle = shutterColor
  ctx.fillRect(w * 0.15, h * 0.15, w * 0.3, h * 0.35)
  ctx.fillRect(w * 0.55, h * 0.15, w * 0.3, h * 0.35)
  ctx.strokeRect(w * 0.15, h * 0.15, w * 0.3, h * 0.35)
  ctx.strokeRect(w * 0.55, h * 0.15, w * 0.3, h * 0.35)

  ctx.strokeStyle = balconyColor
  ctx.lineWidth = Math.max(1, w * 0.008)
  for (let i = 1; i <= 4; i++) {
    const sy = h * 0.15 + i * (h * 0.07)
    ctx.beginPath()
    ctx.moveTo(w * 0.17, sy)
    ctx.lineTo(w * 0.43, sy)
    ctx.moveTo(w * 0.57, sy)
    ctx.lineTo(w * 0.83, sy)
    ctx.stroke()
  }

  ctx.fillStyle = balconyColor
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = Math.max(1.2, w * 0.012)

  ctx.beginPath()
  ctx.rect(-w * 0.05, h * 0.45, w * 1.1, h * 0.06)
  ctx.fill()
  ctx.stroke()

  for (let i = 0; i <= 6; i++) {
    const bx = -w * 0.03 + i * ((w * 1.06) / 6)
    ctx.beginPath()
    ctx.moveTo(bx, h * 0.45)
    ctx.lineTo(bx, h * 0.56)
    ctx.stroke()
  }

  ctx.restore()
}

export function drawPalmTreeArt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  leafColor = '#166534',
  stemColor = '#FACC15',
  strokeColor = '#0B3822'
) {
  ctx.save()
  ctx.translate(x, y)

  ctx.strokeStyle = leafColor
  ctx.lineWidth = Math.max(2, w * 0.08)
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.moveTo(0, h)
  ctx.quadraticCurveTo(-w * 0.3, h * 0.5, -w * 0.1, 0)
  ctx.stroke()

  ctx.strokeStyle = stemColor
  ctx.lineWidth = Math.max(1, w * 0.03)
  ctx.beginPath()
  ctx.moveTo(w * 0.02, h)
  ctx.quadraticCurveTo(-w * 0.28, h * 0.5, -w * 0.08, 0)
  ctx.stroke()

  ctx.fillStyle = leafColor
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = Math.max(1, w * 0.02)

  const leafAngles = [-1.3, -0.7, -0.2, 0.3, 0.8, 1.3]
  leafAngles.forEach((ang) => {
    ctx.save()
    ctx.translate(-w * 0.1, 0)
    ctx.rotate(ang)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(w * 0.5, -h * 0.15, w * 0.9, 0)
    ctx.quadraticCurveTo(w * 0.5, h * 0.12, 0, 0)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  })

  ctx.restore()
}

export function drawGeometricHHGLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color = '#166534'
) {
  ctx.save()
  ctx.translate(x, y)

  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(2.5, h * 0.14)
  ctx.lineCap = 'square'
  ctx.lineJoin = 'miter'

  const charW = w * 0.28
  const charGap = w * 0.08

  // First H
  const h1X = 0
  ctx.beginPath()
  ctx.moveTo(h1X, 0)
  ctx.lineTo(h1X, h)
  ctx.moveTo(h1X + charW, 0)
  ctx.lineTo(h1X + charW, h)
  ctx.moveTo(h1X, h * 0.5)
  ctx.lineTo(h1X + charW, h * 0.5)
  ctx.stroke()

  // Second H
  const h2X = charW + charGap
  ctx.beginPath()
  ctx.moveTo(h2X, 0)
  ctx.lineTo(h2X, h)
  ctx.moveTo(h2X + charW, 0)
  ctx.lineTo(h2X + charW, h)
  ctx.moveTo(h2X, h * 0.5)
  ctx.lineTo(h2X + charW, h * 0.5)
  ctx.stroke()

  // G
  const gX = (charW + charGap) * 2
  ctx.beginPath()
  ctx.moveTo(gX + charW, h * 0.2)
  ctx.lineTo(gX + charW, 0)
  ctx.lineTo(gX, 0)
  ctx.lineTo(gX, h)
  ctx.lineTo(gX + charW, h)
  ctx.lineTo(gX + charW, h * 0.5)
  ctx.lineTo(gX + charW * 0.5, h * 0.5)
  ctx.stroke()

  ctx.restore()
}

export function drawGoaBeachIllustrationBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  ctx.save()

  const cSkyDeep = '#14532D'
  const cSkyGreen = '#166534'
  const cHillGreen = '#15803D'
  const cSunYellow = '#FACC15'
  const cSandWhite = '#FFFFFF'
  const cHouseGreen = '#16A34A'
  const cHouseLight = '#86EFAC'
  const cPink = '#E91467'
  const cOutline = '#0B3822'

  // 1. SKY & OCEAN (Top 42% of canvas)
  const skyH = h * 0.42
  ctx.fillStyle = cSkyGreen
  ctx.fillRect(0, 0, w, skyH)

  ctx.fillStyle = cHillGreen
  ctx.beginPath()
  ctx.moveTo(0, skyH)
  ctx.quadraticCurveTo(w * 0.25, skyH - h * 0.04, w * 0.5, skyH - h * 0.02)
  ctx.quadraticCurveTo(w * 0.75, skyH - h * 0.05, w, skyH - h * 0.02)
  ctx.lineTo(w, skyH)
  ctx.closePath()
  ctx.fill()

  const sunX = w * 0.5
  const sunY = h * 0.12
  const sunR = w * 0.14

  ctx.strokeStyle = cSunYellow
  ctx.lineWidth = Math.max(2, w * 0.004)
  const numRays = 12
  for (let i = 0; i < numRays; i++) {
    const angle = Math.PI + (i * Math.PI) / (numRays - 1)
    const r1 = sunR * 1.15
    const r2 = r1 + w * 0.08
    ctx.beginPath()
    ctx.moveTo(sunX + Math.cos(angle) * r1, sunY + Math.sin(angle) * r1)
    ctx.lineTo(sunX + Math.cos(angle) * r2, sunY + Math.sin(angle) * r2)
    ctx.stroke()
  }

  ctx.fillStyle = cSunYellow
  ctx.beginPath()
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = cOutline
  ctx.lineWidth = Math.max(1.5, w * 0.003)
  ctx.stroke()

  ctx.fillStyle = cSunYellow
  for (let i = 0; i < 5; i++) {
    const rw = sunR * (1.6 - i * 0.2)
    const ry = sunY + sunR + i * (h * 0.015) + 6
    ctx.fillRect(sunX - rw / 2, ry, rw, h * 0.005)
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.lineWidth = Math.max(1.5, w * 0.003)
  for (let i = 0; i < 3; i++) {
    const wy = skyH * 0.65 + i * (skyH * 0.12)
    ctx.beginPath()
    ctx.moveTo(w * 0.1, wy)
    ctx.quadraticCurveTo(w * 0.25, wy - 6, w * 0.4, wy)
    ctx.quadraticCurveTo(w * 0.55, wy + 6, w * 0.7, wy)
    ctx.quadraticCurveTo(w * 0.85, wy - 6, w * 0.95, wy)
    ctx.stroke()
  }

  ctx.fillStyle = cSandWhite
  ctx.beginPath()
  ctx.moveTo(w * 0.12, skyH * 0.45)
  ctx.lineTo(w * 0.18, skyH * 0.45)
  ctx.lineTo(w * 0.16, skyH * 0.48)
  ctx.lineTo(w * 0.13, skyH * 0.48)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = cOutline
  ctx.stroke()

  // 2. SANDY BEACH SHORE (Mid Section)
  ctx.fillStyle = cSandWhite
  ctx.beginPath()
  ctx.moveTo(0, skyH - 2)
  ctx.quadraticCurveTo(w * 0.4, skyH + h * 0.02, w, skyH - 2)
  ctx.lineTo(w, h * 0.65)
  ctx.lineTo(0, h * 0.65)
  ctx.closePath()
  ctx.fill()

  drawBeachUmbrella(ctx, w * 0.18, skyH + h * 0.03, w * 0.07, cSunYellow, cSandWhite, cOutline)
  drawLoungeChair(ctx, w * 0.15, skyH + h * 0.07, w * 0.06, cSkyDeep, cOutline)
  drawLoungeChair(ctx, w * 0.22, skyH + h * 0.07, w * 0.06, cSkyDeep, cOutline)

  drawBeachUmbrella(ctx, w * 0.38, skyH + h * 0.04, w * 0.07, cSunYellow, cSandWhite, cOutline)
  drawLoungeChair(ctx, w * 0.35, skyH + h * 0.08, w * 0.06, cSkyDeep, cOutline)

  const shackX = w * 0.7
  const shackY = skyH + h * 0.01
  const shackW = w * 0.24
  const shackH = h * 0.12

  ctx.fillStyle = cSkyDeep
  ctx.fillRect(shackX, shackY + shackH * 0.3, shackW, shackH * 0.7)
  ctx.fillStyle = cSandWhite
  ctx.fillRect(shackX + shackW * 0.1, shackY + shackH * 0.4, shackW * 0.8, shackH * 0.5)
  ctx.strokeStyle = cOutline
  ctx.lineWidth = Math.max(1.5, w * 0.003)
  ctx.strokeRect(shackX, shackY + shackH * 0.3, shackW, shackH * 0.7)

  ctx.fillStyle = cSkyGreen
  ctx.beginPath()
  ctx.moveTo(shackX - w * 0.02, shackY + shackH * 0.3)
  ctx.lineTo(shackX + shackW * 0.5, shackY + shackH * 0.1)
  ctx.lineTo(shackX + shackW + w * 0.02, shackY + shackH * 0.3)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = cPink
  ctx.fillRect(shackX + shackW * 0.1, shackY + shackH * 0.15, shackW * 0.8, shackH * 0.22)
  ctx.strokeStyle = cSandWhite
  ctx.lineWidth = Math.max(1, w * 0.002)
  ctx.strokeRect(shackX + shackW * 0.1, shackY + shackH * 0.15, shackW * 0.8, shackH * 0.22)

  ctx.fillStyle = cSandWhite
  ctx.font = `900 ${Math.max(9, w * 0.022)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('GOA BEACH', shackX + shackW * 0.5, shackY + shackH * 0.26)

  for (let i = 0; i < 3; i++) {
    const stoolX = shackX + shackW * (0.25 + i * 0.25)
    const stoolY = shackY + shackH * 0.85
    ctx.fillStyle = cSunYellow
    ctx.fillRect(stoolX - 3, stoolY, 6, 12)
    ctx.strokeRect(stoolX - 3, stoolY, 6, 12)
  }

  drawStandingSurfboard(ctx, shackX - w * 0.05, shackY + shackH * 0.3, w * 0.025, h * 0.09, cSandWhite, cOutline)
  drawStandingSurfboard(ctx, shackX - w * 0.02, shackY + shackH * 0.3, w * 0.025, h * 0.09, cSunYellow, cOutline)

  drawWalkingFigure(ctx, w * 0.14, skyH + h * 0.12, w * 0.015, h * 0.04, cSkyDeep)
  drawWalkingFigure(ctx, w * 0.76, skyH + h * 0.12, w * 0.015, h * 0.04, cSkyDeep)
  drawWalkingFigure(ctx, w * 0.83, skyH + h * 0.11, w * 0.015, h * 0.04, cSkyDeep)

  // 3. ISOMETRIC GOAN VILLAGE & VILLAS
  const villageY = h * 0.55

  drawIsometricVilla(
    ctx,
    w * 0.05,
    villageY,
    w * 0.22,
    h * 0.18,
    cHouseGreen,
    cHouseLight,
    cSandWhite,
    cSunYellow,
    cOutline
  )

  drawIsometricVilla(
    ctx,
    w * 0.2,
    villageY + h * 0.03,
    w * 0.22,
    h * 0.18,
    cHouseGreen,
    cHouseLight,
    cSandWhite,
    cSunYellow,
    cOutline
  )

  drawColonialVilla(
    ctx,
    0,
    villageY + h * 0.08,
    w * 0.18,
    h * 0.24,
    cSandWhite,
    cSkyDeep,
    cSunYellow,
    cOutline,
    false
  )

  drawColonialVilla(
    ctx,
    w * 0.8,
    villageY + h * 0.02,
    w * 0.2,
    h * 0.3,
    cSandWhite,
    cSkyDeep,
    cSunYellow,
    cOutline,
    true,
    cPink
  )

  drawColonialVilla(
    ctx,
    w * 0.08,
    villageY + h * 0.24,
    w * 0.18,
    h * 0.2,
    cSandWhite,
    cSkyDeep,
    cSunYellow,
    cOutline,
    false
  )

  drawIsometricVilla(
    ctx,
    w * 0.26,
    villageY + h * 0.25,
    w * 0.22,
    h * 0.18,
    cHouseGreen,
    cHouseLight,
    cSandWhite,
    cSunYellow,
    cOutline
  )

  drawPalmTreeArt(ctx, w * 0.25, skyH - h * 0.02, w * 0.12, h * 0.22, cSkyDeep, cSunYellow, cOutline)
  drawPalmTreeArt(ctx, w * 0.88, skyH - h * 0.03, w * 0.1, h * 0.2, cSkyDeep, cSunYellow, cOutline)
  drawPalmTreeArt(ctx, w * 0.58, villageY + h * 0.05, w * 0.1, h * 0.18, cSkyDeep, cSunYellow, cOutline)
  drawPalmTreeArt(ctx, w * 0.72, villageY + h * 0.15, w * 0.12, h * 0.22, cSkyDeep, cSunYellow, cOutline)
  drawPalmTreeArt(ctx, w * 0.52, villageY + h * 0.18, w * 0.14, h * 0.25, cSkyDeep, cSunYellow, cOutline)
  drawPalmTreeArt(ctx, w * 0.12, villageY + h * 0.22, w * 0.14, h * 0.24, cSkyDeep, cSunYellow, cOutline)

  drawWalkingFigure(ctx, w * 0.29, villageY + h * 0.2, w * 0.016, h * 0.045, cSkyDeep)

  // 4. GEOMETRIC "HHG" LOGO
  drawGeometricHHGLogo(ctx, w * 0.72, h * 0.87, w * 0.24, h * 0.08, cSkyDeep)

  ctx.restore()
}

// --- ANIME SUNSET BEACH BACKGROUND RENDERER (MATCHING IMAGE 1) ---

export function drawAnimeSunsetBeachBackground(
  ctx: CanvasRenderingContext2D,
  x: number = 0,
  y: number = 0,
  w: number = 480,
  h: number = 700
) {
  ctx.save()
  ctx.translate(x, y)

  // 1. Sky Gradient: Blue Top -> Pink Clouds -> Golden Sunset Horizon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55)
  skyGrad.addColorStop(0, '#2563EB')
  skyGrad.addColorStop(0.25, '#60A5FA')
  skyGrad.addColorStop(0.55, '#F472B6')
  skyGrad.addColorStop(0.8, '#FBBF24')
  skyGrad.addColorStop(1, '#FFF176')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h * 0.55)

  // 2. Glowing Golden Sun at Horizon Center
  const sunY = h * 0.42
  const sunRadius = 32
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(w / 2, sunY, sunRadius, 0, Math.PI * 2)
  ctx.fill()

  // Radial Sun Glow & Lens Flare
  const sunGlow = ctx.createRadialGradient(w / 2, sunY, 5, w / 2, sunY, 120)
  sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
  sunGlow.addColorStop(0.3, 'rgba(254, 240, 138, 0.6)')
  sunGlow.addColorStop(0.7, 'rgba(244, 114, 182, 0.3)')
  sunGlow.addColorStop(1, 'rgba(244, 114, 182, 0)')
  ctx.fillStyle = sunGlow
  ctx.beginPath()
  ctx.arc(w / 2, sunY, 120, 0, Math.PI * 2)
  ctx.fill()

  // Center Vertical Lens Flare Rays
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(w / 2, 0)
  ctx.lineTo(w / 2, h * 0.55)
  ctx.stroke()

  // 3. Sparkling Blue Ocean Water Body
  const oceanY = h * 0.45
  const oceanH = h * 0.2
  const oceanGrad = ctx.createLinearGradient(0, oceanY, 0, oceanY + oceanH)
  oceanGrad.addColorStop(0, '#0284C7')
  oceanGrad.addColorStop(0.5, '#0369A1')
  oceanGrad.addColorStop(1, '#0C4A6E')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, oceanY, w, oceanH)

  // Water Reflection Highlights under Sun
  ctx.fillStyle = 'rgba(254, 240, 138, 0.7)'
  for (let i = 0; i < 8; i++) {
    const rw = 90 - i * 9
    const ry = oceanY + i * 8 + 4
    ctx.fillRect(w / 2 - rw / 2, ry, rw, 3)
  }

  // White Water Foam Wave Outlines
  drawBeachWave(ctx, 0, oceanY + 25, w, 6, 'rgba(255, 255, 255, 0.7)')
  drawBeachWave(ctx, 0, oceanY + 50, w, 8, 'rgba(255, 255, 255, 0.85)')

  // 4. Sandy Beach Shore Bottom
  const shoreY = oceanY + oceanH
  const shoreGrad = ctx.createLinearGradient(0, shoreY, 0, h)
  shoreGrad.addColorStop(0, '#FDF6E3')
  shoreGrad.addColorStop(0.5, '#FDE68A')
  shoreGrad.addColorStop(1, '#F59E0B')
  ctx.fillStyle = shoreGrad
  ctx.fillRect(0, shoreY, w, h - shoreY)

  // 5. Left & Right Beach Shacks, Surfboards, & Palm Trees Background Elements
  drawDualColorPalmTree(ctx, 35, 40, 1.3, '#0D6E43', '#FFC72C')
  drawDualColorPalmTree(ctx, w - 35, 40, 1.3, '#0D6E43', '#FFC72C')

  drawSurfboardsPair(ctx, 45, h - 80, 0.85)
  drawGoanScooter(ctx, w - 45, h - 80, 0.85)

  ctx.restore()
}

// Dual Color Palm Trees
export function drawDualColorPalmTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1,
  leafColor: string = COLORS.emerald,
  stemColor: string = COLORS.amberGold
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  // Trunk with yellow highlight stem line
  ctx.strokeStyle = leafColor
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 30)
  ctx.quadraticCurveTo(-8, 14, -2, -6)
  ctx.stroke()

  ctx.strokeStyle = stemColor
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(1.5, 30)
  ctx.quadraticCurveTo(-6.5, 14, -0.5, -6)
  ctx.stroke()

  // Lush Palm Fronds
  ctx.fillStyle = leafColor
  const leafAngles = [-1.0, -0.5, 0, 0.5, 1.0, -1.4, 1.4]
  for (const angle of leafAngles) {
    ctx.save()
    ctx.translate(-2, -6)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(14, -7, 26, -2)
    ctx.quadraticCurveTo(14, 5, 0, 0)
    ctx.fill()

    // Inner leaf vein highlight
    ctx.strokeStyle = stemColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(12, -4, 22, -2)
    ctx.stroke()
    ctx.restore()
  }

  // Coconuts
  ctx.fillStyle = COLORS.amberGold
  ctx.beginPath()
  ctx.arc(-5, -3, 3, 0, Math.PI * 2)
  ctx.arc(1, -3, 3, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// Standing Dual Surfboards (Yellow & Hot Pink)
export function drawSurfboardsPair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  // 1. Back Yellow Surfboard (tilted slightly left)
  ctx.save()
  ctx.rotate(-0.15)
  ctx.fillStyle = COLORS.amberGold
  ctx.beginPath()
  ctx.moveTo(0, -32)
  ctx.quadraticCurveTo(11, -12, 10, 18)
  ctx.quadraticCurveTo(0, 32, -10, 18)
  ctx.quadraticCurveTo(-11, -12, 0, -32)
  ctx.fill()
  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Center stringer line
  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, -30)
  ctx.lineTo(0, 30)
  ctx.stroke()
  ctx.restore()

  // 2. Front Hot Pink Surfboard (tilted slightly right)
  ctx.save()
  ctx.translate(8, 4)
  ctx.rotate(0.12)
  ctx.fillStyle = COLORS.hotPink
  ctx.beginPath()
  ctx.moveTo(0, -32)
  ctx.quadraticCurveTo(11, -12, 10, 18)
  ctx.quadraticCurveTo(0, 32, -10, 18)
  ctx.quadraticCurveTo(-11, -12, 0, -32)
  ctx.fill()
  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Center stringer line & yellow highlight
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, -30)
  ctx.lineTo(0, 30)
  ctx.stroke()

  // Shine highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.beginPath()
  ctx.ellipse(3, -12, 2, 8, 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.restore()
}

// Vintage Goan Pink Scooter / Vespa
export function drawGoanScooter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  // Wheels
  ctx.fillStyle = '#1A1A1A'
  ctx.beginPath()
  ctx.arc(-14, 12, 7, 0, Math.PI * 2)
  ctx.arc(14, 12, 7, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#E2E8F0'
  ctx.beginPath()
  ctx.arc(-14, 12, 3.5, 0, Math.PI * 2)
  ctx.arc(14, 12, 3.5, 0, Math.PI * 2)
  ctx.fill()

  // Chassis Main Body (Hot Pink)
  ctx.fillStyle = COLORS.hotPink
  ctx.beginPath()
  ctx.moveTo(-18, 8)
  ctx.quadraticCurveTo(-14, -6, 0, -4)
  ctx.quadraticCurveTo(12, -8, 16, 2)
  ctx.lineTo(18, 8)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Front Shield & Handlebars
  ctx.fillStyle = COLORS.hotPink
  ctx.fillRect(-16, -14, 6, 16)
  ctx.strokeRect(-16, -14, 6, 16)

  // Seat (Yellow)
  ctx.fillStyle = COLORS.amberGold
  roundRect(ctx, -6, -8, 18, 5, 2)
  ctx.fill()
  ctx.stroke()

  // Headlight (Round White)
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(-13, -16, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.amberGold
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.restore()
}

// Goan Portuguese Pink Villa House
export function drawGoanVilla(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  // Villa Body (Hot Pink)
  ctx.fillStyle = COLORS.hotPink
  ctx.fillRect(-22, -26, 44, 46)
  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 1.8
  ctx.strokeRect(-22, -26, 44, 46)

  // Green Gabled Roof
  ctx.fillStyle = COLORS.emeraldDark
  ctx.beginPath()
  ctx.moveTo(-26, -26)
  ctx.lineTo(0, -44)
  ctx.lineTo(26, -26)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = COLORS.amberGold
  ctx.lineWidth = 2
  ctx.stroke()

  // Yellow Window Shutters
  ctx.fillStyle = COLORS.amberGold
  roundRect(ctx, -14, -18, 10, 14, 2)
  roundRect(ctx, 4, -18, 10, 14, 2)
  roundRect(ctx, -6, 2, 12, 16, 2)
  ctx.fill()

  // Green Door & Balcony Railing
  ctx.fillStyle = COLORS.emerald
  ctx.fillRect(-4, 4, 8, 14)

  ctx.strokeStyle = COLORS.amberGold
  ctx.lineWidth = 1.5
  ctx.strokeRect(-16, -4, 32, 4)

  ctx.restore()
}

// Yellow Torn Paper Tape Badge ("VERIFIED!")
export function drawTornTapeBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(-0.06)

  // Yellow Torn Paper Shape
  ctx.fillStyle = COLORS.amberGold
  ctx.beginPath()
  ctx.moveTo(-45, -12)
  ctx.lineTo(45, -12)
  ctx.lineTo(42, 12)
  ctx.lineTo(-42, 12)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = COLORS.emeraldDark
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Text
  ctx.fillStyle = COLORS.emeraldDark
  ctx.font = `800 11px 'JetBrains Mono', monospace`
  ctx.textAlign = 'center'
  ctx.fillText(text, 0, 4)

  ctx.restore()
}

export function drawBeachWave(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  const segments = 4
  const segW = width / segments
  ctx.moveTo(x, y)
  for (let i = 0; i < segments; i++) {
    const cx1 = x + i * segW + segW * 0.25
    const cy1 = y - height
    const cx2 = x + i * segW + segW * 0.75
    const cy2 = y + height
    const ex = x + (i + 1) * segW
    const ey = y
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey)
  }
  ctx.stroke()
  ctx.restore()
}

export function drawGoaSunset(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sunColor: string = COLORS.amberGold,
  rayColor: string = COLORS.amberGold
) {
  ctx.save()
  ctx.fillStyle = sunColor
  ctx.strokeStyle = rayColor
  ctx.lineWidth = 2.5

  // Golden Sunset Disk
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()

  // Sun Rays
  const rayCount = 10
  const rayLength = radius * 0.6
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * Math.PI * 2) / rayCount
    const r1 = radius * 1.25
    const r2 = r1 + rayLength
    const x1 = x + Math.cos(angle) * r1
    const y1 = y + Math.sin(angle) * r1
    const x2 = x + Math.cos(angle) * r2
    const y2 = y + Math.sin(angle) * r2
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  ctx.restore()
}

export function drawSparkleStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.quadraticCurveTo(x, y, x, y + r)
  ctx.quadraticCurveTo(x, y, x - r, y)
  ctx.quadraticCurveTo(x, y, x, y - r)
  ctx.fill()
  ctx.restore()
}

export function drawBeachShackBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string
) {
  ctx.save()
  ctx.fillStyle = COLORS.hotPink
  roundRect(ctx, x, y, 120, 26, 6)
  ctx.fill()
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  roundRect(ctx, x + 2, y + 2, 116, 22, 4)
  ctx.stroke()

  ctx.fillStyle = '#FFFFFF'
  ctx.font = `800 11px 'JetBrains Mono', monospace`
  ctx.textAlign = 'center'
  ctx.fillText(text, x + 60, y + 17)
  ctx.restore()
}
