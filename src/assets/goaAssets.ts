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

function createBeachBgDataUrl(): string {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = 960
  canvas.height = 1520
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const w = 960
  const h = 1520

  // 1. Sky Gradient (Cerulean Blue -> Sunset Pink -> Sun Glow)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.52)
  skyGrad.addColorStop(0, '#3B82F6')
  skyGrad.addColorStop(0.3, '#60A5FA')
  skyGrad.addColorStop(0.55, '#F472B6')
  skyGrad.addColorStop(0.8, '#FBBF24')
  skyGrad.addColorStop(1, '#FFF176')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h * 0.52)

  // Soft Pink Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
  const cloudPositions = [
    [100, 120, 140, 50], [300, 80, 180, 60], [700, 140, 200, 70],
    [200, 260, 220, 60], [600, 280, 250, 70], [800, 220, 160, 50]
  ]
  cloudPositions.forEach(([cx, cy, cw, ch]) => {
    ctx.beginPath()
    ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  // 2. Glowing Sun at Horizon Center
  const sunX = w / 2
  const sunY = h * 0.44
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(sunX, sunY, 40, 0, Math.PI * 2)
  ctx.fill()

  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 220)
  sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  sunGlow.addColorStop(0.3, 'rgba(254, 240, 138, 0.75)')
  sunGlow.addColorStop(0.7, 'rgba(244, 114, 182, 0.4)')
  sunGlow.addColorStop(1, 'rgba(244, 114, 182, 0)')
  ctx.fillStyle = sunGlow
  ctx.beginPath()
  ctx.arc(sunX, sunY, 220, 0, Math.PI * 2)
  ctx.fill()

  // Vertical Lens Flare Rays down center
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(sunX, 0)
  ctx.lineTo(sunX, h * 0.52)
  ctx.stroke()

  // 3. Sparkling Blue Ocean
  const oceanY = h * 0.45
  const oceanH = h * 0.18
  const oceanGrad = ctx.createLinearGradient(0, oceanY, 0, oceanY + oceanH)
  oceanGrad.addColorStop(0, '#0284C7')
  oceanGrad.addColorStop(0.5, '#0369A1')
  oceanGrad.addColorStop(1, '#0C4A6E')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, oceanY, w, oceanH)

  // Sun reflections on water
  ctx.fillStyle = 'rgba(254, 240, 138, 0.85)'
  for (let i = 0; i < 12; i++) {
    const rw = 160 - i * 12
    const ry = oceanY + i * 11 + 6
    ctx.fillRect(sunX - rw / 2, ry, rw, 4)
  }

  // Ocean wave foam curves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.lineWidth = 3.5
  for (let i = 0; i < 4; i++) {
    const wy = oceanY + 30 + i * 30
    ctx.beginPath()
    ctx.moveTo(0, wy)
    for (let x = 0; x < w; x += 80) {
      ctx.quadraticCurveTo(x + 40, wy - 12, x + 80, wy)
    }
    ctx.stroke()
  }

  // 4. Sandy Beach Shore Bottom
  const shoreY = oceanY + oceanH
  const shoreGrad = ctx.createLinearGradient(0, shoreY, 0, h)
  shoreGrad.addColorStop(0, '#FDF6E3')
  shoreGrad.addColorStop(0.4, '#FDE68A')
  shoreGrad.addColorStop(1, '#F59E0B')
  ctx.fillStyle = shoreGrad
  ctx.fillRect(0, shoreY, w, h - shoreY)

  // Wooden Boardwalk Path in sand
  ctx.fillStyle = '#854D0E'
  ctx.beginPath()
  ctx.moveTo(w / 2 - 90, h)
  ctx.lineTo(w / 2 - 40, shoreY + 40)
  ctx.lineTo(w / 2 + 40, shoreY + 40)
  ctx.lineTo(w / 2 + 90, h)
  ctx.closePath()
  ctx.fill()

  // 5. Left Beach Shack ("GOOD VIBES", "HIGH TIDES", "COLD DRINKS")
  const shackLX = 40
  const shackLY = shoreY + 20
  ctx.fillStyle = '#78350F'
  ctx.fillRect(shackLX, shackLY, 160, 240)
  ctx.strokeStyle = '#451A03'
  ctx.lineWidth = 4
  ctx.strokeRect(shackLX, shackLY, 160, 240)

  // Roof
  ctx.fillStyle = '#1E3A8A'
  ctx.beginPath()
  ctx.moveTo(shackLX - 15, shackLY)
  ctx.lineTo(shackLX + 80, shackLY - 40)
  ctx.lineTo(shackLX + 175, shackLY)
  ctx.closePath()
  ctx.fill()

  // Signboards stack on left
  const signs = [
    { text: 'GOOD VIBES', bg: '#E91467' },
    { text: 'HIGH TIDES', bg: '#0D9488' },
    { text: 'COLD DRINKS', bg: '#FFC72C' },
    { text: 'LAZY DAYS', bg: '#10B981' }
  ]
  signs.forEach((sign, idx) => {
    const sy = shackLY + 50 + idx * 42
    ctx.fillStyle = sign.bg
    ctx.beginPath()
    ctx.roundRect(shackLX - 10, sy, 130, 32, 6)
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = `900 14px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(sign.text, shackLX + 55, sy + 21)
  })

  // 6. Right Beach Shack ("COA BEACH")
  const shackRX = w - 210
  const shackRY = shoreY + 30
  ctx.fillStyle = '#78350F'
  ctx.fillRect(shackRX, shackRY, 170, 220)
  ctx.strokeStyle = '#451A03'
  ctx.lineWidth = 4
  ctx.strokeRect(shackRX, shackRY, 170, 220)

  // Shack Sign ("COA BEACH")
  ctx.fillStyle = '#E91467'
  ctx.fillRect(shackRX + 20, shackRY - 25, 130, 35)
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 2.5
  ctx.strokeRect(shackRX + 20, shackRY - 25, 130, 35)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = `900 16px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('COA BEACH', shackRX + 85, shackRY - 2)

  // 7. Striped Beach Umbrellas & Standing Surfboards
  // Umbrellas
  const drawUmbrella = (ux: number, uy: number, c1: string, c2: string) => {
    ctx.strokeStyle = '#78350F'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(ux, uy)
    ctx.lineTo(ux, uy + 110)
    ctx.stroke()

    ctx.fillStyle = c1
    ctx.beginPath()
    ctx.arc(ux, uy, 55, Math.PI, 0)
    ctx.fill()

    ctx.fillStyle = c2
    ctx.beginPath()
    ctx.moveTo(ux - 20, uy)
    ctx.arc(ux, uy, 55, Math.PI * 0.8, Math.PI * 0.6)
    ctx.lineTo(ux, uy)
    ctx.fill()
  }
  drawUmbrella(270, shoreY + 80, '#E91467', '#FFFFFF')
  drawUmbrella(420, shoreY + 90, '#0284C7', '#FFC72C')

  // Standing Surfboards Pair
  const drawSurfboard = (sX: number, sY: number, color: string, angle: number) => {
    ctx.save()
    ctx.translate(sX, sY)
    ctx.rotate(angle)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, -60)
    ctx.quadraticCurveTo(20, -20, 18, 50)
    ctx.quadraticCurveTo(0, 70, -18, 50)
    ctx.quadraticCurveTo(-20, -20, 0, -60)
    ctx.fill()
    ctx.strokeStyle = '#052416'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.restore()
  }
  drawSurfboard(w - 230, shoreY + 110, '#FFC72C', -0.1)
  drawSurfboard(w - 200, shoreY + 110, '#E91467', 0.1)
  drawSurfboard(160, shoreY + 120, '#0284C7', -0.15)

  // 8. Tall Palm Trees on Left and Right with Festive Light Strings
  const drawTallPalm = (px: number, py: number, isRight: boolean) => {
    ctx.save()
    ctx.translate(px, py)
    if (isRight) ctx.scale(-1, 1)

    // Trunk
    ctx.strokeStyle = '#78350F'
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.moveTo(0, 500)
    ctx.quadraticCurveTo(-60, 250, -20, -40)
    ctx.stroke()

    // Light String around trunk
    ctx.strokeStyle = '#FFC72C'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 12])
    ctx.beginPath()
    ctx.moveTo(0, 500)
    ctx.quadraticCurveTo(-60, 250, -20, -40)
    ctx.stroke()
    ctx.setLineDash([])

    // Palm Fronds
    ctx.fillStyle = '#0D6E43'
    const angles = [-1.2, -0.7, -0.2, 0.3, 0.8, 1.2]
    angles.forEach(ang => {
      ctx.save()
      ctx.translate(-20, -40)
      ctx.rotate(ang)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(50, -30, 110, -5)
      ctx.quadraticCurveTo(50, 20, 0, 0)
      ctx.fill()
      ctx.restore()
    })

    ctx.restore()
  }
  drawTallPalm(40, -20, false)
  drawTallPalm(w - 40, -20, true)

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
