import { unitDefinitions } from '../data/idols'
import type { IdolRecord, MetricKey, SortDirection, UnitKey } from '../types'

export const metricLabels: Record<MetricKey, string> = {
  bust: '胸围',
  waist: '腰围',
  hips: '臀围',
}

export const directionLabels: Record<SortDirection, string> = {
  desc: '从大到小',
  asc: '从小到大',
}

export function getMetricValue(idol: IdolRecord, metric: MetricKey): number {
  return idol.measurements[metric]
}

export function sortIdols(
  list: IdolRecord[],
  metric: MetricKey,
  direction: SortDirection,
): IdolRecord[] {
  const factor = direction === 'desc' ? -1 : 1

  return [...list].sort((left, right) => {
    const valueDelta = left.measurements[metric] - right.measurements[metric]
    if (valueDelta !== 0) {
      return valueDelta * factor
    }

    return left.name.localeCompare(right.name)
  })
}

export function formatRank(value: number): string {
  return value.toString().padStart(2, '0')
}

export function getMetricRange(
  list: IdolRecord[],
  metric: MetricKey,
): { min: number; max: number } {
  const values = list.map((idol) => idol.measurements[metric])
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

export function getBarPercentage(value: number, min: number, max: number): number {
  if (max === min) {
    return 100
  }

  const minimumVisiblePercent = 18
  const normalized = (value - min) / (max - min)
  return minimumVisiblePercent + normalized * (100 - minimumVisiblePercent)
}

export function getUnitName(unit: UnitKey): string {
  return unitDefinitions.find((item) => item.id === unit)?.name ?? unit
}

export function getUnitAverage(list: IdolRecord[], metric: MetricKey): number {
  const total = list.reduce((sum, idol) => sum + idol.measurements[metric], 0)
  return Number((total / list.length).toFixed(1))
}

export function compareMetrics(left: IdolRecord, right: IdolRecord) {
  return (['bust', 'waist', 'hips'] as MetricKey[]).map((metric) => {
    const leftValue = left.measurements[metric]
    const rightValue = right.measurements[metric]

    return {
      metric,
      leftValue,
      rightValue,
      difference: Math.abs(leftValue - rightValue),
      winner: leftValue === rightValue ? 'draw' : leftValue > rightValue ? 'left' : 'right',
    }
  })
}
