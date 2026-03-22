import type { CSSProperties } from "react";
import type { IdolRecord, MetricKey } from "../types";
import { formatRank, getBarPercentage, getMetricValue, getUnitName } from "../lib/ranking";
import { IdolVisual } from "./IdolVisual";

interface RankingRowProps {
  idol: IdolRecord;
  rank: number;
  metric: MetricKey;
  min: number;
  max: number;
}

export function RankingRow({ idol, rank, metric, min, max }: RankingRowProps) {
  const value = getMetricValue(idol, metric);
  const width = getBarPercentage(value, min, max);

  return (
    <article className="ranking-row" style={{ "--accent": idol.accent } as CSSProperties}>
      <div className="ranking-index">{formatRank(rank)}</div>

      <div className="ranking-identity">
        <IdolVisual idol={idol} compact />
        <div>
          <h3>{idol.name}</h3>
          <p>{idol.japaneseName}</p>
        </div>
      </div>

      <div className="ranking-unit">{getUnitName(idol.unit)}</div>

      <div className="ranking-bar-wrap" aria-label={`${idol.name} 数值 ${value}`}>
        <div className="ranking-bar-track">
          <div className="ranking-bar-fill" style={{ width: `${width}%` }} />
        </div>
      </div>

      <div className="ranking-value">
        <span>{value}</span>
        <small>cm</small>
      </div>
    </article>
  );
}
