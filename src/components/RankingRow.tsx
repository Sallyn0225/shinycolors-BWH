import type { CSSProperties } from 'react'
import type { IdolRecord, MetricKey } from '../types'
import { formatRank, getBarPercentage, getMetricValue, getUnitName } from '../lib/ranking'
import { IdolVisual } from './IdolVisual'

interface RankingRowProps {
  idol: IdolRecord
  rank: number
  metric: MetricKey
  min: number
  max: number
  showUnit?: boolean
  compact?: boolean
}

export function RankingRow({
  idol,
  rank,
  metric,
  min,
  max,
  showUnit = true,
  compact = false,
}: RankingRowProps) {
  const value = getMetricValue(idol, metric)
  const width = getBarPercentage(value, min, max)

  return (
    <article
      className={`ranking-row ${compact ? 'is-condensed' : ''} ${showUnit ? '' : 'has-no-unit'}`.trim()}
      style={{ '--accent': idol.accent } as CSSProperties}
    >
      <div className="ranking-index">
        <span>Rank</span>
        <strong>{formatRank(rank)}</strong>
      </div>

      <div className="ranking-identity">
        <IdolVisual idol={idol} compact />
        <div>
          <h3>{idol.name}</h3>
          <p>{idol.japaneseName}</p>
        </div>
      </div>

      {showUnit ? (
        <div className="ranking-unit">
          <span>Unit</span>
          <strong>{getUnitName(idol.unit)}</strong>
        </div>
      ) : null}

      <div className="ranking-bar-wrap" aria-hidden="true">
        <div className="ranking-bar-track">
          <div className="ranking-bar-fill" style={{ width: `${width}%` }} />
        </div>
      </div>

      <div className="ranking-value">
        <span>{value}</span>
        <small>cm</small>
      </div>
    </article>
  )
}
