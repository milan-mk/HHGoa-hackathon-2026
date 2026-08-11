import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  isOpen: boolean
  webAppUrl: string
  onClose: () => void
}

export function QRModal({ isOpen, webAppUrl, onClose }: Props) {
  const [qrSrc, setQrSrc] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen && webAppUrl) {
      QRCode.toDataURL(webAppUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0F3823',
          light: '#FFFFFF',
        },
      }).then(setQrSrc).catch(console.error)
    }
  }, [isOpen, webAppUrl])

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(webAppUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-[20px] border border-goa-line p-6 max-w-sm w-full shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        <div className="w-12 h-12 rounded-full bg-goa-green/10 text-goa-green-dark flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>

        <h3 className="text-xl font-bold font-display text-goa-green-dark mb-1">Web App QR Code</h3>
        <p className="text-xs text-goa-ink-soft mb-4">
          Scan this QR code with any mobile camera to open your web application link directly.
        </p>

        <div className="p-4 bg-cream-2 border border-goa-line rounded-[16px] inline-block mb-4 shadow-inner">
          {qrSrc ? (
            <img src={qrSrc} alt="Web App QR Code" className="w-52 h-52 mx-auto rounded-[8px]" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-xs text-gray-400">
              Generating QR Code...
            </div>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-2.5 flex items-center justify-between gap-2 mb-4">
          <span className="text-xs text-gray-600 truncate font-mono">{webAppUrl}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-[7px] bg-goa-green text-cream text-xs font-semibold hover:bg-goa-green-dark shrink-0 transition-colors"
          >
            {copied ? 'Copied! ✓' : 'Copy Link'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full border border-goa-line font-bold text-xs text-goa-ink hover:bg-gray-100 transition-colors"
        >
          Close Preview
        </button>
      </div>
    </div>
  )
}
