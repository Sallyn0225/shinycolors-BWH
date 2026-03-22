import type { CSSProperties } from "react";
import { idols, unitDefinitions } from "../data/idols";
import {
  getMetricRange,
  getUnitAverage,
  metricLabels,
  sortIdols,
} from "../lib/ranking";
import { useRankingPreferences } from "../state/ranking-preferences";
import { RankingRow } from "../components/RankingRow";
import { UnitJumpTags } from "../components/UnitJumpTags";

export function UnitsPage() {
  const { metric, direction } = useRankingPreferences();

  return (
    <main className="page">
      <UnitJumpTags />

      <div className="unit-section-list">
        {unitDefinitions.map((unit) => {
          const members = idols.filter((idol) => idol.unit === unit.id);
          const sorted = sortIdols(members, metric, direction);
          const { min, max } = getMetricRange(members, metric);

          return (
            <section
              key={unit.id}
              id={unit.id}
              className="unit-section"
              style={{ "--accent": unit.accent } as CSSProperties}
            >
              <header className="unit-header">
                <div>
                  <p className="section-kicker">Unit Section</p>
                  <h2>{unit.name}</h2>
                  <p>{unit.description}</p>
                </div>
                <div className="unit-meta">
                  <span>{members.length} 人</span>
                  <span>
                    平均{metricLabels[metric]} {getUnitAverage(members, metric)} cm
                  </span>
                </div>
              </header>

              <div className="ranking-list unit-ranking-list">
                {sorted.map((idol, index) => (
                  <RankingRow
                    key={idol.id}
                    idol={idol}
                    rank={index + 1}
                    metric={metric}
                    min={min}
                    max={max}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
