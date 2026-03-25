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
      label: 'Lead',
      value: leading.japaneseName,
      detail: `${getUnitName(leading.unit)} · ${leading.measurements[metric]} cm`,
    },
    {
      label: 'Tail',
      value: trailing.japaneseName,
      detail: `${getUnitName(trailing.unit)} · ${trailing.measurements[metric]} cm`,
    },
    {
      label: 'Spread',
      value: `${spread} cm`,
      detail: `${min} cm → ${max} cm`,
    },
    {
      label: 'Metric',
      value: metricLabels[metric],
      detail: directionLabels[direction],
    },
  ]

  return (
    <main className="page page-home" id="main-content" tabIndex={-1}>
      <div className="page-controls">
        <MetricToggle />
      </div>

      <section className="hero-panel issue-hero">
        <div className="hero-copy issue-copy">
          <p className="eyebrow">Current Issue</p>
          <p className="issue-meta">283 Production · 28 idols · ranking archive</p>
          <h1>{metricLabels[metric]}资料榜</h1>
          <p className="hero-intro">
            当前按{directionLabels[direction]}浏览。先扫这一项数据的前排与区间，再往下翻完整顺位和组内差异。
          </p>
          <p className="hero-note">
            本页像一期短篇数据刊物，封面只放当前最该看的名字，其余信息退到导读和榜单里。
          </p>

          <div className="hero-links">
            <Link className="hero-link is-primary" to="/units">
              查看小组差异
            </Link>
            <Link className="hero-link" to="/compare">
              去做双人对比
            </Link>
          </div>
        </div>

        <aside className="issue-summary-rail" aria-label="当前摘要">
          {summaryItems.map((item) => (
            <article
              key={item.label}
              className="hero-stat editorial-stat"
            >
              <span className="hero-stat-label">{item.label}</span>
              <strong className="hero-stat-value">{item.value}</strong>
              <small>{item.detail}</small>
            </article>
          ))}
        </aside>
      </section>

      <section className="editorial-spotlight" aria-labelledby="spotlight-heading">
        <header className="section-heading editorial-heading">
          <div>
            <p className="section-kicker">Cover Selection</p>
            <h2 id="spotlight-heading">当前封面组</h2>
          </div>
          <p>用一张主封面和两张侧栏卡先看前排，再进入完整档案页式榜单。</p>
        </header>

        <div className="spotlight-editorial-grid">
          <article
            className="spotlight-card spotlight-card-featured"
            style={{ '--accent': coverLead.accent } as CSSProperties}
          >
            <div className="spotlight-rank">{formatRank(1)}</div>
            <IdolVisual idol={coverLead} priority />
            <div className="spotlight-copy">
              <p className="spotlight-meta">{getUnitName(coverLead.unit)}</p>
              <h2>{coverLead.name}</h2>
              <p>{coverLead.japaneseName}</p>
            </div>
            <div className="spotlight-value">
              <strong>{coverLead.measurements[metric]}</strong>
              <small>cm</small>
            </div>
          </article>

          <div className="spotlight-stack">
            {coverStack.map((idol, index) => (
              <article
                key={idol.id}
                className="spotlight-card"
                style={{ '--accent': idol.accent } as CSSProperties}
              >
                <div className="spotlight-rank">{formatRank(index + 2)}</div>
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
          </div>
        </div>
      </section>

      <section className="ranking-shell ranking-shell-archive">
        <header className="section-heading">
          <div>
            <p className="section-kicker">Archive Ranking</p>
            <h2>完整顺位</h2>
          </div>
          <p>从第 4 位开始继续浏览全员顺位，用档案列表的方式快速扫名字、组合与数值差距。</p>
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
