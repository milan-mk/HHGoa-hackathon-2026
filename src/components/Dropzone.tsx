import { useRef, useState } from 'react'

interface Props {
  onFile: (file: File) => void
}

export function Dropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-colors ${
        dragOver ? 'border-goa-pink bg-pink-50' : 'border-goa-line bg-cream-2'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1B5E3F"
        strokeWidth={2}
        strokeLinecap="round"
        className="w-7 h-7 mx-auto mb-2"
      >
        <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
      </svg>
      <p className="text-[13px] text-goa-ink-soft">
        <strong className="text-goa-pink-dark">Click to upload</strong> or drag a photo here
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
