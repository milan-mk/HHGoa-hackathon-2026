export function Header() {
  return (
    <header className="flex items-center justify-between max-w-[1080px] mx-auto px-6 pt-7 pb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-[38px] h-[38px] rounded-full bg-goa-green border-2 border-dashed border-goa-pink flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FBF3DD" strokeWidth={2} strokeLinecap="round" className="w-[18px] h-[18px]">
            <path d="M12 2v20M4 10c4 0 4-6 8-6s4 6 8 6" />
          </svg>
        </div>
        <span className="font-display font-bold text-lg text-goa-green-dark">HH Goa 2026</span>
      </div>
      <div className="font-mono text-xs font-medium text-goa-pink-dark bg-white border border-goa-pink rounded-full px-3.5 py-1.5 tracking-wide">
        CLOSES AUG 13, 11:59 PM IST
      </div>
    </header>
  )
}
