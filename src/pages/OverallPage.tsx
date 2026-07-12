import { allMembers, allUnits, unitById, type Metric } from '../data'
import { filterMembers, rankMembers } from '../domain'
import { PageIntro } from '../components/AppShell'
import { DirectionControl, MetricControl, ResetButton, SearchField, UnitSelect } from '../components/Controls'
import { EmptyState, RankingList } from '../components/RankingList'
import type { OverallState } from '../urlState'

interface OverallPageProps {
  state: OverallState
  onNavigate: (state: OverallState, replace?: boolean) => void
}

export function OverallPage({ state, onNavigate }: OverallPageProps) {
  const filteredMembers = filterMembers(allMembers, { unitId: state.unitId, query: state.query })
  const rankedMembers = rankMembers(filteredMembers, state.metric, state.direction)
  const selectedUnit = state.unitId ? unitById.get(state.unitId) : undefined
  const isDefault = !state.unitId && !state.query && state.metric === 'bust' && state.direction === 'desc'

  const updateMetric = (metric: Metric) => onNavigate({ ...state, metric })
  const updateUnit = (unitId: string | undefined) => onNavigate({ ...state, unitId })
  const updateQuery = (query: string) => onNavigate({ ...state, query }, true)
  const updateDirection = (direction: OverallState['direction']) => onNavigate({ ...state, direction })
  const reset = () =>
    onNavigate({ route: 'overall', metric: 'bust', query: '', direction: 'desc', theme: state.theme })

  const summary = selectedUnit
    ? `${selectedUnit.nameJa}，共 ${filteredMembers.length} 名成员`
    : `共 ${filteredMembers.length} 名成员`

  return (
    <>
      <PageIntro
        title="成员总榜"
        description="按 B、W、H 浏览 28 名成员的原始资料值。筛选后名次会在当前结果内重新计算。"
        meta="28 名成员 / 3 个测量维度"
      />

      <section className="control-panel" aria-label="总榜筛选">
        <div className="control-grid overall-controls">
          <MetricControl value={state.metric} onChange={updateMetric} />
          <UnitSelect value={state.unitId} units={allUnits} onChange={updateUnit} />
          <SearchField value={state.query} onChange={updateQuery} />
          <DirectionControl value={state.direction} onChange={updateDirection} />
          {!isDefault ? <ResetButton onClick={reset} /> : null}
        </div>
      </section>

      <section className="results-section" aria-labelledby="overall-results-title">
        <div className="results-heading">
          <div>
            <h2 id="overall-results-title">{summary}</h2>
            <p>
              当前主排序：{state.metric === 'bust' ? '胸围 B' : state.metric === 'waist' ? '腰围 W' : '臀围 H'}，
              {state.direction === 'desc' ? '从高到低' : '从低到高'}。进度条固定使用全部成员的全局范围。
            </p>
          </div>
          <span className="results-count" aria-live="polite">
            {filteredMembers.length} / {allMembers.length}
          </span>
        </div>

        {rankedMembers.length ? (
          <RankingList rows={rankedMembers} metric={state.metric} />
        ) : (
          <EmptyState hasQuery={Boolean(state.query)} onClearQuery={() => updateQuery('')} onReset={reset} />
        )}
      </section>
    </>
  )
}
