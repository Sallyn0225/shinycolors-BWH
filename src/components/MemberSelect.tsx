import type { CSSProperties } from 'react'
import { allUnits, memberById, type Idol, type Unit } from '../data'

interface MemberSelectProps {
  label: string
  value?: string
  otherValue?: string
  onChange: (id: string | undefined) => void
}

export function MemberSelect({ label, value, otherValue, onChange }: MemberSelectProps) {
  const member = value ? memberById.get(value) : undefined

  return (
    <div className="member-picker">
      <label htmlFor={`member-${label}`}>{label}</label>
      <select
        id={`member-${label}`}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
      >
        <option value="">请选择成员</option>
        {allUnits.map((unit) => (
          <optgroup key={unit.id} label={`${unit.nameJa} · ${unit.name}`}>
            {unit.members.map((option) => (
              <option key={option.id} value={option.id} disabled={option.id === otherValue}>
                {option.nameJa} / {option.nameEn}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {member ? <SelectedMember member={member} unit={allUnits.find((unit) => unit.id === member.unitId)} /> : <p className="picker-empty">请选择一名成员查看资料。</p>}
    </div>
  )
}

function SelectedMember({ member, unit }: { member: Idol; unit?: Unit }) {
  return (
    <div className="picker-preview" style={{ '--identity-color': member.representativeColor.hex } as CSSProperties}>
      <span className="avatar-frame">
        <img src={member.iconUrl} alt="" width="54" height="54" />
      </span>
      <span className="identity-copy">
        <strong>{member.nameJa}</strong>
        <span>{member.nameEn}</span>
        <small>
          <i aria-hidden="true" style={{ backgroundColor: unit?.colors.primary }} />
          {member.unitNameJa}
        </small>
      </span>
      <span className="color-swatch" title="代表色" aria-label={`代表色 ${member.representativeColor.hex}`} />
    </div>
  )
}
