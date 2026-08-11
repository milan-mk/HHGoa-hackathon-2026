import { useRef } from 'react'
import type { FrameMode } from '../types'

interface Props {
  mode: FrameMode
  photos: (string | null)[]
  activePhotoSlot?: number
  onSetPhoto: (index: number, dataUrl: string | null) => void
  onSelectSlot?: (index: number) => void
}

export function SlotGrid({ mode, photos, activePhotoSlot = 0, onSetPhoto, onSelectSlot }: Props) {
  const count = mode === 'solo' ? 1 : 4
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleFile(index: number, files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => onSetPhoto(index, e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className={`grid gap-2.5 mt-3.5 ${count === 1 ? 'grid-cols-1 max-w-[140px]' : 'grid-cols-4'}`}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = activePhotoSlot === i && mode === 'team'
        const hasImg = Boolean(photos[i])
        return (
          <div
            key={i}
            onClick={() => {
              if (onSelectSlot && hasImg) {
                onSelectSlot(i)
              }
              if (!hasImg) {
                inputRefs.current[i]?.click()
              }
            }}
            className={`aspect-square rounded-[10px] border flex items-center justify-center relative overflow-hidden cursor-pointer transition-all ${
              isActive
                ? 'border-goa-pink ring-2 ring-goa-pink/30 bg-cream shadow-xs'
                : 'border-goa-line bg-cream-2 hover:border-goa-green'
            }`}
          >
            {hasImg ? (
              <>
                <img src={photos[i] as string} className="w-full h-full object-cover" />
                {mode === 'team' && (
                  <span className={`absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-goa-pink text-white' : 'bg-goa-green-dark/80 text-white'
                  }`}>
                    #{i + 1}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSetPhoto(i, null)
                  }}
                  className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-goa-pink text-white text-[11px] flex items-center justify-center border-none hover:scale-110 transition-transform cursor-pointer"
                  title="Remove photo"
                >
                  &times;
                </button>
              </>
            ) : (
              <span className="text-2xl text-goa-ink-soft">+</span>
            )}
            <input
              ref={(el) => {
                inputRefs.current[i] = el
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleFile(i, e.target.files)
                e.target.value = ''
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
