const STEPS = ['Choose photos', 'Add your details', 'Download & share']

export function StepsNav() {
  return (
    <div className="flex gap-2 flex-wrap my-8">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={`flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full border ${
            i === 0
              ? 'bg-goa-green border-goa-green text-cream'
              : 'bg-white border-goa-line text-goa-ink-soft'
          }`}
        >
          <span
            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] ${
              i === 0 ? 'bg-white/25' : 'bg-black/10'
            }`}
          >
            {i + 1}
          </span>
          {label}
        </div>
      ))}
    </div>
  )
}
