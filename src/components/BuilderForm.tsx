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
  onSelectTheme,
  onToggleSkill,
}: Props) {
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

      <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-[9px] border border-dashed border-goa-green bg-gradient-to-r from-goa-green/[0.08] to-goa-pink/[0.06]">
        <div className="w-[26px] h-[26px] rounded-full bg-goa-amber flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#123F2A" strokeWidth={2} strokeLinecap="round" className="w-3.5 h-3.5">
            <path d="M12 2l2.5 6.5H21l-5.5 4 2 6.5L12 15l-5.5 4 2-6.5L3 8.5h6.5z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-goa-green-dark">{builderClass}</span>
      </div>
    </div>
  )
}
