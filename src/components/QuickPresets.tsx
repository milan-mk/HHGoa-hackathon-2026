import type { CardTheme } from '../types'

interface Preset {
  id: string
  name: string
  role: string
  stack: string
  skills: string[]
  theme: CardTheme
  photo: string
}

interface Props {
  onApplyPreset: (preset: Preset) => void
}

function createAvatarSvg(bg: string, emoji: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="${bg}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="120">${emoji}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const SAMPLE_PRESETS: Preset[] = [
  {
    id: 'ai-hacker',
    name: 'Milan Modak',
    role: 'AI Engineer',
    stack: 'React, Groq API, FastAPI, Python',
    skills: ['AI / LLM', 'React', 'Python', 'FastAPI'],
    theme: 'emerald',
    photo: createAvatarSvg('#10B981', '🤖'),
  },
  {
    id: 'solana-dev',
    name: 'Alex Rivera',
    role: 'Web3 Architect',
    stack: 'Rust, Solana, TypeScript, Next.js',
    skills: ['Solana', 'Rust', 'TypeScript', 'Smart Contracts'],
    theme: 'solana',
    photo: createAvatarSvg('#9945FF', '⚡'),
  },
  {
    id: 'cyber-hacker',
    name: 'Sarah Chen',
    role: 'Fullstack Nomad',
    stack: 'React, Node.js, Tailwind, GraphQL',
    skills: ['React', 'Node.js', 'Tailwind', 'UI/UX'],
    theme: 'sunset',
    photo: createAvatarSvg('#EC4899', '🚀'),
  },
  {
    id: 'gold-vip',
    name: 'Aria Sharma',
    role: 'Design Hacker',
    stack: 'Figma, React, Three.js, AI',
    skills: ['UI/UX', 'React', 'AI / LLM', 'TypeScript'],
    theme: 'midnight',
    photo: createAvatarSvg('#E5BA73', '👑'),
  },
]

export function QuickPresets({ onApplyPreset }: Props) {
  return (
    <div className="mb-5 bg-gradient-to-r from-goa-cream to-cream-2 border border-goa-line rounded-[12px] p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold text-goa-green-dark uppercase tracking-wider flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-goa-pink animate-pulse" />
          Quick Preset Profiles
        </span>
        <span className="text-[11px] text-goa-ink-soft">Click to autofill sample</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="flex items-center gap-2 p-2 bg-white border border-goa-line rounded-[9px] hover:border-goa-pink hover:shadow-xs active:scale-[0.97] transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-goa-line group-hover:scale-105 transition-transform">
              <img src={preset.photo} alt={preset.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-goa-ink truncate group-hover:text-goa-pink">
                {preset.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-goa-ink-soft truncate">{preset.role}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
