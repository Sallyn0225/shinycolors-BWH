import type { CSSProperties } from 'react'
import { metricLabels, type Idol, type Metric } from '../data'
import { relativePosition } from '../domain'

const axes: Array<{ metric: Metric; angle: number }> = [
  { metric: 'bust', angle: -90 },
  { metric: 'waist', angle: 30 },
  { metric: 'hip', angle: 150 },
]

const center = 200
const radius = 132

function pointAt(relative: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: center + radius * relative * Math.cos(radians),
    y: center + radius * relative * Math.sin(radians),
  }
}

function pointsForMember(member: Idol) {
  return axes
    .map(({ metric, angle }) => {
      const point = pointAt(relativePosition(member.measurements[metric], metric), angle)
      return `${point.x},${point.y}`
    })
    .join(' ')
}

function pointsForLevel(level: number) {
  return axes
    .map(({ angle }) => {
      const point = pointAt(level, angle)
      return `${point.x},${point.y}`
    })
    .join(' ')
}

interface RadarChartProps {
  memberA: Idol
  memberB: Idol
}

export function RadarChart({ memberA, memberB }: RadarChartProps) {
  const pointsA = pointsForMember(memberA)
  const pointsB = pointsForMember(memberB)
  const label = `${memberA.nameJa} 与 ${memberB.nameJa} 的 B/W/H 相对位置图。完整厘米数值见下方表格。`

  return (
    <figure className="radar-figure">
      <svg
        className="radar-chart"
        viewBox="0 0 400 400"
        role="img"
        aria-labelledby="radar-title radar-desc"
      >
        <title id="radar-title">双人 B/W/H 相对位置图</title>
        <desc id="radar-desc">{label}</desc>
        {([0.25, 0.5, 0.75, 1] as const).map((level) => (
          <polygon key={level} points={pointsForLevel(level)} className="radar-grid" />
        ))}
        {axes.map(({ metric, angle }) => {
          const point = pointAt(1, angle)
          return <line key={metric} x1={center} y1={center} x2={point.x} y2={point.y} className="radar-axis" />
        })}
        <polygon points={pointsA} className="radar-shape-halo" />
        <polygon points={pointsA} className="radar-shape radar-shape-a" style={{ '--series-color': memberA.representativeColor.hex } as CSSProperties} />
        <polygon points={pointsB} className="radar-shape-halo" />
        <polygon points={pointsB} className="radar-shape radar-shape-b" style={{ '--series-color': memberB.representativeColor.hex } as CSSProperties} />
        {axes.map(({ metric, angle }) => {
          const point = pointAt(relativePosition(memberA.measurements[metric], metric), angle)
          return <circle key={`a-${metric}`} cx={point.x} cy={point.y} r="5" className="radar-point radar-point-a" style={{ fill: memberA.representativeColor.hex }} />
        })}
        {axes.map(({ metric, angle }) => {
          const point = pointAt(relativePosition(memberB.measurements[metric], metric), angle)
          const size = 5
          return <rect key={`b-${metric}`} x={point.x - size} y={point.y - size} width={size * 2} height={size * 2} className="radar-point radar-point-b" style={{ fill: memberB.representativeColor.hex }} transform={`rotate(45 ${point.x} ${point.y})`} />
        })}
        {axes.map(({ metric, angle }) => {
          const point = pointAt(1.22, angle)
          return (
            <text key={`label-${metric}`} x={point.x} y={point.y} className="radar-label" textAnchor="middle" dominantBaseline="middle">
              {metricLabels[metric].name} {metricLabels[metric].short}
            </text>
          )
        })}
      </svg>
      <figcaption className="radar-caption">图形只表达各维度在 28 名成员全局范围内的相对位置，不是评分。</figcaption>
    </figure>
  )
}
