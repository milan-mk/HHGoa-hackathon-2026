import { useEffect, useRef, useState, useCallback } from 'react'
import type { BuilderState, CardTheme, FrameMode, OutputMode } from '../types'
import { generateBuilderClass } from '../lib/builderClass'
import { renderFrame } from '../lib/renderFrame'
import { renderIDCard } from '../lib/renderIDCard'

const getDefaultUrl = () => {
  if (typeof window !== 'undefined' && window.location.href.startsWith('http')) {
    return window.location.href.split('?')[0].split('#')[0]
  }
  return 'http://localhost:5173'
}

const INITIAL_STATE: BuilderState = {
  mode: 'solo',
  photos: [null, null, null, null],
  name: '',
  stack: 'React, TypeScript, Tailwind, AI',
  builderClass: generateBuilderClass('React, TypeScript, Tailwind, AI'),
  output: 'frame',
  webAppUrl: getDefaultUrl(),
  cardTheme: 'emerald',
  selectedSkills: ['React', 'TypeScript', 'AI / LLM'],
}

export function useBuilderStudio() {
  const [state, setState] = useState<BuilderState>(INITIAL_STATE)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
      return { ...s, photos }
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
      return {
        ...s,
        name: preset.name,
        stack: preset.stack,
        selectedSkills: preset.skills,
        cardTheme: preset.theme,
        builderClass: generateBuilderClass(preset.stack),
        photos,
      }
    })
  }, [])

  const buildCaption = useCallback(() => {
    return `Just created my official ${
      state.output === 'id' ? 'Builder ID Card' : 'HH Goa 2026 frame'
    } \u{1F334} Scan the QR code or click the link to generate yours! #FrameInGoa`
  }, [state.output])

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    const safeName = (state.name || 'builder').replace(/\s+/g, '-').toLowerCase()
    link.download = `hhgoa-2026-${state.output}-${safeName}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [state.name, state.output])

  const shareToX = useCallback(() => {
    const text = encodeURIComponent(buildCaption())
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }, [buildCaption])

  return {
    state,
    canvasRef,
    isQRModalOpen,
    setIsQRModalOpen,
    setMode,
    setOutput,
    setName,
    setStack,
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

