import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { allMembers, allUnits, memberById, type Idol, type Unit } from '../data'
import { filterMembers } from '../domain'

interface MemberSelectProps {
  label: string
  value?: string
  otherValue?: string
  onChange: (id: string | undefined) => void
}

type ComboboxRow =
  | { kind: 'group'; unitId: string; label: string }
  | { kind: 'option'; member: Idol; disabled: boolean; optionIndex: number }

export function MemberSelect({ label, value, otherValue, onChange }: MemberSelectProps) {
  const member = value ? memberById.get(value) : undefined
  const inputId = useId()
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const displayValue = open ? query : member ? `${member.nameJa} / ${member.nameEn}` : ''

  const filtered = useMemo(
    () => filterMembers(allMembers, { query: open ? query : '', unitId: undefined }),
    [open, query],
  )

  const rows = useMemo(() => {
    const next: ComboboxRow[] = []
    let optionIndex = 0

    for (const unit of allUnits) {
      const members = unit.members.filter((item) => filtered.some((match) => match.id === item.id))
      if (members.length === 0) continue

      next.push({ kind: 'group', unitId: unit.id, label: `${unit.nameJa} · ${unit.name}` })
      for (const item of members) {
        next.push({
          kind: 'option',
          member: item,
          disabled: item.id === otherValue,
          optionIndex: optionIndex++,
        })
      }
    }

    return next
  }, [filtered, otherValue])

  const flatOptions = useMemo(
    () => rows.filter((row): row is Extract<ComboboxRow, { kind: 'option' }> => row.kind === 'option'),
    [rows],
  )

  const enabledIndexes = useMemo(
    () => flatOptions.map((option) => (option.disabled ? -1 : option.optionIndex)).filter((index) => index >= 0),
    [flatOptions],
  )

  useEffect(() => {
    if (!open) return
    setActiveIndex(enabledIndexes[0] ?? 0)
  }, [open, query, enabledIndexes])

  useEffect(() => {
    if (!open) return
    const active = listRef.current?.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`)
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, rows])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const selectMember = (id: string) => {
    if (id === otherValue) return
    onChange(id)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const clearSelection = () => {
    onChange(undefined)
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const openList = () => {
    if (!open) {
      setQuery('')
      setOpen(true)
    }
  }

  const moveActive = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return
    const currentPos = enabledIndexes.indexOf(activeIndex)
    const nextPos =
      currentPos === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (currentPos + direction + enabledIndexes.length) % enabledIndexes.length
    setActiveIndex(enabledIndexes[nextPos])
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) openList()
      else moveActive(1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openList()
      else moveActive(-1)
      return
    }
    if (event.key === 'Home' && open) {
      event.preventDefault()
      if (enabledIndexes[0] !== undefined) setActiveIndex(enabledIndexes[0])
      return
    }
    if (event.key === 'End' && open) {
      event.preventDefault()
      const last = enabledIndexes[enabledIndexes.length - 1]
      if (last !== undefined) setActiveIndex(last)
      return
    }
    if (event.key === 'Enter') {
      if (!open) {
        openList()
        return
      }
      event.preventDefault()
      const option = flatOptions.find((item) => item.optionIndex === activeIndex)
      if (option && !option.disabled) selectMember(option.member.id)
      return
    }
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        setOpen(false)
        setQuery('')
      }
      return
    }
    if (event.key === 'Tab') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="member-picker" ref={rootRef}>
      <label htmlFor={inputId}>{label}</label>
      <div className={`member-combobox${open ? ' is-open' : ''}`}>
        <span className="search-input-wrap member-combobox-field">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-activedescendant={
              open && flatOptions.some((item) => item.optionIndex === activeIndex)
                ? `${listboxId}-opt-${activeIndex}`
                : undefined
            }
            value={displayValue}
            placeholder="搜索日文名或英文名"
            autoComplete="off"
            spellCheck={false}
            onFocus={openList}
            onClick={openList}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onKeyDown={onKeyDown}
          />
          {value ? (
            <button type="button" className="clear-button" aria-label={`清除${label}`} onClick={clearSelection}>
              清除
            </button>
          ) : null}
        </span>

        {open ? (
          <ul ref={listRef} id={listboxId} className="member-combobox-list" role="listbox" aria-label={label}>
            {flatOptions.length === 0 ? (
              <li className="member-combobox-empty" role="presentation">
                无匹配成员
              </li>
            ) : (
              rows.map((row) => {
                if (row.kind === 'group') {
                  return (
                    <li key={`group-${row.unitId}`} className="member-combobox-group-label" role="presentation">
                      {row.label}
                    </li>
                  )
                }

                const { member: option, disabled, optionIndex } = row
                const active = optionIndex === activeIndex
                return (
                  <li
                    key={option.id}
                    id={`${listboxId}-opt-${optionIndex}`}
                    role="option"
                    data-option-index={optionIndex}
                    aria-selected={option.id === value}
                    aria-disabled={disabled || undefined}
                    className={`member-combobox-option${active ? ' is-active' : ''}${disabled ? ' is-disabled' : ''}${option.id === value ? ' is-selected' : ''}`}
                    onMouseEnter={() => {
                      if (!disabled) setActiveIndex(optionIndex)
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      if (!disabled) selectMember(option.id)
                    }}
                  >
                    <span className="member-combobox-option-name">
                      {option.nameJa}
                      <small>{option.nameEn}</small>
                    </span>
                    {disabled ? <span className="member-combobox-option-hint">已选为对方</span> : null}
                  </li>
                )
              })
            )}
          </ul>
        ) : null}
      </div>

      {member ? (
        <SelectedMember member={member} unit={allUnits.find((unit) => unit.id === member.unitId)} />
      ) : (
        <p className="picker-empty">请选择一名成员查看资料。</p>
      )}
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
        <strong>
          <i
            className="member-color-dot"
            title="代表色"
            aria-label={`代表色 ${member.representativeColor.hex}`}
            style={{ backgroundColor: member.representativeColor.hex }}
          />
          {member.nameJa}
        </strong>
        <span>{member.nameEn}</span>
        <small>
          <i aria-hidden="true" style={{ backgroundColor: unit?.colors.primary }} />
          {member.unitNameJa}
        </small>
        <a className="picker-source-link" href={member.sourceUrl} target="_blank" rel="noreferrer">
          打开官方资料 <span aria-hidden="true">↗</span>
        </a>
      </span>
    </div>
  )
}
