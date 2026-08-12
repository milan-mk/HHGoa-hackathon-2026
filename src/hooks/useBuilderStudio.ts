import { useEffect, useRef, useState, useCallback } from 'react'
import type { BuilderState, CardTheme, FrameMode, OutputMode, PhotoPosition } from '../types'
import { generateBuilderClass } from '../lib/builderClass'
import { renderFrame } from '../lib/renderFrame'
import { renderIDCard } from '../lib/renderIDCard'

const getDefaultUrl = () => {
  if (typeof window !== 'undefined' && window.location.href.startsWith('http')) {
    return window.location.href.split('?')[0].split('#')[0]
  }
  return 'http://localhost:5173'
}

function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

const INITIAL_POSITIONS: PhotoPosition[] = [
  { x: 0, y: 0, zoom: 1 },
  { x: 0, y: 0, zoom: 1 },
  { x: 0, y: 0, zoom: 1 },
  { x: 0, y: 0, zoom: 1 },
]

const INITIAL_STATE: BuilderState = {
  mode: 'solo',
  photos: [null, null, null, null],
  photoPositions: INITIAL_POSITIONS,
  activePhotoSlot: 0,
  name: '',
  stack: 'React, TypeScript, Tailwind, AI',
  builderClass: generateBuilderClass('React, TypeScript, Tailwind, AI'),
  houseName: 'HH Goa 2026',
  output: 'frame',
  webAppUrl: getDefaultUrl(),
  cardTheme: 'emerald',
  selectedSkills: ['React', 'TypeScript', 'AI / LLM'],
}

export function useBuilderStudio() {
  const [state, setState] = useState<BuilderState>(INITIAL_STATE)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const showToast = useCallback((msg: string | null, duration = 4000) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = null
    }
    setToastMessage(msg)
    if (msg && duration > 0) {
      toastTimeoutRef.current = setTimeout(() => {
        setToastMessage(null)
      }, duration)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (state.output === 'frame') {
      renderFrame(canvas, state)
    } else {
      renderIDCard(canvas, state)
    }
  }, [state])

  const setMode = useCallback((mode: FrameMode) => {
    setState((s) => ({ ...s, mode }))
  }, [])

  const setOutput = useCallback((output: OutputMode) => {
    setState((s) => ({ ...s, output }))
  }, [])

  const setName = useCallback((name: string) => {
    setState((s) => ({ ...s, name }))
  }, [])

  const setStack = useCallback((stack: string) => {
    setState((s) => ({ ...s, stack, builderClass: generateBuilderClass(stack) }))
  }, [])

  const setBuilderClass = useCallback((builderClass: string) => {
    setState((s) => ({ ...s, builderClass }))
  }, [])

  const setHouseName = useCallback((houseName: string) => {
    setState((s) => ({ ...s, houseName }))
  }, [])

  const updatePhotoPosition = useCallback((slotIndex: number, update: Partial<PhotoPosition>) => {
    setState((s) => {
      const photoPositions = [...s.photoPositions]
      const current = photoPositions[slotIndex] || { x: 0, y: 0, zoom: 1 }
      photoPositions[slotIndex] = {
        x: update.x !== undefined ? Math.max(-1, Math.min(1, update.x)) : current.x,
        y: update.y !== undefined ? Math.max(-1, Math.min(1, update.y)) : current.y,
        zoom: update.zoom !== undefined ? Math.max(1, Math.min(3, update.zoom)) : current.zoom,
      }
      return { ...s, photoPositions }
    })
  }, [])

  const resetPhotoPosition = useCallback((slotIndex: number) => {
    setState((s) => {
      const photoPositions = [...s.photoPositions]
      photoPositions[slotIndex] = { x: 0, y: 0, zoom: 1 }
      return { ...s, photoPositions }
    })
  }, [])

  const setActivePhotoSlot = useCallback((slotIndex: number) => {
    setState((s) => ({ ...s, activePhotoSlot: slotIndex }))
  }, [])

  const setWebAppUrl = useCallback((webAppUrl: string) => {
    setState((s) => ({ ...s, webAppUrl }))
  }, [])

  const setCardTheme = useCallback((cardTheme: CardTheme) => {
    setState((s) => ({ ...s, cardTheme }))
  }, [])

  const toggleSkillTag = useCallback((skill: string) => {
    setState((s) => {
      const exists = s.selectedSkills.includes(skill)
      const newSkills = exists
        ? s.selectedSkills.filter((item) => item !== skill)
        : [...s.selectedSkills, skill]
      const updatedStack = newSkills.length > 0 ? newSkills.join(', ') : s.stack
      return {
        ...s,
        selectedSkills: newSkills,
        stack: updatedStack,
        builderClass: generateBuilderClass(updatedStack),
      }
    })
  }, [])

  const setPhoto = useCallback((index: number, dataUrl: string | null) => {
    setState((s) => {
      const photos = [...s.photos]
      photos[index] = dataUrl
      const photoPositions = [...s.photoPositions]
      photoPositions[index] = { x: 0, y: 0, zoom: 1 }
      return { ...s, photos, photoPositions, activePhotoSlot: index }
    })
  }, [])

  const applyPreset = useCallback((preset: {
    name: string
    stack: string
    skills: string[]
    theme: CardTheme
    photo: string
  }) => {
    setState((s) => {
      const photos = [...s.photos]
      photos[0] = preset.photo
      const photoPositions = [...s.photoPositions]
      photoPositions[0] = { x: 0, y: 0, zoom: 1 }
      return {
        ...s,
        name: preset.name,
        stack: preset.stack,
        selectedSkills: preset.skills,
        cardTheme: preset.theme,
        builderClass: generateBuilderClass(preset.stack),
        photos,
        photoPositions,
        activePhotoSlot: 0,
      }
    })
  }, [])

  const buildCaption = useCallback(() => {
    return `Just created my official ${
      state.output === 'id' ? 'Builder ID Card' : 'HH Goa 2026 frame'
    } 🌴 Scan the QR code or click the link to generate yours! #FrameInGoa`
  }, [state.output])

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    const safeName = (state.name || 'builder').replace(/\s+/g, '-').toLowerCase()
    const filename = `hhgoa-2026-${state.output}-${safeName}.png`
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast(`✅ ${state.output === 'id' ? 'Builder ID Card' : 'HH Goa Frame'} saved to downloads!`)
  }, [state.name, state.output, showToast])

  const shareToX = useCallback(async () => {
    const canvas = canvasRef.current
    const caption = buildCaption()
    const encodedText = encodeURIComponent(caption)
    const encodedUrl = encodeURIComponent(state.webAppUrl)

    // Open X (Twitter) intent window pre-filled with caption & web app url (enables rich graphic link preview)
    window.open(`https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`, '_blank')

    if (!canvas) return

    const safeName = (state.name || 'builder').replace(/\s+/g, '-').toLowerCase()
    const fileName = `hhgoa-2026-${state.output}-${safeName}.png`
    const dataUrl = canvas.toDataURL('image/png')
    const blob = dataURLtoBlob(dataUrl)

    // Copy exact image blob to system clipboard so user can press Ctrl+V / ⌘+V directly in X
    let copiedToClipboard = false
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ])
        copiedToClipboard = true
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err)
    }

    // Download PNG file to user's device as backup
    const link = document.createElement('a')
    link.download = fileName
    const blobUrl = URL.createObjectURL(blob)
    link.href = blobUrl
    link.click()
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)

    // Notify user
    if (copiedToClipboard) {
      showToast('📸 Image copied to clipboard & downloaded! Press Ctrl+V (⌘+V) to paste into your tweet.', 6000)
    } else {
      showToast('📸 Image saved to downloads! Attach the downloaded file to your tweet.', 6000)
    }
  }, [buildCaption, state.name, state.output, state.webAppUrl, showToast])

  return {
    state,
    canvasRef,
    isQRModalOpen,
    toastMessage,
    setIsQRModalOpen,
    showToast,
    setMode,
    setOutput,
    setName,
    setStack,
    setBuilderClass,
    setHouseName,
    updatePhotoPosition,
    resetPhotoPosition,
    setActivePhotoSlot,
    setWebAppUrl,
    setCardTheme,
    toggleSkillTag,
    setPhoto,
    applyPreset,
    buildCaption,
    download,
    shareToX,
  }
}
