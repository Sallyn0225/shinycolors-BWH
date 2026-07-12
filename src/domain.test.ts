import { describe, expect, it } from 'vitest'
import { allMembers, allUnits, globalRanges } from './data'
import {
  difference,
  filterMembers,
  progressPercent,
  rankMembers,
  rankUnits,
  relativePosition,
  unitProgressPercent,
} from './domain'

describe('data and domain rules', () => {
  it('keeps the expected dataset shape and global ranges', () => {
    expect(allMembers).toHaveLength(28)
    expect(allUnits).toHaveLength(8)
    expect(globalRanges).toEqual({
      bust: { min: 70, max: 93 },
      waist: { min: 52, max: 60 },
      hip: { min: 73, max: 92 },
    })
  })

  it('matches Japanese, English, case-insensitive and NFKC searches', () => {
    expect(filterMembers(allMembers, { query: '  霧子 ', unitId: undefined })).toHaveLength(1)
    expect(filterMembers(allMembers, { query: 'MEGURU', unitId: undefined })[0].id).toBe('meguru_hachimiya')
    expect(filterMembers(allMembers, { query: '　霧子　', unitId: undefined })[0].id).toBe('kiriko_yukoku')
    expect(filterMembers(allMembers, { query: '真乃', unitId: 'lantica' })).toHaveLength(0)
  })

  it('uses competition ranks and preserves source order for ties', () => {
    const ranked = rankMembers(allMembers, 'bust', 'desc')
    const tied = ranked.filter(({ member }) => member.measurements.bust === 90)
    expect(tied.map(({ member }) => member.id)).toEqual(['meguru_hachimiya', 'mei_izumi'])
    expect(tied.map(({ rank }) => rank)).toEqual([3, 3])
    expect(ranked.find(({ member }) => member.measurements.bust === 89)?.rank).toBe(5)
    expect(ranked[0].globalRank).toBe(ranked[0].rank)
  })

  it('keeps full-roster global ranks when the list is filtered', () => {
    const mano = allMembers.find((member) => member.id === 'mano_sakuragi')!
    const full = rankMembers(allMembers, 'bust', 'desc')
    const filtered = rankMembers([mano], 'bust', 'desc', { globalMembers: allMembers })
    expect(filtered).toHaveLength(1)
    expect(filtered[0].rank).toBe(1)
    expect(filtered[0].globalRank).toBe(full.find((row) => row.member.id === 'mano_sakuragi')!.rank)
  })

  it('keeps member bars on the global scale', () => {
    expect(progressPercent(70, 'bust')).toBe(12)
    expect(progressPercent(93, 'bust')).toBe(100)
    expect(progressPercent(86, 'bust')).toBeCloseTo(73.2174, 3)
    expect(relativePosition(70, 'bust')).toBe(0)
    expect(relativePosition(93, 'bust')).toBe(1)
  })

  it('sorts unit averages by exact fractions and ranks known ties', () => {
    const waist = rankUnits(allUnits, 'waist', 'desc')
    const waistTie = waist.filter(({ unit }) => ['illumination_stars', 'alstroemeria'].includes(unit.id))
    expect(waistTie.map(({ rank }) => rank)).toEqual([2, 2])

    const hip = rankUnits(allUnits, 'hip', 'desc')
    const hipTie = hip.filter(({ unit }) => ['illumination_stars', 'alstroemeria'].includes(unit.id))
    expect(hipTie.map(({ rank }) => rank)).toEqual([1, 1])
    expect(unitProgressPercent(waist[0].average, waist)).toBe(100)
  })

  it('computes signed comparison differences', () => {
    const mano = allMembers.find((member) => member.id === 'mano_sakuragi')!
    const meguru = allMembers.find((member) => member.id === 'meguru_hachimiya')!
    expect(difference(mano, meguru, 'bust')).toBe(-4)
  })
})
