import type { FrameMode } from '../types'

interface Props {
  mode: FrameMode
  onChange: (mode: FrameMode) => void
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-cream-2 rounded-[10px] p-1 mb-5">
      <button
        onClick={() => onChange('solo')}
        className={`flex-1 py-2.5 px-2.5 rounded-lg font-semibold text-[13px] transition-all ${
          mode === 'solo' ? 'bg-white text-goa-green-dark shadow-sm' : 'text-goa-ink-soft'
        }`}
      >
        Solo frame
      </button>
      <button
        onClick={() => onChange('team')}
        className={`flex-1 py-2.5 px-2.5 rounded-lg font-semibold text-[13px] transition-all ${
          mode === 'team' ? 'bg-white text-goa-green-dark shadow-sm' : 'text-goa-ink-soft'
        }`}
      >
        Team frame (up to 4)
      </button>
    </div>
  )
}
