import rawData from '../shiny_colors_idol_measurements.json'

export const METRICS = ['bust', 'waist', 'hip'] as const
export type Metric = (typeof METRICS)[number]
export type Direction = 'asc' | 'desc'
export type Theme = 'system' | 'light' | 'dark'

export const metricLabels: Record<Metric, { name: string; short: string }> = {
  bust: { name: '胸围', short: 'B' },
  waist: { name: '腰围', short: 'W' },
  hip: { name: '臀围', short: 'H' },
}

export type Measurements = Record<Metric, number>

export interface RepresentativeColor {
  hex: string
  source: 'shinycolors_moe'
  sourceField: 'color2'
  sourceUrl: string
  verifiedAt: string
}

export interface UnitColors {
  soft: string
  primary: string
  source: 'shinycolors_moe'
  sourceFields: { soft: 'color1'; primary: 'color2' }
  sourceUrl: string
  verifiedAt: string
}

export interface Idol {
  id: string
  sourceId: number
  nameJa: string
  nameEn: string
  measurements: Measurements
  sourceUrl: string
  representativeColor: RepresentativeColor
  unitId: string
  unitName: string
  unitNameJa: string
  unitSourceId: number
  unitColors: UnitColors
  unitIconUrl: string
  iconUrl: string
  sourceOrder: number
}

export interface Unit {
  id: string
  sourceId: number
  name: string
  nameJa: string
  colors: UnitColors
  iconUrl: string
  members: Idol[]
  sourceOrder: number
}

interface RawData {
  schema_version: string
  idol_count: number
  measurement_unit: string
  units: Array<{
    unit_id: string
    unit_name: string
    unit_name_ja: string
    source_id: number
    representative_colors: {
      soft: string
      primary: string
      source: 'shinycolors_moe'
      source_fields: { soft: 'color1'; primary: 'color2' }
      source_url: string
      verified_at: string
    }
    members: Array<{
      id: string
      source_id: number
      name_ja: string
      name_en: string
      measurements_cm: Measurements
      source_url: string
      representative_color: {
        hex: string
        source: 'shinycolors_moe'
        source_field: 'color2'
        source_url: string
        verified_at: string
      }
    }>
  }>
}

const source = rawData as RawData
const baseUrl = import.meta.env.BASE_URL
const iconUrl = (folder: 'idol-icons' | 'unit-icons', sourceId: number) =>
  `${baseUrl}shiny-colors/${folder}/${String(sourceId).padStart(3, '0')}.png`

const units: Unit[] = source.units.map((rawUnit, unitIndex) => {
  const colors: UnitColors = {
    soft: rawUnit.representative_colors.soft,
    primary: rawUnit.representative_colors.primary,
    source: rawUnit.representative_colors.source,
    sourceFields: rawUnit.representative_colors.source_fields,
    sourceUrl: rawUnit.representative_colors.source_url,
    verifiedAt: rawUnit.representative_colors.verified_at,
  }

  const members = rawUnit.members.map((rawMember, memberIndex): Idol => ({
    id: rawMember.id,
    sourceId: rawMember.source_id,
    nameJa: rawMember.name_ja,
    nameEn: rawMember.name_en,
    measurements: rawMember.measurements_cm,
    sourceUrl: rawMember.source_url,
    representativeColor: {
      hex: rawMember.representative_color.hex,
      source: rawMember.representative_color.source,
      sourceField: rawMember.representative_color.source_field,
      sourceUrl: rawMember.representative_color.source_url,
      verifiedAt: rawMember.representative_color.verified_at,
    },
    unitId: rawUnit.unit_id,
    unitName: rawUnit.unit_name,
    unitNameJa: rawUnit.unit_name_ja,
    unitSourceId: rawUnit.source_id,
    unitColors: colors,
    unitIconUrl: iconUrl('unit-icons', rawUnit.source_id),
    iconUrl: iconUrl('idol-icons', rawMember.source_id),
    sourceOrder: unitIndex * 100 + memberIndex,
  }))

  return {
    id: rawUnit.unit_id,
    sourceId: rawUnit.source_id,
    name: rawUnit.unit_name,
    nameJa: rawUnit.unit_name_ja,
    colors,
    iconUrl: iconUrl('unit-icons', rawUnit.source_id),
    members,
    sourceOrder: unitIndex,
  }
})

export const allUnits = units
export const allMembers = units.flatMap((unit) => unit.members)
export const unitById = new Map(allUnits.map((unit) => [unit.id, unit]))
export const memberById = new Map(allMembers.map((member) => [member.id, member]))
export const measurementUnit = source.measurement_unit
export const verifiedAt = '2026-07-12'
export const officialIndexUrl = 'https://shinycolors.idolmaster-official.jp/idol/'
export const colorSourceUrl = 'https://shinycolors.moe/idolinfo?idolid=1'

export const globalRanges = METRICS.reduce(
  (ranges, metric) => {
    const values = allMembers.map((member) => member.measurements[metric])
    ranges[metric] = { min: Math.min(...values), max: Math.max(...values) }
    return ranges
  },
  {} as Record<Metric, { min: number; max: number }>,
)

function assertData(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`数据校验失败：${message}`)
}

function validateData() {
  assertData(source.schema_version === '1.1', 'schema_version 应为 1.1')
  assertData(source.idol_count === 28, 'idol_count 应为 28')
  assertData(allMembers.length === 28, '成员数量应为 28')
  assertData(allUnits.length === 8, '组合数量应为 8')
  assertData(new Set(allMembers.map((member) => member.id)).size === 28, '成员 ID 必须唯一')
  assertData(
    JSON.stringify([...new Set(allMembers.map((member) => member.sourceId))].sort((a, b) => a - b)) ===
      JSON.stringify(Array.from({ length: 28 }, (_, index) => index + 1)),
    '成员 source_id 必须覆盖 1 至 28',
  )
  assertData(
    JSON.stringify([...new Set(allUnits.map((unit) => unit.sourceId))].sort((a, b) => a - b)) ===
      JSON.stringify(Array.from({ length: 8 }, (_, index) => index + 1)),
    '组合 source_id 必须覆盖 1 至 8',
  )
  for (const member of allMembers) {
    for (const metric of METRICS) {
      assertData(Number.isFinite(member.measurements[metric]), `${member.id} 的 ${metric} 必须是有限数值`)
    }
    assertData(/^#[0-9a-fA-F]{6}$/.test(member.representativeColor.hex), `${member.id} 的代表色格式错误`)
  }
  for (const unit of allUnits) {
    assertData(/^#[0-9a-fA-F]{6}$/.test(unit.colors.soft), `${unit.id} 的 soft 色格式错误`)
    assertData(/^#[0-9a-fA-F]{6}$/.test(unit.colors.primary), `${unit.id} 的 primary 色格式错误`)
  }
  assertData(globalRanges.bust.min === 70 && globalRanges.bust.max === 93, 'B 全局范围错误')
  assertData(globalRanges.waist.min === 52 && globalRanges.waist.max === 60, 'W 全局范围错误')
  assertData(globalRanges.hip.min === 73 && globalRanges.hip.max === 92, 'H 全局范围错误')
}

validateData()
