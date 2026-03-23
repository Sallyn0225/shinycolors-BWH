import type { CSSProperties } from 'react'
import { MetricToggle } from '../components/MetricToggle'
import { RankingRow } from '../components/RankingRow'
import { UnitJumpTags } from '../components/UnitJumpTags'
import { idols, unitDefinitions } from '../data/idols'
import { getMetricRange, getUnitAverage, metricLabels, sortIdols } from '../lib/ranking'
import { useRankingPreferences } from '../state/ranking-preferences'

export function UnitsPage() {
  const { metric, direction } = useRankingPreferences()

  return (
    <main className="page page-units">
      <div className="page-controls">
        <MetricToggle />
      </div>

      <section className="hero-panel unit-page-intro">
        <div className="hero-copy">
          <p className="eyebrow">Unit Overview</p>
          <h1>按小组看差异</h1>
          <p className="hero-intro">
            同一项数据下，每组的人数、平均值和组内跨度会一起放在页首，方便先判断哪组更整齐、哪组反差更明显。
          </p>
        </div>
      </section>

      <UnitJumpTags />

      <div className="unit-section-list">
        {unitDefinitions.map((unit) => {
          const members = idols.filter((idol) => idol.unit === unit.id)
          const sorted = sortIdols(members, metric, direction)
          const descending = sortIdols(members, metric, 'desc')
          const ascending = sortIdols(members, metric, 'asc')
          const highest = descending[0]
          const lowest = ascending[0]
          const { min, max } = getMetricRange(members, metric)
          const spread = max - min

          return (
            <section key={unit.id} id={unit.id} className="unit-section">
              <header className="unit-header" style={{ '--accent': unit.accent } as CSSProperties}>
                <div>
                  <p className="section-kicker">Unit Focus</p>
                  <h2>{unit.name}</h2>
                  <p>{unit.description}</p>
                </div>

                <div className="unit-summary">
                  <article className="unit-stat">
                    <span>人数</span>
                    <strong>{members.length} 人</strong>
                  </article>
                  <article className="unit-stat">
                    <span>平均{metricLabels[metric]}</span>
                    <strong>{getUnitAverage(members, metric)} cm</strong>
                  </article>
                  <article className="unit-stat">
                    <span>最高</span>
                    <strong>
                      {highest.japaneseName} · {highest.measurements[metric]} cm
                    </strong>
                  </article>
                  <article className="unit-stat">
                    <span>跨度</span>
                    <strong>{spread} cm</strong>
                    <small>
                      最低 {lowest.japaneseName} · {lowest.measurements[metric]} cm
                    </small>
                  </article>
                </div>
              </header>

              <div className="ranking-list unit-ranking-list">
                {sorted.map((idol, index) => (
                  <RankingRow
                    key={idol.id}
                    idol={idol}
                    rank={index + 1}
                    metric={metric}
                    min={min}
                    max={max}
                    showUnit={false}
                    compact
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
