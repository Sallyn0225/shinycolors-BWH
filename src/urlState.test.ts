import { describe, expect, it } from 'vitest'
import { parseHash, serializeState, type CompareState } from './urlState'

describe('hash URL state', () => {
  it('round trips non-default overall state and removes unknown keys', () => {
    const parsed = parseHash('#/overall?metric=waist&unit=lantica&q=%E9%9C%A7%E5%AD%90&dir=asc&theme=dark&extra=1', 'system')
    expect(parsed.state).toMatchObject({
      route: 'overall',
      metric: 'waist',
      unitId: 'lantica',
      query: '霧子',
      direction: 'asc',
      theme: 'dark',
    })
    expect(parsed.canonicalHash).toBe('#/overall?metric=waist&unit=lantica&q=%E9%9C%A7%E5%AD%90&dir=asc&theme=dark')
  })

  it('normalizes invalid values to safe defaults', () => {
    const parsed = parseHash('#/units?metric=bad&dir=sideways&theme=nope&unknown=1', 'system')
    expect(parsed.state).toMatchObject({ route: 'units', metric: 'bust', direction: 'desc', theme: 'system' })
    expect(parsed.canonicalHash).toBe('#/units')
  })

  it('clears a duplicate compare member and preserves valid members', () => {
    const parsed = parseHash('#/compare?a=mano_sakuragi&b=mano_sakuragi&theme=light', 'system')
    expect(parsed.state).toMatchObject({ route: 'compare', memberA: 'mano_sakuragi', theme: 'light' })
    expect((parsed.state as CompareState).memberB).toBeUndefined()
    expect(parsed.canonicalHash).toBe('#/compare?a=mano_sakuragi&theme=light')
  })

  it('omits defaults from serialized hashes', () => {
    expect(
      serializeState({ route: 'overall', metric: 'bust', query: '', direction: 'desc', theme: 'system' }),
    ).toBe('#/overall')
    expect(serializeState({ route: 'compare', theme: 'dark' })).toBe('#/compare?theme=dark')
  })
})
