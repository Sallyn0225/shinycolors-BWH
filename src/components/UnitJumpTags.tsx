import type { CSSProperties } from 'react'
import { unitDefinitions } from '../data/idols'

export function UnitJumpTags() {
  return (
    <nav className="unit-jump-tags" aria-label="组合跳转">
      <div className="unit-jump-heading">
        <span>Section Index</span>
        <strong>{unitDefinitions.length} Units</strong>
      </div>

      {unitDefinitions.map((unit) => (
        <a
          key={unit.id}
          href={`#${unit.id}`}
          className="unit-jump-chip"
          style={{ '--accent': unit.accent } as CSSProperties}
        >
          {unit.shortName}
        </a>
      ))}
    </nav>
  )
}
