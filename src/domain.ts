import {
  allMembers,
  type Direction,
  globalRanges,
  type Idol,
  type Metric,
  type Unit,
} from './data'

export interface MemberFilters {
  unitId?: string
  query: string
}

export interface RankedMember {
  member: Idol
  rank: number
  /** Rank among the full roster for the same metric/direction; equals `rank` when unfiltered. */
  globalRank: number
}

export interface UnitSummary {
  unit: Unit
  count: number
  sum: number
  average: number
  min: number
  max: number
  rank: number
}

export function normalizeSearch(value: string) {
  return value.normalize('NFKC').trim()
}

export function filterMembers(members: Idol[], filters: MemberFilters) {
  const query = normalizeSearch(filters.query).toLocaleLowerCase()
  return members.filter((member) => {
    const unitMatches = !filters.unitId || member.unitId === filters.unitId
    if (!unitMatches) return false
    if (!query) return true
    return `${member.nameJa} ${member.nameEn}`.toLocaleLowerCase().includes(query)
  })
}

export function sortMembers(members: Idol[], metric: Metric, direction: Direction) {
  return [...members].sort((left, right) => {
    const valueDifference = left.measurements[metric] - right.measurements[metric]
    if (valueDifference !== 0) return direction === 'desc' ? -valueDifference : valueDifference
    return left.sourceOrder - right.sourceOrder
  })
}

export function rankMembers(
  members: Idol[],
  metric: Metric,
  direction: Direction,
  options?: { globalMembers?: Idol[] },
): RankedMember[] {
  const sorted = sortMembers(members, metric, direction)
  let rank = 0
  const localRanks = sorted.map((member, index) => {
    if (index === 0 || member.measurements[metric] !== sorted[index - 1].measurements[metric]) {
      rank = index + 1
    }
    return { member, rank }
  })

  const globalPool = options?.globalMembers
  if (!globalPool || globalPool === members) {
    return localRanks.map((row) => ({ ...row, globalRank: row.rank }))
  }

  const globalSorted = sortMembers(globalPool, metric, direction)
  const globalRankById = new Map<string, number>()
  let globalRank = 0
  globalSorted.forEach((member, index) => {
    if (
      index === 0 ||
      member.measurements[metric] !== globalSorted[index - 1].measurements[metric]
    ) {
      globalRank = index + 1
    }
    globalRankById.set(member.id, globalRank)
  })

  return localRanks.map((row) => ({
    ...row,
    globalRank: globalRankById.get(row.member.id) ?? row.rank,
  }))
}

export function progressPercent(value: number, metric: Metric) {
  const range = globalRanges[metric]
  if (range.min === range.max) return 100
  return 12 + (88 * (value - range.min)) / (range.max - range.min)
}

function compareFractions(leftSum: number, leftCount: number, rightSum: number, rightCount: number) {
  return leftSum * rightCount - rightSum * leftCount
}

export function summarizeUnit(unit: Unit, metric: Metric): Omit<UnitSummary, 'rank'> {
  const values = unit.members.map((member) => member.measurements[metric])
  const sum = values.reduce((total, value) => total + value, 0)
  return {
    unit,
    count: values.length,
    sum,
    average: sum / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

export function rankUnits(units: Unit[], metric: Metric, direction: Direction): UnitSummary[] {
  const summaries = units.map((unit) => summarizeUnit(unit, metric))
  const sorted = summaries.sort((left, right) => {
    const difference = compareFractions(left.sum, left.count, right.sum, right.count)
    if (difference !== 0) return direction === 'desc' ? -difference : difference
    return left.unit.sourceOrder - right.unit.sourceOrder
  })

  let rank = 0
  return sorted.map((summary, index) => {
    const previous = sorted[index - 1]
    const tied = previous && compareFractions(summary.sum, summary.count, previous.sum, previous.count) === 0
    if (!tied) rank = index + 1
    return { ...summary, rank }
  })
}

export function unitProgressPercent(average: number, summaries: UnitSummary[]) {
  const min = Math.min(...summaries.map((summary) => summary.average))
  const max = Math.max(...summaries.map((summary) => summary.average))
  if (min === max) return 100
  return 12 + (88 * (average - min)) / (max - min)
}

export function relativePosition(value: number, metric: Metric) {
  const range = globalRanges[metric]
  if (range.min === range.max) return 0.5
  return (value - range.min) / (range.max - range.min)
}

export function difference(left: Idol, right: Idol, metric: Metric) {
  return left.measurements[metric] - right.measurements[metric]
}

export function formatAverage(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export function getAllMembers() {
  return allMembers
}
