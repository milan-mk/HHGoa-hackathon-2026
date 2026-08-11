import { useState, useRef } from 'react'
import type { RefObject } from 'react'
import type { FrameMode, OutputMode, PhotoPosition } from '../types'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  outputMode: OutputMode
  activePhotoSlot: number
  photoPosition: PhotoPosition
  hasPhoto: boolean
  mode: FrameMode
  photos: (string | null)[]
  onOpenQRModal: () => void
  onUpdatePosition: (update: Partial<PhotoPosition>) => void
  onResetPosition: () => void
  onSelectSlot: (slot: number) => void
}

function detectSlotAtCoords(
  clientX: number,
  clientY: number,
  canvasEl: HTMLCanvasElement | null,
  outputMode: OutputMode,
  mode: FrameMode,
  photos: (string | null)[],
  activeSlot: number
): number {
  if (!canvasEl) return activeSlot
  if (outputMode === 'id' || mode === 'solo') {
    const firstIdx = photos.findIndex(Boolean)
    return firstIdx !== -1 ? firstIdx : 0
  }

  const rect = canvasEl.getBoundingClientRect()
  if (!rect || rect.width === 0 || rect.height === 0) return activeSlot

  const relX = (clientX - rect.left) / rect.width
  const relY = (clientY - rect.top) / rect.height

  const gridMinX = (320 - 178) / 640
  const gridMaxX = (320 + 178) / 640
  const gridMinY = (285 - 178) / 640
  const gridMaxY = (285 + 178) / 640

  const gridW = gridMaxX - gridMinX
  const gridH = gridMaxY - gridMinY

  const validPhotos = photos
    .map((p, idx) => ({ p, idx }))
    .filter((item) => Boolean(item.p))
  const photoCount = validPhotos.length

  if (photoCount <= 1) {
    return validPhotos[0]?.idx ?? 0
  }

  const cols = photoCount <= 2 ? photoCount : 2
  const rows = Math.ceil(photoCount / cols)

  if (relX >= gridMinX && relX <= gridMaxX && relY >= gridMinY && relY <= gridMaxY) {
    const col = Math.floor(((relX - gridMinX) / gridW) * cols)
    const row = Math.floor(((relY - gridMinY) / gridH) * rows)
    const validIndex = row * cols + col
    if (validIndex >= 0 && validIndex < photoCount) {
      return validPhotos[validIndex].idx
    }
  }

  return activeSlot
}

export function CanvasStage({
  canvasRef,
  outputMode,
  activePhotoSlot,
  photoPosition,
  hasPhoto,
  mode,
  photos,
  onOpenQRModal,
  onUpdatePosition,
  onResetPosition,
  onSelectSlot,
}: Props) {
  const isIDCard = outputMode === 'id'
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number; initialX: number; initialY: number }>({
    x: 0,
    y: 0,
    initialX: 0,
    initialY: 0,
  })

  const dragSlotRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  // Direct Mouse Drag Handler with Hit-Testing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasPhoto) return
    const targetSlot = detectSlotAtCoords(
      e.clientX,
      e.clientY,
      canvasRef.current,
      outputMode,
      mode,
      photos,
      activePhotoSlot
    )
    dragSlotRef.current = targetSlot
    onSelectSlot(targetSlot)

    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: photoPosition?.x || 0,
      initialY: photoPosition?.y || 0,
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.clientX
    const clientY = e.clientY
    const deltaX = (clientX - dragStartRef.current.x) / rect.width
    const deltaY = (clientY - dragStartRef.current.y) / rect.height
    const sens = 2.2

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      onUpdatePosition({
        x: dragStartRef.current.initialX + deltaX * sens,
        y: dragStartRef.current.initialY + deltaY * sens,
      })
    })
  }

  const handleMouseUp = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setIsDragging(false)
  }

  // Direct Touch Drag Handler with Hit-Testing
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!hasPhoto || e.touches.length === 0) return
    const touch = e.touches[0]
    const targetSlot = detectSlotAtCoords(
      touch.clientX,
      touch.clientY,
      canvasRef.current,
      outputMode,
      mode,
      photos,
      activePhotoSlot
    )
    dragSlotRef.current = targetSlot
    onSelectSlot(targetSlot)

    setIsDragging(true)
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialX: photoPosition?.x || 0,
      initialY: photoPosition?.y || 0,
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length === 0) return
    const touch = e.touches[0]
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = touch.clientX
    const clientY = touch.clientY
    const deltaX = (clientX - dragStartRef.current.x) / rect.width
    const deltaY = (clientY - dragStartRef.current.y) / rect.height
    const sens = 2.2

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      onUpdatePosition({
        x: dragStartRef.current.initialX + deltaX * sens,
        y: dragStartRef.current.initialY + deltaY * sens,
      })
    })
  }

  const handleTouchEnd = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setIsDragging(false)
  }

  const currentZoom = photoPosition?.zoom || 1

  return (
    <div className="bg-cream-2 rounded-xl p-5 flex flex-col items-center gap-3.5 relative border border-goa-line/60">
      {isIDCard && (
        <div className="w-full flex items-center justify-between px-1 mb-0.5">
          <span className="text-[11px] font-mono text-goa-green-dark font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            VERTICAL ID BADGE (300DPI)
          </span>
          <button
            onClick={onOpenQRModal}
            className="text-[11px] font-semibold text-goa-pink hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-goa-line shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Test Scan QR
          </button>
        </div>
      )}

      {/* Canvas Preview Box */}
      <div
        className={`relative w-full transition-transform duration-300 ${
          isIDCard ? 'max-w-[340px]' : 'max-w-[420px]'
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`w-full h-auto rounded-[18px] block shadow-[0_12px_36px_rgba(18,63,42,0.18)] border border-white/40 select-none ${
            hasPhoto ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
        />

        {/* Floating Drag Overlay Tooltip */}
        {hasPhoto && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-goa-green-dark/85 text-white text-[10px] font-semibold px-3 py-1 rounded-full backdrop-blur-xs shadow-md border border-white/20 pointer-events-none flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <span className="animate-bounce">🖐️</span> Drag directly on preview to position & center
          </div>
        )}
      </div>

      {/* Interactive Photo Positioning & Centering Toolbar */}
      {hasPhoto && (
        <div className="w-full bg-white border border-goa-line rounded-[12px] p-3 shadow-xs flex flex-col gap-2.5">
          {/* Team Mode Slot Selector */}
          {mode === 'team' && (
            <div className="flex items-center justify-between border-b border-goa-line/50 pb-2">
              <span className="text-[11px] font-bold text-goa-green-dark uppercase tracking-wider">
                Select Slot to Position:
              </span>
              <div className="flex gap-1">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSlot(idx)}
                    disabled={!p}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md border transition-all ${
                      activePhotoSlot === idx
                        ? 'bg-goa-pink text-white border-goa-pink shadow-2xs'
                        : p
                        ? 'bg-cream-2 text-goa-ink border-goa-line hover:border-goa-pink'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    Slot {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Center Photo Button */}
            <button
              type="button"
              onClick={onResetPosition}
              className="px-3 py-1.5 bg-goa-green text-cream hover:bg-goa-green-dark text-xs font-semibold rounded-[8px] border border-goa-green-dark flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Reset photo position to exact center"
            >
              <span>🎯</span> Center Photo
            </button>

            {/* Pan Directional Controls */}
            <div className="flex items-center gap-1 bg-cream-2 p-1 rounded-[8px] border border-goa-line">
              <button
                type="button"
                onClick={() => onUpdatePosition({ x: (photoPosition?.x || 0) + 0.1 })}
                className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-goa-pink hover:text-white border border-goa-line text-xs font-bold transition-colors cursor-pointer"
                title="Pan Left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => onUpdatePosition({ y: (photoPosition?.y || 0) + 0.1 })}
                className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-goa-pink hover:text-white border border-goa-line text-xs font-bold transition-colors cursor-pointer"
                title="Pan Up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onUpdatePosition({ y: (photoPosition?.y || 0) - 0.1 })}
                className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-goa-pink hover:text-white border border-goa-line text-xs font-bold transition-colors cursor-pointer"
                title="Pan Down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onUpdatePosition({ x: (photoPosition?.x || 0) - 0.1 })}
                className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-goa-pink hover:text-white border border-goa-line text-xs font-bold transition-colors cursor-pointer"
                title="Pan Right"
              >
                →
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-cream-2 px-2 py-1 rounded-[8px] border border-goa-line">
              <span className="text-[11px] font-bold text-goa-ink-soft">Zoom:</span>
              <button
                type="button"
                onClick={() => onUpdatePosition({ zoom: Math.max(1, currentZoom - 0.15) })}
                className="w-5 h-5 flex items-center justify-center rounded bg-white border border-goa-line text-xs font-bold hover:bg-goa-pink hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-xs font-semibold text-goa-green-dark min-w-[32px] text-center font-mono">
                {currentZoom.toFixed(1)}x
              </span>
              <button
                type="button"
                onClick={() => onUpdatePosition({ zoom: Math.min(3, currentZoom + 0.15) })}
                className="w-5 h-5 flex items-center justify-center rounded bg-white border border-goa-line text-xs font-bold hover:bg-goa-pink hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {isIDCard && (
        <p className="text-[11px] text-center text-goa-ink-soft italic">
          💡 Scannable QR code embedded near the bottom. Scan with your mobile camera to test!
        </p>
      )}
    </div>
  )
}
