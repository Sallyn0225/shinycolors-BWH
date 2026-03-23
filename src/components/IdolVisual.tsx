import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import type { IdolRecord } from '../types'

interface IdolVisualProps {
  idol: IdolRecord
  compact?: boolean
  priority?: boolean
}

// Derived from each asset's alpha bounds so the visible figure lands at a more consistent height.
const idolVisualScales: Record<string, number> = {
  'amana-osaki': 1.16,
  'asahi-serizawa': 1.2,
  'chiyoko-sonoda': 1.24,
  'chiyuki-kuwayama': 1.17,
  'fuyuko-mayuzumi': 1.23,
  'hana-suzuki': 1.16,
  'haruki-ikuta': 1.21,
  'hinana-ichikawa': 1.1,
  'hiori-kazano': 1.21,
  'juri-saijo': 1.16,
  'kaho-komiya': 1.08,
  'kiriko-yukoku': 1.2,
  'kogane-tsukioka': 1.13,
  'koito-fukumaru': 1.24,
  'luca-ikaruga': 1.14,
  'madoka-higuchi': 1.17,
  'mamimi-tanaka': 1.19,
  'mano-sakuragi': 1.19,
  'meguru-hachimiya': 1.16,
  'mei-izumi': 1.2,
  'mikoto-aketa': 1.13,
  'natsuha-arisugawa': 1.11,
  'nichika-nanakusa': 1.21,
  'rinze-morino': 1.2,
  'sakuya-shirase': 1.08,
  'tenka-osaki': 1.24,
  'toru-asakura': 1.14,
  'yuika-mitsumine': 1.19,
}

export function IdolVisual({ idol, compact = false, priority = false }: IdolVisualProps) {
  const [broken, setBroken] = useState(false)
  const imageUrl = `/assets/idols/${idol.id}.webp`
  const altImageUrl = `/assets/idols/${idol.id}.png`
  const imageScale = idolVisualScales[idol.id] ?? 1.18

  const initials = useMemo(
    () =>
      idol.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [idol.name],
  )

  return (
    <div
      className={`idol-visual ${compact ? 'is-compact' : ''}`}
      style={{ '--accent': idol.accent, '--idol-scale': imageScale } as CSSProperties}
    >
      {!broken ? (
        <div className="idol-visual-media">
          <picture>
            <source srcSet={imageUrl} type="image/webp" />
            <img
              src={altImageUrl}
              alt={idol.name}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              onError={() => setBroken(true)}
            />
          </picture>
        </div>
      ) : (
        <div className="idol-placeholder" aria-hidden="true">
          <span>{initials}</span>
        </div>
      )}
      <div className="idol-glow" aria-hidden="true" />
    </div>
  )
}
