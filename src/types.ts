export type FrameMode = 'solo' | 'team'
export type OutputMode = 'frame' | 'id'
export type CardTheme = 'emerald' | 'sunset' | 'midnight' | 'solana'

export interface BuilderState {
  mode: FrameMode
  photos: (string | null)[]
  name: string
  stack: string
  builderClass: string
  output: OutputMode
  webAppUrl: string
  cardTheme: CardTheme
  selectedSkills: string[]
}

