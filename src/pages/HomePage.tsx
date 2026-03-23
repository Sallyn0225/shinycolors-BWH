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
  const rest = sorted.slice(3)
  const leading = sorted[0]
  const trailing = sorted[sorted.length - 1]
  const spread = max - min

  return (
    <main className="page page-home" id="main-content" tabIndex={-1}>
      <div className="page-controls">
        <MetricToggle />
      </div>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">283 Production · 28 idols</p>
          <h1>{metricLabels[metric]}资料榜</h1>
          <p className="hero-intro">
            当前按{directionLabels[direction]}
            浏览。先看首位、跨度和跳转入口，再继续滑下去扫完整顺位。
          </p>

          <div className="hero-stat-list">
            <article className="hero-stat">
              <span className="hero-stat-label">当前首位</span>
              <strong className="hero-stat-value">{leading.japaneseName}</strong>
              <small>
                {getUnitName(leading.unit)} · {leading.measurements[metric]} cm
              </small>
            </article>
            <article className="hero-stat">
              <span className="hero-stat-label">当前末位</span>
              <strong className="hero-stat-value">{trailing.japaneseName}</strong>
              <small>
                {getUnitName(trailing.unit)} · {trailing.measurements[metric]} cm
              </small>
            </article>
            <article className="hero-stat">
              <span className="hero-stat-label">区间跨度</span>
              <strong className="hero-stat-value">{spread} cm</strong>
              <small>
                从 {min} cm 到 {max} cm
              </small>
            </article>
            <article className="hero-stat">
              <span className="hero-stat-label">当前浏览</span>
              <strong className="hero-stat-value">{metricLabels[metric]}</strong>
              <small>{directionLabels[direction]}</small>
            </article>
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

        <section className="hero-showcase" aria-labelledby="spotlight-heading">
          <h2 className="sr-only" id="spotlight-heading">
            当前前排
          </h2>
          {topThree.map((idol, index) => (
            <article
              key={idol.id}
              className="spotlight-card"
              style={{ '--accent': idol.accent } as CSSProperties}
            >
              <div className="spotlight-rank">{formatRank(index + 1)}</div>
              <IdolVisual idol={idol} compact priority />
              <div className="spotlight-copy">
                <p className="spotlight-meta">{getUnitName(idol.unit)}</p>
                <h2>{idol.name}</h2>
                <p>{idol.japaneseName}</p>
              </div>
              <div className="spotlight-value">
                <strong>{idol.measurements[metric]}</strong>
                <small>cm</small>
              </div>
            </article>
          ))}
        </section>
      </section>

      <section className="ranking-shell">
        <header className="section-heading">
          <div>
            <p className="section-kicker">Full Ranking</p>
            <h2>完整顺位</h2>
          </div>
          <p>从第 4 位开始继续浏览全员顺位，快速对照组合与数值差距。</p>
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
