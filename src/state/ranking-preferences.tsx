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
const DEFAULT_PREFERENCES = {
  metric: 'bust' as MetricKey,
  direction: 'desc' as SortDirection,
}
const RankingPreferencesContext = createContext<RankingPreferences | null>(null)
const metricKeys: MetricKey[] = ['bust', 'waist', 'hips']
const sortDirections: SortDirection[] = ['asc', 'desc']

function readStoredPreferences() {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return DEFAULT_PREFERENCES
    }

    const parsed = JSON.parse(raw) as Partial<{ metric: MetricKey; direction: SortDirection }>
    const metric = metricKeys.includes(parsed.metric as MetricKey)
      ? parsed.metric!
      : DEFAULT_PREFERENCES.metric
    const direction = sortDirections.includes(parsed.direction as SortDirection)
      ? parsed.direction!
      : DEFAULT_PREFERENCES.direction

    return { metric, direction }
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      return DEFAULT_PREFERENCES
    }

    return DEFAULT_PREFERENCES
  }
}

export function RankingPreferencesProvider({ children }: PropsWithChildren) {
  const [{ metric, direction }, setPreferences] = useState(readStoredPreferences)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ metric, direction }))
    } catch {
      return
    }
  }, [direction, metric])

  const value = useMemo<RankingPreferences>(
    () => ({
      metric,
      direction,
      setMetric: (nextMetric) =>
        setPreferences((current) => ({
          ...current,
          metric: nextMetric,
        })),
      toggleDirection: () =>
        setPreferences((current) => ({
          ...current,
          direction: current.direction === 'desc' ? 'asc' : 'desc',
        })),
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
