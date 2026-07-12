import type { CSSProperties } from 'react'
import { allUnits, metricLabels, type Metric } from '../data'
import { formatAverage, rankUnits, unitProgressPercent } from '../domain'
import { PageIntro } from '../components/AppShell'
import { DirectionControl, MetricControl, ResetButton } from '../components/Controls'
import { serializeState, type UnitsState } from '../urlState'

interface UnitsPageProps {
  state: UnitsState
  onNavigate: (state: UnitsState, replace?: boolean) => void
}

export function UnitsPage({ state, onNavigate }: UnitsPageProps) {
  const summaries = rankUnits(allUnits, state.metric, state.direction)
  const isDefault = state.metric === 'bust' && state.direction === 'desc'
  const reset = () => onNavigate({ route: 'units', metric: 'bust', direction: 'desc', theme: state.theme })

  const updateMetric = (metric: Metric) => onNavigate({ ...state, metric })
  const updateDirection = (direction: UnitsState['direction']) => onNavigate({ ...state, direction })

  return (
    <>
      <PageIntro
        title="组合榜"
        description="比较 8 个组合在当前测量维度上的成员平均值。排序使用未舍入平均值，页面显示保留 1 位小数。"
        meta="8 个组合 / 成员平均值"
      />

      <section className="control-panel" aria-label="组合榜筛选">
        <div className="control-grid unit-controls">
          <MetricControl value={state.metric} onChange={updateMetric} />
          <DirectionControl value={state.direction} onChange={updateDirection} />
          {!isDefault ? <ResetButton onClick={reset} /> : null}
        </div>
      </section>

      <section className="results-section" aria-labelledby="unit-results-title">
        <div className="results-heading">
          <div>
            <h2 id="unit-results-title">8 个组合</h2>
            <p>
              当前维度：{metricLabels[state.metric].name} {metricLabels[state.metric].short}，可视化范围取 8 个组合平均值的最小与最大值。
            </p>
          </div>
          <span className="results-count" aria-live="polite">
            {metricLabels[state.metric].short}
          </span>
        </div>

        <div className="table-wrap">
          <table className="unit-table">
            <caption className="sr-only">组合平均值排名</caption>
            <thead>
              <tr>
                <th scope="col">名次</th>
                <th scope="col">组合</th>
                <th scope="col">成员数</th>
                <th scope="col" className="number-heading">
                  平均值 <span>cm</span>
                </th>
                <th scope="col">成员范围</th>
                <th scope="col" className="visual-heading">
                  组合平均值
                </th>
                <th scope="col">查看成员</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => {
                const { unit } = summary
                const overallHref = serializeState({
                  route: 'overall',
                  metric: state.metric,
                  unitId: unit.id,
                  query: '',
                  direction: state.direction,
                  theme: state.theme,
                })
                return (
                  <tr key={unit.id}>
                    <td className="rank-cell" data-label="名次">
                      <span className="rank-number">{String(summary.rank).padStart(2, '0')}</span>
                    </td>
                    <td className="unit-main-cell" data-label="组合">
                      <span className="unit-identity">
                        <span className="unit-icon-frame" style={{ '--identity-color': unit.colors.soft } as CSSProperties}>
                          <img src={unit.iconUrl} alt="" width="40" height="40" />
                        </span>
                        <span>
                          <strong title={unit.nameJa}>{unit.nameJa}</strong>
                          <span title={unit.name}>{unit.name}</span>
                        </span>
                      </span>
                    </td>
                    <td data-label="成员数">
                      <span className="table-secondary">{summary.count} 人</span>
                    </td>
                    <td className="main-value-cell" data-label="平均值">
                      <strong>{formatAverage(summary.average)}</strong>
                      <span>cm</span>
                    </td>
                    <td data-label="成员范围">
                      <span className="range-value">
                        {summary.min}-{summary.max} cm
                      </span>
                    </td>
                    <td className="bar-cell" data-label="组合平均值">
                      <div className="metric-bar unit-bar" aria-hidden="true">
                        <span
                          className="metric-bar-fill"
                          style={{ width: `${unitProgressPercent(summary.average, summaries)}%`, backgroundColor: unit.colors.primary }}
                        />
                      </div>
                    </td>
                    <td className="source-cell" data-label="查看成员">
                      <a href={overallHref}>查看成员 <span aria-hidden="true">→</span></a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
