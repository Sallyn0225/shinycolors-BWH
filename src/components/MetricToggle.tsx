import { directionLabels, metricLabels } from '../lib/ranking'
import { useRankingPreferences } from '../state/ranking-preferences'
import type { MetricKey } from '../types'

const metrics: MetricKey[] = ['bust', 'waist', 'hips']

type MetricToggleProps = {
  showDirection?: boolean
}

export function MetricToggle({ showDirection = true }: MetricToggleProps) {
  const { metric, direction, setMetric, toggleDirection } = useRankingPreferences()

  return (
    <div className="control-strip" aria-label="排序控制">
      <div className="chip-group" role="tablist" aria-label="排序维度">
        {metrics.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={metric === item}
            className={`chip ${metric === item ? 'is-active' : ''}`}
            onClick={() => setMetric(item)}
          >
            {metricLabels[item]}
          </button>
        ))}
      </div>

      {showDirection ? (
        <button
          type="button"
          className="chip chip-direction"
          onClick={toggleDirection}
          aria-label={`当前排序：${directionLabels[direction]}，点击切换`}
        >
          {direction === 'desc' ? '↓' : '↑'} {directionLabels[direction]}
        </button>
      ) : null}
    </div>
  )
}
