import { useRef } from 'react'
import { metricLabels, METRICS, type Direction, type Metric, type Unit } from '../data'

interface MetricControlProps {
  value: Metric
  onChange: (metric: Metric) => void
}

export function MetricControl({ value, onChange }: MetricControlProps) {
  const buttonRefs = useRef<Partial<Record<Metric, HTMLButtonElement | null>>>({})

  const selectMetric = (metric: Metric) => {
    onChange(metric)
    requestAnimationFrame(() => buttonRefs.current[metric]?.focus())
  }

  const changeBy = (offset: number) => {
    const currentIndex = METRICS.indexOf(value)
    const nextIndex = (currentIndex + offset + METRICS.length) % METRICS.length
    selectMetric(METRICS[nextIndex])
  }

  return (
    <fieldset className="control-block metric-control">
      <legend>测量维度</legend>
      <div className="segmented-control" role="radiogroup" aria-label="选择测量维度">
        {METRICS.map((metric) => {
          const checked = value === metric
          return (
            <button
              key={metric}
              ref={(node) => {
                buttonRefs.current[metric] = node
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              className={checked ? 'segment is-active' : 'segment'}
              onClick={() => selectMetric(metric)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  event.preventDefault()
                  changeBy(1)
                }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault()
                  changeBy(-1)
                }
                if (event.key === 'Home') {
                  event.preventDefault()
                  selectMetric(METRICS[0])
                }
                if (event.key === 'End') {
                  event.preventDefault()
                  selectMetric(METRICS[METRICS.length - 1])
                }
              }}
            >
              <span>{metricLabels[metric].name}</span>
              <strong>{metricLabels[metric].short}</strong>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

interface DirectionControlProps {
  value: Direction
  onChange: (direction: Direction) => void
  id?: string
}

export function DirectionControl({ value, onChange, id = 'sort-direction' }: DirectionControlProps) {
  return (
    <div className="control-block select-control">
      <label htmlFor={id}>排序方向</label>
      <select
        id={id}
        name="direction"
        value={value}
        onChange={(event) => onChange(event.target.value as Direction)}
      >
        <option value="desc">从高到低</option>
        <option value="asc">从低到高</option>
      </select>
    </div>
  )
}

interface UnitSelectProps {
  value?: string
  units: Unit[]
  onChange: (unitId: string | undefined) => void
  id?: string
}

export function UnitSelect({ value, units, onChange, id = 'unit-filter' }: UnitSelectProps) {
  return (
    <div className="control-block select-control">
      <label htmlFor={id}>组合</label>
      <select
        id={id}
        name="unit"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
      >
        <option value="">全部组合</option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.nameJa} · {unit.name}
          </option>
        ))}
      </select>
    </div>
  )
}

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function SearchField({ value, onChange, id = 'member-search' }: SearchFieldProps) {
  return (
    <div className="control-block search-control">
      <label htmlFor={id}>搜索成员</label>
      <span className="search-input-wrap">
        <input
          id={id}
          name="q"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="输入日文名或英文名"
          autoComplete="off"
          enterKeyHint="search"
        />
        {value ? (
          <button type="button" className="clear-button" aria-label="清除姓名搜索" onClick={() => onChange('')}>
            清除
          </button>
        ) : null}
      </span>
    </div>
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
