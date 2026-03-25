import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { idols } from '../data/idols'
import { MetricToggle } from '../components/MetricToggle'
import { IdolVisual } from '../components/IdolVisual'
import { RankingRow } from '../components/RankingRow'
import {
  directionLabels,
  formatRank,
  getMetricRange,
  getUnitName,
  metricLabels,
  sortIdols,
} from '../lib/ranking'
import { useRankingPreferences } from '../state/ranking-preferences'

export function HomePage() {
  const { metric, direction } = useRankingPreferences()
  const sorted = sortIdols(idols, metric, direction)
  const { min, max } = getMetricRange(idols, metric)
  const topThree = sorted.slice(0, 3)
  const [coverLead, ...coverStack] = topThree
  const rest = sorted.slice(3)
  const leading = sorted[0]
  const trailing = sorted[sorted.length - 1]
  const spread = max - min
  const summaryItems = [
    {
      label: 'Top',
      value: `${leading.measurements[metric]} cm`,
      detail: leading.japaneseName,
    },
    {
      label: 'Tail',
      value: `${trailing.measurements[metric]} cm`,
      detail: trailing.japaneseName,
    },
    {
      label: 'Range',
      value: `${spread} cm`,
      detail: `${min} - ${max} cm`,
    },
    {
      label: 'Top Unit',
      value: getUnitName(leading.unit),
      detail: leading.japaneseName,
    },
  ]

  return (
    <main className="page page-home" id="main-content" tabIndex={-1}>
      <section className="hero-panel home-board" aria-labelledby="home-board-heading">
        <div className="home-board-header">
          <div className="home-board-copy">
            <p className="eyebrow">Current Metric</p>
            <p className="issue-meta">283 Production · 28 idols · {directionLabels[direction]}</p>
            <h1 id="home-board-heading">{metricLabels[metric]}排行</h1>
          </div>
          <MetricToggle />
        </div>

        <div className="home-board-main">
          <article
            className="home-featured"
            style={{ '--accent': coverLead.accent } as CSSProperties}
          >
            <div className="spotlight-rank">{formatRank(1)}</div>
            <IdolVisual idol={coverLead} priority />
            <div className="home-featured-copy">
              <p className="spotlight-meta">{getUnitName(coverLead.unit)}</p>
              <h2>{coverLead.name}</h2>
              <p>{coverLead.japaneseName}</p>
            </div>
            <div className="home-featured-value">
              <strong>{coverLead.measurements[metric]}</strong>
              <small>cm</small>
            </div>
          </article>

          <aside className="home-summary-rail" aria-label="当前摘要">
            {summaryItems.map((item) => (
              <article key={item.label} className="hero-stat home-stat">
                <span className="hero-stat-label">{item.label}</span>
                <strong className="hero-stat-value">{item.value}</strong>
                <small>{item.detail}</small>
              </article>
            ))}
          </aside>
        </div>

        <div className="home-board-lower">
          <div className="home-podium" aria-label="Top 3">
            {coverStack.map((idol, index) => (
              <article
                key={idol.id}
                className="home-podium-card"
                style={{ '--accent': idol.accent } as CSSProperties}
              >
                <div className="home-podium-rank">{formatRank(index + 2)}</div>
                <IdolVisual idol={idol} compact priority />
                <div className="home-podium-copy">
                  <p className="spotlight-meta">{getUnitName(idol.unit)}</p>
                  <h2>{idol.name}</h2>
                  <p>{idol.japaneseName}</p>
                </div>
                <div className="home-podium-value">
                  <strong>{idol.measurements[metric]}</strong>
                  <small>cm</small>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-links">
            <Link className="hero-link is-primary" to="/units">
              查看小组差异
            </Link>
            <Link className="hero-link" to="/compare">
              去做双人对比
            </Link>
          </div>
        </div>
      </section>

      <section className="ranking-shell ranking-shell-archive">
        <header className="section-heading">
          <div>
            <p className="section-kicker">Full Ranking</p>
            <h2>完整顺位</h2>
          </div>
        </header>

        <div className="ranking-list">
          {rest.map((idol, index) => (
            <RankingRow
              key={idol.id}
              idol={idol}
              rank={index + 4}
              metric={metric}
              min={min}
              max={max}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
