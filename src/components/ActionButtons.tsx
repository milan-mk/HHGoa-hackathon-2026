interface Props {
  onDownload: () => void
  onShare: () => void
  onOpenQRModal: () => void
}

export function ActionButtons({ onDownload, onShare, onOpenQRModal }: Props) {
  return (
    <div className="space-y-2.5 mt-4">
      <div className="flex gap-2.5">
        <button
          onClick={onDownload}
          className="flex-1 font-bold text-sm py-3 rounded-full bg-goa-pink text-white hover:bg-goa-pink-dark active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>
        <button
          onClick={onShare}
          className="flex-1 font-bold text-sm py-3 rounded-full border-[1.5px] border-goa-green text-goa-green-dark hover:bg-goa-green hover:text-cream active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share to X
        </button>
      </div>

      <button
        onClick={onOpenQRModal}
        className="w-full text-xs font-semibold py-2 rounded-full border border-goa-line text-goa-ink-soft hover:bg-cream hover:text-goa-pink transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <svg className="w-4 h-4 text-goa-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        Inspect & Copy WebApp QR Code
      </button>
    </div>
  )
}
