import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { MetricKey, SortDirection } from '../types'

interface RankingPreferences {
  metric: MetricKey
  direction: SortDirection
  setMetric: (metric: MetricKey) => void
  toggleDirection: () => void
}

const STORAGE_KEY = 'shinycolors-bwh-preferences'
const RankingPreferencesContext = createContext<RankingPreferences | null>(null)
const metricKeys: MetricKey[] = ['bust', 'waist', 'hips']
const sortDirections: SortDirection[] = ['asc', 'desc']

function readStoredPreferences() {
  if (typeof window === 'undefined') {
    return { metric: 'bust' as MetricKey, direction: 'desc' as SortDirection }
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { metric: 'bust' as MetricKey, direction: 'desc' as SortDirection }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<{ metric: MetricKey; direction: SortDirection }>
    const metric = metricKeys.includes(parsed.metric as MetricKey) ? parsed.metric! : 'bust'
    const direction = sortDirections.includes(parsed.direction as SortDirection)
      ? parsed.direction!
      : 'desc'

    return { metric, direction }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return { metric: 'bust' as MetricKey, direction: 'desc' as SortDirection }
  }
}

export function RankingPreferencesProvider({ children }: PropsWithChildren) {
  const [metric, setMetric] = useState<MetricKey>(() => readStoredPreferences().metric)
  const [direction, setDirection] = useState<SortDirection>(() => readStoredPreferences().direction)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ metric, direction }))
  }, [direction, metric])

  const value = useMemo<RankingPreferences>(
    () => ({
      metric,
      direction,
      setMetric,
      toggleDirection: () => setDirection((current) => (current === 'desc' ? 'asc' : 'desc')),
    }),
    [direction, metric],
  )

  return (
    <RankingPreferencesContext.Provider value={value}>
      {children}
    </RankingPreferencesContext.Provider>
  )
}

export function useRankingPreferences() {
  const context = useContext(RankingPreferencesContext)
  if (!context) {
    throw new Error('useRankingPreferences must be used within RankingPreferencesProvider')
  }

  return context
}
