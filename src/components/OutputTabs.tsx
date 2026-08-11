import type { OutputMode } from '../types'

interface Props {
  output: OutputMode
  onChange: (o: OutputMode) => void
}

export function OutputTabs({ output, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange('frame')}
        className={`flex-1 py-2 rounded-lg border text-xs font-semibold ${
          output === 'frame' ? 'border-goa-pink text-goa-pink-dark bg-pink-50' : 'border-goa-line bg-white text-goa-ink-soft'
        }`}
      >
        Frame
      </button>
      <button
        onClick={() => onChange('id')}
        className={`flex-1 py-2 rounded-lg border text-xs font-semibold ${
          output === 'id' ? 'border-goa-pink text-goa-pink-dark bg-pink-50' : 'border-goa-line bg-white text-goa-ink-soft'
        }`}
      >
        Builder ID card
      </button>
    </div>
  )
}
