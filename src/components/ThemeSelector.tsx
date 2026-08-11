import type { CardTheme } from '../types'

interface Props {
  currentTheme: CardTheme
  onSelectTheme: (theme: CardTheme) => void
}

const THEME_OPTIONS: { id: CardTheme; label: string; bgGradient: string; badgeColor: string }[] = [
  {
    id: 'emerald',
    label: 'Goa Sunset',
    bgGradient: 'from-[#0A3F27] via-[#0D6E43] to-[#FFC72C]',
    badgeColor: 'bg-[#E91467]',
  },
  {
    id: 'sunset',
    label: 'Cyber Pink',
    bgGradient: 'from-[#E91467] to-[#D946EF]',
    badgeColor: 'bg-[#FFC72C]',
  },
  {
    id: 'midnight',
    label: 'Gold Obsidian',
    bgGradient: 'from-[#1E1B18] to-[#3D3429]',
    badgeColor: 'bg-[#FFC72C]',
  },
  {
    id: 'solana',
    label: 'Solana Tropics',
    bgGradient: 'from-[#9945FF] to-[#14F195]',
    badgeColor: 'bg-[#14F195]',
  },
]

export function ThemeSelector({ currentTheme, onSelectTheme }: Props) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-goa-ink-soft uppercase tracking-wide mb-2">
        ID Card Color Palette
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {THEME_OPTIONS.map((theme) => {
          const isActive = currentTheme === theme.id
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`flex items-center gap-2 p-2 rounded-[10px] border transition-all text-left ${
                isActive
                  ? 'border-goa-pink bg-cream shadow-sm ring-2 ring-goa-pink/20 scale-[1.02]'
                  : 'border-goa-line bg-cream-2 hover:bg-cream hover:border-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.bgGradient} relative flex items-center justify-center shrink-0 shadow-inner`}
              >
                <div className={`w-2 h-2 rounded-full ${theme.badgeColor}`} />
              </div>
              <span className="text-xs font-medium text-goa-ink truncate">{theme.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
