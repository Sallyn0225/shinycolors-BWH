import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { IdolVisual } from '../components/IdolVisual'
import { MetricToggle } from '../components/MetricToggle'
import { idols } from '../data/idols'
import { compareMetrics, metricLabels } from '../lib/ranking'
import { useRankingPreferences } from '../state/ranking-preferences'

export function ComparePage() {
  const { metric } = useRankingPreferences()
  const [leftId, setLeftId] = useState('mano-sakuragi')
  const [rightId, setRightId] = useState('kogane-tsukioka')

  const left = idols.find((idol) => idol.id === leftId) ?? idols[0]
  const right = idols.find((idol) => idol.id === rightId) ?? idols[1]

  const comparisons = useMemo(() => compareMetrics(left, right), [left, right])

  return (
    <main className="page page-compare" id="main-content" tabIndex={-1}>
      <div className="page-controls">
        <MetricToggle showDirection={false} />
      </div>

      <section className="hero-panel compare-page-intro">
        <div className="hero-copy">
          <p className="eyebrow">Compare Stage</p>
          <h1>双人对比</h1>
          <p className="hero-intro">
            先选两位偶像，再用当前聚焦的 {metricLabels[metric]} 作为视觉重心去看三项数值的领先关系。
          </p>
        </div>
      </section>

      <section className="compare-pickers">
        <label className="picker">
          <span>左侧偶像</span>
          <select value={leftId} onChange={(event) => setLeftId(event.target.value)}>
            {idols.map((idol) => (
              <option key={idol.id} value={idol.id} disabled={idol.id === rightId}>
                {idol.japaneseName}
              </option>
            ))}
          </select>
        </label>

        <div className="compare-vs">VS</div>

        <label className="picker">
          <span>右侧偶像</span>
          <select value={rightId} onChange={(event) => setRightId(event.target.value)}>
            {idols.map((idol) => (
              <option key={idol.id} value={idol.id} disabled={idol.id === leftId}>
                {idol.japaneseName}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="compare-stage">
        <article
          className="compare-idol-panel"
          style={{ '--accent': left.accent } as CSSProperties}
        >
          <IdolVisual idol={left} priority />
          <div>
            <h2>{left.name}</h2>
            <p>{left.japaneseName}</p>
          </div>
        </article>

        <article className="compare-scoreboard">
          {comparisons.map((item) => {
            const rowMax = Math.max(item.leftValue, item.rightValue)
            const leftWidth = (item.leftValue / rowMax) * 100
            const rightWidth = (item.rightValue / rowMax) * 100
            const leadWidth =
              item.winner === 'draw'
                ? 0
                : Math.min(Math.max((item.difference / rowMax) * 100, 18), 50)
            const isFocused = item.metric === metric
            const winnerAccent =
              item.winner === 'left'
                ? left.accent
                : item.winner === 'right'
                  ? right.accent
                  : 'var(--accent-neutral)'
            const winnerName = item.winner === 'left' ? left.japaneseName : right.japaneseName
            const leftState =
              item.winner === 'draw' ? 'is-draw' : item.winner === 'left' ? 'is-winner' : 'is-loser'
            const rightState =
              item.winner === 'draw'
                ? 'is-draw'
                : item.winner === 'right'
                  ? 'is-winner'
                  : 'is-loser'

            return (
              <div
                key={item.metric}
                className={`compare-row compare-row-${item.winner} ${isFocused ? 'is-focused' : ''}`}
                style={{ '--winner-accent': winnerAccent } as CSSProperties}
              >
                <div
                  className={`compare-side compare-side-left ${leftState}`}
                  style={{ '--accent': left.accent } as CSSProperties}
                >
                  <strong>{item.leftValue}</strong>
                  <div className="compare-bar-track" aria-hidden="true">
                    <div
                      className="compare-bar-fill"
                      style={{ width: `${leftWidth}%`, '--accent': left.accent } as CSSProperties}
                    />
                  </div>
                </div>

                <div className="compare-center">
                  <span>{metricLabels[item.metric]}</span>
                  {isFocused ? <strong className="compare-focus-tag">Current Focus</strong> : null}
                  <div className={`compare-lead-meter is-${item.winner}`} aria-hidden="true">
                    <div className="compare-lead-track">
                      <div className="compare-lead-axis" />
                      {item.winner === 'draw' ? (
                        <div className="compare-lead-draw" />
                      ) : (
                        <div
                          className="compare-lead-fill"
                          style={
                            { width: `${leadWidth}%`, '--accent': winnerAccent } as CSSProperties
                          }
                        />
                      )}
                    </div>
                  </div>
                  <small>
                    {item.winner === 'draw' ? '同值' : `${winnerName}领先 ${item.difference} cm`}
                  </small>
                </div>

                <div
                  className={`compare-side compare-side-right ${rightState}`}
                  style={{ '--accent': right.accent } as CSSProperties}
                >
                  <div className="compare-bar-track" aria-hidden="true">
                    <div
                      className="compare-bar-fill"
                      style={{ width: `${rightWidth}%`, '--accent': right.accent } as CSSProperties}
                    />
                  </div>
                  <strong>{item.rightValue}</strong>
                </div>
              </div>
            )
          })}
        </article>

        <article
          className="compare-idol-panel"
          style={{ '--accent': right.accent } as CSSProperties}
        >
          <IdolVisual idol={right} priority />
          <div>
            <h2>{right.name}</h2>
            <p>{right.japaneseName}</p>
          </div>
        </article>
      </section>
    </main>
  )
}
