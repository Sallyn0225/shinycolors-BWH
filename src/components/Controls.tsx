import { metricLabels, METRICS, type Direction, type Metric, type Unit } from '../data'

interface MetricControlProps {
  value: Metric
  onChange: (metric: Metric) => void
}

export function MetricControl({ value, onChange }: MetricControlProps) {
  const changeBy = (offset: number) => {
    const currentIndex = METRICS.indexOf(value)
    const nextIndex = (currentIndex + offset + METRICS.length) % METRICS.length
    onChange(METRICS[nextIndex])
  }

  return (
    <fieldset className="control-block metric-control">
      <legend>测量维度</legend>
      <div className="segmented-control" role="radiogroup" aria-label="选择测量维度">
        {METRICS.map((metric) => (
          <button
            key={metric}
            type="button"
            role="radio"
            aria-checked={value === metric}
            className={value === metric ? 'segment is-active' : 'segment'}
            onClick={() => onChange(metric)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault()
                changeBy(1)
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault()
                changeBy(-1)
              }
            }}
          >
            <span>{metricLabels[metric].name}</span>
            <strong>{metricLabels[metric].short}</strong>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

interface DirectionControlProps {
  value: Direction
  onChange: (direction: Direction) => void
}

export function DirectionControl({ value, onChange }: DirectionControlProps) {
  return (
    <label className="control-block select-control">
      <span>排序方向</span>
      <select value={value} onChange={(event) => onChange(event.target.value as Direction)}>
        <option value="desc">从高到低</option>
        <option value="asc">从低到高</option>
      </select>
    </label>
  )
}

interface UnitSelectProps {
  value?: string
  units: Unit[]
  onChange: (unitId: string | undefined) => void
}

export function UnitSelect({ value, units, onChange }: UnitSelectProps) {
  return (
    <label className="control-block select-control">
      <span>组合</span>
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value || undefined)}>
        <option value="">全部组合</option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.nameJa} · {unit.name}
          </option>
        ))}
      </select>
    </label>
  )
}

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <label className="control-block search-control">
      <span>搜索成员</span>
      <span className="search-input-wrap">
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="输入日文名或英文名"
          autoComplete="off"
        />
        {value ? (
          <button type="button" className="clear-button" aria-label="清除姓名搜索" onClick={() => onChange('')}>
            清除
          </button>
        ) : null}
      </span>
    </label>
  )
}

interface ResetButtonProps {
  onClick: () => void
  children?: string
}

export function ResetButton({ onClick, children = '重置筛选' }: ResetButtonProps) {
  return (
    <button type="button" className="button button-secondary reset-button" onClick={onClick}>
      {children}
    </button>
  )
}
