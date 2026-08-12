interface Props {
  message: string | null
  onClose?: () => void
}

export function Toast({ message, onClose }: Props) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto bg-goa-green-dark text-cream border border-goa-amber/40 shadow-2xl rounded-full px-5 py-3 flex items-center justify-between gap-3 animate-slide-up backdrop-blur-md">
      <div className="flex items-center gap-2.5 text-xs font-semibold leading-snug">
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-cream/70 hover:text-cream text-xs font-bold shrink-0 ml-1 cursor-pointer"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  )
}
