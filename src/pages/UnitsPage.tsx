import { useState, type CSSProperties } from 'react'
import { allUnits, metricLabels, type Idol, type Metric } from '../data'
import {
  formatAverage,
  rankMembers,
  rankUnits,
  unitProgressPercent,
  type RankedMember,
  type UnitSummary,
} from '../domain'
import { PageIntro } from '../components/AppShell'
import { DirectionControl, MetricControl, ResetButton } from '../components/Controls'
import type { UnitsState } from '../urlState'

interface UnitsPageProps {
  state: UnitsState
  onNavigate: (state: UnitsState, replace?: boolean) => void
}

function colorStyle(color: string): CSSProperties {
  return { '--identity-color': color } as CSSProperties
}

function compactMeasurements(member: Idol) {
  return `${member.measurements.bust} / ${member.measurements.waist} / ${member.measurements.hip}`
}

export function UnitsPage({ state, onNavigate }: UnitsPageProps) {
  const summaries = rankUnits(allUnits, state.metric, state.direction)
  const isDefault = state.metric === 'bust' && state.direction === 'desc'
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set())
  const metricLabel = metricLabels[state.metric]
  const directionLabel = state.direction === 'desc' ? '从高到低' : '从低到高'

  const reset = () => onNavigate({ route: 'units', metric: 'bust', direction: 'desc', theme: state.theme })
  const updateMetric = (metric: Metric) => onNavigate({ ...state, metric })
  const updateDirection = (direction: UnitsState['direction']) => onNavigate({ ...state, direction })

  const toggleUnit = (unitId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(unitId)) next.delete(unitId)
      else next.add(unitId)
      return next
    })
  }

  return (
    <>
      <PageIntro
        title="组合榜"
        description="比较 8 个组合在当前测量维度上的成员平均值。展开可查看组合内成员原始值；排序使用未舍入平均值，页面显示保留 1 位小数。"
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
            <h2 id="unit-results-title">组合平均值</h2>
            <p>
              当前维度：{metricLabel.name} {metricLabel.short}，{directionLabel}。
              可同时展开多个组合查看成员原始厘米值。
              <span className="results-bar-note">
                组合平均值条的可视化范围取 8 个组合平均值的最小与最大值。
              </span>
            </p>
          </div>
          <span className="results-count" aria-live="polite">
            {summaries.length} · {metricLabel.short} · {directionLabel}
          </span>
        </div>

        <div className="table-wrap">
          <table className="unit-table">
            <caption className="sr-only">组合平均值排名，可展开查看组合内成员</caption>
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
                <th scope="col" className="expand-heading">
                  成员
                </th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => {
                const { unit } = summary
                const isExpanded = expandedIds.has(unit.id)
                const panelId = `unit-members-${unit.id}`
                const toggleId = `unit-expand-${unit.id}`
                const labelId = `unit-members-label-${unit.id}`
                const memberRows = rankMembers(unit.members, state.metric, state.direction)

                return (
                  <UnitRowGroup
                    key={unit.id}
                    summary={summary}
                    metric={state.metric}
                    summaries={summaries}
                    isExpanded={isExpanded}
                    panelId={panelId}
                    toggleId={toggleId}
                    labelId={labelId}
                    memberRows={memberRows}
                    onToggle={() => toggleUnit(unit.id)}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

interface UnitRowGroupProps {
  summary: UnitSummary
  metric: Metric
  summaries: UnitSummary[]
  isExpanded: boolean
  panelId: string
  toggleId: string
  labelId: string
  memberRows: RankedMember[]
  onToggle: () => void
}

function UnitRowGroup({
  summary,
  metric,
  summaries,
  isExpanded,
  panelId,
  toggleId,
  labelId,
  memberRows,
  onToggle,
}: UnitRowGroupProps) {
  const { unit } = summary
  const metricName = metricLabels[metric].name
  const metricShort = metricLabels[metric].short

  return (
    <>
      <tr className={isExpanded ? 'unit-row is-expanded' : 'unit-row'}>
        <td className="rank-cell" data-label="名次">
          <span className="rank-number">{String(summary.rank).padStart(2, '0')}</span>
        </td>
        <td className="unit-main-cell" data-label="组合">
          <span className="unit-identity">
            <span className="unit-icon-frame" style={colorStyle(unit.colors.soft)}>
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
              style={{
                width: `${unitProgressPercent(summary.average, summaries)}%`,
                backgroundColor: unit.colors.primary,
              }}
            />
          </div>
        </td>
        <td className="expand-cell" data-label="成员">
          <button
            type="button"
            id={toggleId}
            className="unit-expand-button"
            aria-expanded={isExpanded}
            aria-controls={panelId}
            aria-label={isExpanded ? `收起 ${unit.nameJa} 成员` : `展开 ${unit.nameJa} 成员`}
            onClick={onToggle}
          >
            <span className="unit-expand-chevron" aria-hidden="true" />
            <span aria-hidden="true">{isExpanded ? '收起' : '展开'}</span>
          </button>
        </td>
      </tr>
      {isExpanded ? (
        <tr className="unit-detail-row">
          <td colSpan={7}>
            <div
              id={panelId}
              className="unit-member-panel"
              role="region"
              aria-labelledby={labelId}
            >
              <p id={labelId} className="unit-member-panel-label">
                {unit.nameJa} · 组内按{metricName}排序 · {summary.count} 人
              </p>
              <table className="unit-member-table">
                <caption className="sr-only">
                  {unit.nameJa} 成员列表，按{metricName}排序
                </caption>
                <thead>
                  <tr>
                    <th scope="col">组内</th>
                    <th scope="col">成员</th>
                    <th scope="col" className="number-heading">
                      {metricName} <span>{metricShort} · cm</span>
                    </th>
                    <th scope="col">B / W / H</th>
                  </tr>
                </thead>
                <tbody>
                  {memberRows.map(({ member, rank }) => {
                    const value = member.measurements[metric]
                    return (
                      <tr key={member.id}>
                        <td className="rank-cell" data-label="组内">
                          <span className="rank-number">{String(rank).padStart(2, '0')}</span>
                        </td>
                        <td className="member-cell" data-label="成员">
                          <div className="member-identity">
                            <span
                              className="avatar-frame unit-member-avatar"
                              style={colorStyle(member.representativeColor.hex)}
                            >
                              <img
                                src={member.iconUrl}
                                alt=""
                                width="44"
                                height="44"
                                loading="lazy"
                                decoding="async"
                              />
                            </span>
                            <span className="identity-copy">
                              <strong>{member.nameJa}</strong>
                              <span>{member.nameEn}</span>
                            </span>
                          </div>
                        </td>
                        <td className="main-value-cell" data-label={metricName}>
                          <strong>{value}</strong>
                          <span>cm</span>
                        </td>
                        <td className="all-values-cell" data-label="B / W / H">
                          <span className="compact-values">{compactMeasurements(member)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}
