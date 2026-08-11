import type { RefObject } from 'react'
import type { OutputMode } from '../types'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  outputMode: OutputMode
  onOpenQRModal: () => void
}

export function CanvasStage({ canvasRef, outputMode, onOpenQRModal }: Props) {
  const isIDCard = outputMode === 'id'

  return (
    <div className="bg-cream-2 rounded-xl p-6 flex flex-col items-center gap-3.5 relative border border-goa-line/60">
      {isIDCard && (
        <div className="w-full flex items-center justify-between px-1 mb-1">
          <span className="text-[11px] font-mono text-goa-green-dark font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            VERTICAL ID BADGE (300DPI)
          </span>
          <button
            onClick={onOpenQRModal}
            className="text-[11px] font-semibold text-goa-pink hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-goa-line shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Test Scan QR
          </button>
        </div>
      )}

      <div
        className={`relative w-full transition-transform duration-300 hover:scale-[1.015] ${
          isIDCard ? 'max-w-[340px]' : 'max-w-[420px]'
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-[18px] block shadow-[0_12px_36px_rgba(18,63,42,0.18)] border border-white/40"
        />
      </div>

      {isIDCard && (
        <p className="text-[11px] text-center text-goa-ink-soft italic">
          💡 Scannable QR code embedded near the bottom. Scan with your mobile camera to test!
        </p>
      )}
    </div>
  )
}
