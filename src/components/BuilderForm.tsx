import { useRef } from 'react'
import type { CardTheme } from '../types'
import { ThemeSelector } from './ThemeSelector'
import { SkillTagsInput } from './SkillTagsInput'

interface Props {
  name: string
  stack: string
  builderClass: string
  cardTheme: CardTheme
  selectedSkills: string[]
  onName: (v: string) => void
  onStack: (v: string) => void
  onBuilderClass: (v: string) => void
  onSelectTheme: (v: CardTheme) => void
  onToggleSkill: (skill: string) => void
}

export function BuilderForm({
  name,
  stack,
  builderClass,
  cardTheme,
  selectedSkills,
  onName,
  onStack,
  onBuilderClass,
  onSelectTheme,
  onToggleSkill,
}: Props) {
  const roleInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mt-6">
      <ThemeSelector currentTheme={cardTheme} onSelectTheme={onSelectTheme} />

      <div className="mb-4">
        <label className="block text-xs font-semibold text-goa-ink-soft uppercase tracking-wide mb-1.5">
          Your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder="e.g. Your Name"
          className="w-full px-3.5 py-2.5 rounded-[9px] border border-goa-line bg-cream-2 text-sm focus:outline-none focus:border-goa-pink"
        />
      </div>

      <SkillTagsInput selectedSkills={selectedSkills} onToggleSkill={onToggleSkill} />

      <div className="mb-4">
        <label className="block text-xs font-semibold text-goa-ink-soft uppercase tracking-wide mb-1.5">
          Custom Stack / Extra Tools
        </label>
        <input
          type="text"
          value={stack}
          onChange={(e) => onStack(e.target.value)}
          placeholder="e.g. React, FastAPI, Groq API"
          className="w-full px-3.5 py-2.5 rounded-[9px] border border-goa-line bg-cream-2 text-sm focus:outline-none focus:border-goa-pink"
        />
      </div>

      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[9px] border border-dashed border-goa-green bg-gradient-to-r from-goa-green/[0.08] to-goa-pink/[0.06] focus-within:border-goa-pink focus-within:ring-1 focus-within:ring-goa-pink transition-all">
        <div className="w-[26px] h-[26px] rounded-full bg-goa-amber flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#123F2A" strokeWidth={2} strokeLinecap="round" className="w-3.5 h-3.5">
            <path d="M12 2l2.5 6.5H21l-5.5 4 2 6.5L12 15l-5.5 4 2-6.5L3 8.5h6.5z" />
          </svg>
        </div>
        <input
          ref={roleInputRef}
          type="text"
          value={builderClass}
          onChange={(e) => onBuilderClass(e.target.value)}
          placeholder="e.g. Goa Wildcard Builder, Frontend Alchemist"
          className="bg-transparent text-[13px] font-semibold text-goa-green-dark w-full focus:outline-none placeholder:text-goa-ink-soft/50"
        />
        <button
          type="button"
          onClick={() => roleInputRef.current?.focus()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white/90 hover:bg-white text-goa-green-dark border border-goa-line text-[11px] font-semibold shrink-0 shadow-xs hover:border-goa-pink hover:text-goa-pink transition-all cursor-pointer"
          title="Click to edit role name"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
      </div>
    </div>
  )
}
