import type { CSSProperties } from 'react'
import { metricLabels, memberById, type Idol, type Metric } from '../data'
import { difference } from '../domain'
import { PageIntro } from '../components/AppShell'
import { MemberSelect } from '../components/MemberSelect'
import { RadarChart } from '../components/RadarChart'
import type { CompareState } from '../urlState'

interface ComparePageProps {
  state: CompareState
  onNavigate: (state: CompareState, replace?: boolean) => void
}

export function ComparePage({ state, onNavigate }: ComparePageProps) {
  const memberA = state.memberA ? memberById.get(state.memberA) : undefined
  const memberB = state.memberB ? memberById.get(state.memberB) : undefined
  const ready = Boolean(memberA && memberB)

  const chooseA = (memberId: string | undefined) => {
    onNavigate({ ...state, memberA: memberId, memberB: memberId === state.memberB ? undefined : state.memberB })
  }
  const chooseB = (memberId: string | undefined) => {
    onNavigate({ ...state, memberB: memberId, memberA: memberId === state.memberA ? undefined : state.memberA })
  }
  const swap = () => {
    if (!state.memberA || !state.memberB) return
    onNavigate({ ...state, memberA: state.memberB, memberB: state.memberA })
  }

  return (
    <>
      <PageIntro
        title="双人对比"
        description="选择两名不同成员，在相同的全局尺度下查看 B/W/H 原始值与差值。"
        meta="固定三轴 / 原始数值优先"
      />

      <section className="compare-picker-panel" aria-label="选择对比成员">
        <MemberSelect label="成员 A" value={state.memberA} otherValue={state.memberB} onChange={chooseA} />
        <button type="button" className="swap-button" onClick={swap} disabled={!ready} aria-label="交换成员 A 和成员 B">
          <span aria-hidden="true">↔</span>
          <span>交换双方</span>
        </button>
        <MemberSelect label="成员 B" value={state.memberB} otherValue={state.memberA} onChange={chooseB} />
      </section>

      {!memberA || !memberB ? (
        <section className="compare-empty" aria-live="polite">
          <div className="compare-empty-line" aria-hidden="true">
            <span>A</span>
            <i />
            <span>B</span>
          </div>
          <h2>{state.memberA ? '再选择一名成员' : '选择两名成员开始对比'}</h2>
          <p>对比图和完整数值表会在两侧选择完成后显示。</p>
        </section>
      ) : (
        <ComparisonResult memberA={memberA} memberB={memberB} />
      )}
    </>
  )
}

function ComparisonResult({ memberA, memberB }: { memberA: Idol; memberB: Idol }) {
  return (
    <section className="comparison-result" aria-labelledby="comparison-title">
      <div className="comparison-heading">
        <div>
          <h2 id="comparison-title">{memberA.nameJa} 与 {memberB.nameJa}</h2>
          <p>图形使用三项维度各自的全局范围归一化，表格保留原始厘米数值。</p>
        </div>
        <div className="series-legend" aria-label="图表图例">
          <span><i className="series-marker series-marker-a" aria-hidden="true" />A {memberA.nameJa}</span>
          <span><i className="series-marker series-marker-b" aria-hidden="true" />B {memberB.nameJa}</span>
        </div>
      </div>

      <div className="identity-cards">
        <IdentityCard label="A" member={memberA} />
        <IdentityCard label="B" member={memberB} />
      </div>

      <div className="comparison-grid">
        <RadarChart memberA={memberA} memberB={memberB} />
        <ComparisonTable memberA={memberA} memberB={memberB} />
      </div>
    </section>
  )
}

function IdentityCard({ label, member }: { label: string; member: Idol }) {
  return (
    <article className="identity-card">
      <div className="identity-card-label">
        <span className={`series-marker series-marker-${label.toLowerCase()}`} aria-hidden="true" />成员 {label}
      </div>
      <div className="identity-card-content">
        <span className="avatar-frame" style={{ '--identity-color': member.representativeColor.hex } as CSSProperties}>
          <img src={member.iconUrl} alt="" width="54" height="54" />
        </span>
        <div className="identity-copy">
          <strong>{member.nameJa}</strong>
          <span>{member.nameEn}</span>
          <small>{member.unitNameJa} / {member.unitName}</small>
        </div>
      </div>
      <a href={member.sourceUrl} target="_blank" rel="noreferrer">打开官方资料 <span aria-hidden="true">↗</span></a>
    </article>
  )
}

function formatDifference(value: number) {
  return value > 0 ? `+${value}` : String(value)
}

function ComparisonTable({ memberA, memberB }: { memberA: Idol; memberB: Idol }) {
  const metrics: Metric[] = ['bust', 'waist', 'hip']
  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <caption>原始 B/W/H 数值与差值，差值定义为 A 减 B</caption>
        <thead>
          <tr>
            <th scope="col">维度</th>
            <th scope="col">A · {memberA.nameJa}</th>
            <th scope="col">B · {memberB.nameJa}</th>
            <th scope="col">A - B</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => {
            const valueA = memberA.measurements[metric]
            const valueB = memberB.measurements[metric]
            const delta = difference(memberA, memberB, metric)
            return (
              <tr key={metric}>
                <th scope="row">{metricLabels[metric].name} {metricLabels[metric].short}</th>
                <td>{valueA} cm</td>
                <td>{valueB} cm</td>
                <td className={delta > 0 ? 'difference positive' : delta < 0 ? 'difference negative' : 'difference'}>
                  {formatDifference(delta)} cm
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
