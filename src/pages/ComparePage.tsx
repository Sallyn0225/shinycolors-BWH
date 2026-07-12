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

type LeadSide = 'a' | 'b' | 'tie'

const metrics: Metric[] = ['bust', 'waist', 'hip']

function getLead(delta: number): LeadSide {
  if (delta > 0) return 'a'
  if (delta < 0) return 'b'
  return 'tie'
}

function formatDifference(value: number) {
  return value > 0 ? `+${value}` : String(value)
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
        <div className="swap-slot">
          <span className="swap-slot-spacer" aria-hidden="true">
            成员
          </span>
          <button
            type="button"
            className="swap-button"
            onClick={swap}
            disabled={!ready}
            title={ready ? '交换成员 A 和成员 B' : '选择两名成员后可交换'}
            aria-label="交换成员 A 和成员 B"
          >
            <svg className="swap-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h11M15 5l3 3-3 3M17 16H6M9 13l-3 3 3 3"
              />
            </svg>
            <span className="swap-button-label">交换双方</span>
          </button>
        </div>
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
          <p>原始数值表与相对位置图会在两侧选择完成后显示。</p>
        </section>
      ) : (
        <ComparisonResult memberA={memberA} memberB={memberB} />
      )}
    </>
  )
}

function ComparisonResult({ memberA, memberB }: { memberA: Idol; memberB: Idol }) {
  const rows = metrics.map((metric) => {
    const valueA = memberA.measurements[metric]
    const valueB = memberB.measurements[metric]
    const delta = difference(memberA, memberB, metric)
    return { metric, valueA, valueB, delta, lead: getLead(delta) }
  })

  return (
    <section className="comparison-result" aria-labelledby="comparison-title">
      <div className="comparison-heading">
        <div>
          <h2 id="comparison-title">
            {memberA.nameJa} 与 {memberB.nameJa}
          </h2>
          <p>原始厘米优先；相对位置图使用各维度全局范围归一化，不是评分。</p>
        </div>
        <div className="series-legend" aria-label="图表图例">
          <span>
            <i className="series-marker series-marker-a" aria-hidden="true" />A {memberA.nameJa}
          </span>
          <span>
            <i className="series-marker series-marker-b" aria-hidden="true" />B {memberB.nameJa}
          </span>
        </div>
      </div>

      <div className="comparison-board">
        <ComparisonTable rows={rows} memberA={memberA} memberB={memberB} />
        <RadarChart memberA={memberA} memberB={memberB} />
      </div>
    </section>
  )
}

function ComparisonTable({
  rows,
  memberA,
  memberB,
}: {
  rows: Array<{ metric: Metric; valueA: number; valueB: number; delta: number; lead: LeadSide }>
  memberA: Idol
  memberB: Idol
}) {
  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <caption>原始 B/W/H 数值与差值，差值定义为 A 减 B；较大一侧以字重标出</caption>
        <thead>
          <tr>
            <th scope="col">维度</th>
            <th scope="col">A · {memberA.nameJa}</th>
            <th scope="col">B · {memberB.nameJa}</th>
            <th scope="col">A - B</th>
            <th scope="col">较大</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ metric, valueA, valueB, delta, lead }) => (
            <tr key={metric} className={`lead-row-${lead}`}>
              <th scope="row">
                {metricLabels[metric].name} {metricLabels[metric].short}
              </th>
              <td className={lead === 'a' ? 'value-higher' : undefined}>{valueA} cm</td>
              <td className={lead === 'b' ? 'value-higher' : undefined}>{valueB} cm</td>
              <td className="difference">{formatDifference(delta)} cm</td>
              <td>
                <span
                  className={`lead-chip lead-${lead}`}
                  title={
                    lead === 'tie'
                      ? '两人数值相同'
                      : lead === 'a'
                        ? `${memberA.nameJa} 数值较大`
                        : `${memberB.nameJa} 数值较大`
                  }
                >
                  {lead === 'tie' ? (
                    '相同'
                  ) : (
                    <>
                      <i
                        className={`series-marker series-marker-${lead}`}
                        aria-hidden="true"
                      />
                      {lead === 'a' ? 'A 较大' : 'B 较大'}
                    </>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
