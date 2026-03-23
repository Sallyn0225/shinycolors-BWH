import { idols } from '../data/idols'
import { metricLabels, getMetricRange, sortIdols } from '../lib/ranking'
import { useRankingPreferences } from '../state/ranking-preferences'
import { RankingRow } from '../components/RankingRow'

export function HomePage() {
  const { metric, direction } = useRankingPreferences()
  const sorted = sortIdols(idols, metric, direction)
  const { min, max } = getMetricRange(idols, metric)

  return (
    <main className="page page-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">283 Production • 28 idols</p>
          <h1>闪耀色彩三围可视化排行</h1>
          <p className="hero-text">
            把 28 名偶像的胸围、腰围、臀围做成一面能滑动浏览的舞台榜单。当前聚焦：
            <strong>{metricLabels[metric]}</strong>。
          </p>
        </div>
      </section>

      <section className="ranking-list">
        {sorted.map((idol, index) => (
          <RankingRow
            key={idol.id}
            idol={idol}
            rank={index + 1}
            metric={metric}
            min={min}
            max={max}
          />
        ))}
      </section>
    </main>
  )
}
