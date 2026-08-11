import { useState } from 'react'

interface Props {
  caption: string
}

export function CaptionBox({ caption }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="w-full bg-white border border-goa-line rounded-[9px] px-3.5 py-3 mt-1">
      <div className="flex justify-between items-center gap-2">
        <span className="font-mono text-xs text-goa-ink-soft">{caption}</span>
        <button onClick={handleCopy} className="text-goa-pink-dark text-xs font-semibold shrink-0">
          {copied ? 'Copied' : 'Copy caption'}
        </button>
      </div>
    </div>
  )
}
