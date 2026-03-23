export type MetricKey = 'bust' | 'waist' | 'hips'
export type SortDirection = 'desc' | 'asc'

export type UnitKey =
  | 'illumination-stars'
  | 'l-antica'
  | 'houkago-climax-girls'
  | 'alstroemeria'
  | 'straylight'
  | 'noctchill'
  | 'shhis'
  | 'cometik'

export interface IdolRecord {
  id: string
  name: string
  japaneseName: string
  unit: UnitKey
  accent: string
  measurements: {
    bust: number
    waist: number
    hips: number
  }
  sourceUrl: string
}
