import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import type { IdolRecord } from "../types";

interface IdolVisualProps {
  idol: IdolRecord;
  compact?: boolean;
}

export function IdolVisual({ idol, compact = false }: IdolVisualProps) {
  const [broken, setBroken] = useState(false);
  const imageUrl = `/assets/idols/${idol.id}.webp`;
  const altImageUrl = `/assets/idols/${idol.id}.png`;

  const initials = useMemo(
    () =>
      idol.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [idol.name],
  );

  return (
    <div
      className={`idol-visual ${compact ? "is-compact" : ""}`}
      style={{ "--accent": idol.accent } as CSSProperties}
    >
      {!broken ? (
        <picture>
          <source srcSet={imageUrl} type="image/webp" />
          <img
            src={altImageUrl}
            alt={idol.name}
            loading="lazy"
            onError={() => setBroken(true)}
          />
        </picture>
      ) : (
        <div className="idol-placeholder" aria-hidden="true">
          <span>{initials}</span>
        </div>
      )}
      <div className="idol-glow" aria-hidden="true" />
    </div>
  );
}
