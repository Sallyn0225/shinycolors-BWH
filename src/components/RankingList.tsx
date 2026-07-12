import type { CSSProperties } from 'react'
import { metricLabels, type Idol, type Metric } from '../data'
import { progressPercent, type RankedMember } from '../domain'

function colorStyle(color: string): CSSProperties {
  return { '--identity-color': color } as CSSProperties
}

function compactMeasurements(member: Idol) {
  return `${member.measurements.bust} / ${member.measurements.waist} / ${member.measurements.hip}`
}

interface RankingListProps {
  rows: RankedMember[]
  metric: Metric
}

export function RankingList({ rows, metric }: RankingListProps) {
  return (
    <div className="table-wrap">
      <table className="ranking-table">
        <caption className="sr-only">成员总榜，当前按{metricLabels[metric].name}排序</caption>
        <thead>
          <tr>
            <th scope="col">名次</th>
            <th scope="col">成员</th>
            <th scope="col">组合</th>
            <th scope="col" className="number-heading">
              {metricLabels[metric].name} <span>{metricLabels[metric].short} · cm</span>
            </th>
            <th scope="col" className="visual-heading">
              全局位置
            </th>
            <th scope="col">B / W / H</th>
            <th scope="col" className="source-heading">
              资料
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ member, rank }) => {
            const value = member.measurements[metric]
            return (
              <tr key={member.id}>
                <td className="rank-cell" data-label="名次">
                  <span className="rank-number">{String(rank).padStart(2, '0')}</span>
                </td>
                <td className="member-cell" data-label="成员">
                  <div className="member-identity">
                    <span className="avatar-frame" style={colorStyle(member.representativeColor.hex)}>
                      <img src={member.iconUrl} alt="" width="54" height="54" />
                    </span>
                    <span className="identity-copy">
                      <strong>{member.nameJa}</strong>
                      <span>{member.nameEn}</span>
                    </span>
                  </div>
                </td>
                <td className="unit-cell" data-label="组合">
                  <span className="unit-identity">
                    <span className="unit-icon-frame" style={colorStyle(member.unitColors.soft)}>
                      <img src={member.unitIconUrl} alt="" width="40" height="40" />
                    </span>
                    <span>
                      <strong>{member.unitNameJa}</strong>
                      <span>{member.unitName}</span>
                    </span>
                  </span>
                </td>
                <td className="main-value-cell" data-label={metricLabels[metric].name}>
                  <strong>{value}</strong>
                  <span>cm</span>
                </td>
                <td className="bar-cell" data-label="全局位置">
                  <div
                    className="metric-bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={value}
                    aria-valuetext={`${metricLabels[metric].name} ${value} 厘米`}
                  >
                    <span
                      className="metric-bar-fill"
                      style={{ width: `${progressPercent(value, metric)}%`, backgroundColor: member.representativeColor.hex }}
                    />
                  </div>
                </td>
                <td className="all-values-cell" data-label="B / W / H">
                  <span className="compact-values">{compactMeasurements(member)}</span>
                </td>
                <td className="source-cell" data-label="资料">
                  <a href={member.sourceUrl} target="_blank" rel="noreferrer">
                    查看资料 <span aria-hidden="true">↗</span>
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface EmptyStateProps {
  hasQuery: boolean
  onClearQuery: () => void
  onReset: () => void
}

export function EmptyState({ hasQuery, onClearQuery, onReset }: EmptyStateProps) {
  return (
    <section className="empty-state" aria-live="polite">
      <span className="empty-mark" aria-hidden="true">
        0
      </span>
      <div>
        <h2>没有找到符合条件的成员</h2>
        <p>保留当前控件，你可以清除姓名搜索或重置全部筛选。</p>
        <div className="empty-actions">
          {hasQuery ? (
            <button type="button" className="button button-primary" onClick={onClearQuery}>
              清除姓名搜索
            </button>
          ) : null}
          <button type="button" className="button button-secondary" onClick={onReset}>
            重置全部筛选
          </button>
        </div>
      </div>
    </section>
  )
}
