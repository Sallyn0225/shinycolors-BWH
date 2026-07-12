import { allUnits, memberById, type Direction, type Metric, type Theme } from './data'

export type Route = 'overall' | 'units' | 'compare'

export interface OverallState {
  route: 'overall'
  metric: Metric
  unitId?: string
  query: string
  direction: Direction
  theme: Theme
}

export interface UnitsState {
  route: 'units'
  metric: Metric
  direction: Direction
  theme: Theme
}

export interface CompareState {
  route: 'compare'
  memberA?: string
  memberB?: string
  theme: Theme
}

export type AppState = OverallState | UnitsState | CompareState

const validMetrics: Metric[] = ['bust', 'waist', 'hip']
const validDirections: Direction[] = ['asc', 'desc']
const validThemes: Theme[] = ['system', 'light', 'dark']
const validUnitIds = new Set(allUnits.map((unit) => unit.id))

function isMetric(value: string | null): value is Metric {
  return value !== null && validMetrics.includes(value as Metric)
}

function isDirection(value: string | null): value is Direction {
  return value !== null && validDirections.includes(value as Direction)
}

function isTheme(value: string | null): value is Theme {
  return value !== null && validThemes.includes(value as Theme)
}

function storedTheme() {
  try {
    const value = window.localStorage.getItem('shiny-colors-theme')
    return isTheme(value) ? value : 'system'
  } catch {
    return 'system' as Theme
  }
}

function getHashParts(hash: string) {
  const value = hash.startsWith('#') ? hash.slice(1) : hash
  const [path = '/', query = ''] = value.split('?')
  return { path, params: new URLSearchParams(query) }
}

export function parseHash(hash: string, themeFallback?: Theme): { state: AppState; canonicalHash: string } {
  const { path, params } = getHashParts(hash)
  const rawTheme = params.get('theme')
  const theme: Theme = isTheme(rawTheme) ? rawTheme : themeFallback ?? storedTheme()

  if (path === '/units') {
    const rawMetric = params.get('metric')
    const rawDirection = params.get('dir')
    const state: UnitsState = {
      route: 'units',
      metric: isMetric(rawMetric) ? rawMetric : 'bust',
      direction: isDirection(rawDirection) ? rawDirection : 'desc',
      theme,
    }
    return { state, canonicalHash: serializeState(state) }
  }

  if (path === '/compare') {
    const memberA = params.get('a') && memberById.has(params.get('a')!) ? params.get('a')! : undefined
    const rawMemberB = params.get('b') && memberById.has(params.get('b')!) ? params.get('b')! : undefined
    const state: CompareState = { route: 'compare', theme }
    if (memberA) state.memberA = memberA
    if (rawMemberB && rawMemberB !== memberA) state.memberB = rawMemberB
    return { state, canonicalHash: serializeState(state) }
  }

  const rawUnit = params.get('unit')
  const unitId = rawUnit && validUnitIds.has(rawUnit) ? rawUnit : undefined
  const query = params.get('q')?.trim() ?? ''
  const rawMetric = params.get('metric')
  const rawDirection = params.get('dir')
  const state: OverallState = {
    route: 'overall',
    metric: isMetric(rawMetric) ? rawMetric : 'bust',
    unitId,
    query,
    direction: isDirection(rawDirection) ? rawDirection : 'desc',
    theme,
  }
  return { state, canonicalHash: serializeState(state) }
}

function appendOptional(params: URLSearchParams, key: string, value: string | undefined, omit?: string) {
  if (value && value !== omit) params.set(key, value)
}

export function serializeState(state: AppState) {
  const params = new URLSearchParams()
  if (state.route === 'overall') {
    appendOptional(params, 'metric', state.metric, 'bust')
    appendOptional(params, 'unit', state.unitId)
    appendOptional(params, 'q', state.query.trim())
    appendOptional(params, 'dir', state.direction, 'desc')
  } else if (state.route === 'units') {
    appendOptional(params, 'metric', state.metric, 'bust')
    appendOptional(params, 'dir', state.direction, 'desc')
  } else {
    appendOptional(params, 'a', state.memberA)
    appendOptional(params, 'b', state.memberB)
  }
  appendOptional(params, 'theme', state.theme, 'system')
  const query = params.toString()
  return `#/${state.route}${query ? `?${query}` : ''}`
}

export function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem('shiny-colors-theme', theme)
  } catch {
    // Private browsing can deny storage. The URL still preserves the choice.
  }
}
