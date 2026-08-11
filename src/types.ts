export type FrameMode = 'solo' | 'team'
export type OutputMode = 'frame' | 'id'
export type CardTheme = 'emerald' | 'sunset' | 'midnight' | 'solana'

export interface PhotoPosition {
  x: number
  y: number
  zoom: number
}

export interface BuilderState {
  mode: FrameMode
  photos: (string | null)[]
  photoPositions: PhotoPosition[]
  activePhotoSlot: number
  name: string
  stack: string
  builderClass: string
  houseName: string
  output: OutputMode
  webAppUrl: string
  cardTheme: CardTheme
  selectedSkills: string[]
}
