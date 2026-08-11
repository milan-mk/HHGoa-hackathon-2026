interface Props {
  selectedSkills: string[]
  onToggleSkill: (skill: string) => void
}

const AVAILABLE_SKILLS = [
  'React',
  'TypeScript',
  'AI / LLM',
  'Solana',
  'Python',
  'Tailwind',
  'Rust',
  'FastAPI',
  'Next.js',
  'UI/UX',
  'Node.js',
  'Smart Contracts',
]

export function SkillTagsInput({ selectedSkills, onToggleSkill }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-goa-ink-soft uppercase tracking-wide mb-1.5">
        Quick Skill Badges (Select up to 4)
      </label>
      <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1">
        {AVAILABLE_SKILLS.map((skill) => {
          const isSelected = selectedSkills.includes(skill)
          return (
            <button
              key={skill}
              type="button"
              onClick={() => onToggleSkill(skill)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-goa-green text-cream border border-goa-green-dark shadow-xs scale-[1.03]'
                  : 'bg-white text-goa-ink-soft border border-goa-line hover:border-goa-green hover:text-goa-green-dark'
              }`}
            >
              {isSelected ? `✓ ${skill}` : `+ ${skill}`}
            </button>
          )
        })}
      </div>
    </div>
  )
}
