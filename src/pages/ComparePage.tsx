import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { idols } from "../data/idols";
import { compareMetrics, metricLabels } from "../lib/ranking";
import { useRankingPreferences } from "../state/ranking-preferences";
import { IdolVisual } from "../components/IdolVisual";

export function ComparePage() {
  const { metric } = useRankingPreferences();
  const [leftId, setLeftId] = useState("mano-sakuragi");
  const [rightId, setRightId] = useState("kogane-tsukioka");

  const left = idols.find((idol) => idol.id === leftId) ?? idols[0];
  const right = idols.find((idol) => idol.id === rightId) ?? idols[1];

  const comparisons = useMemo(() => compareMetrics(left, right), [left, right]);
  const maxValue = Math.max(
    ...comparisons.flatMap((item) => [item.leftValue, item.rightValue]),
  );

  return (
    <main className="page">
      <section className="compare-pickers">
        <label className="picker">
          <span>左侧偶像</span>
          <select value={leftId} onChange={(event) => setLeftId(event.target.value)}>
            {idols.map((idol) => (
              <option
                key={idol.id}
                value={idol.id}
                disabled={idol.id === rightId}
              >
                {idol.japaneseName}
              </option>
            ))}
          </select>
        </label>

        <div className="compare-vs">VS</div>

        <label className="picker">
          <span>右侧偶像</span>
          <select value={rightId} onChange={(event) => setRightId(event.target.value)}>
            {idols.map((idol) => (
              <option
                key={idol.id}
                value={idol.id}
                disabled={idol.id === leftId}
              >
                {idol.japaneseName}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="compare-stage">
        <article className="compare-idol-panel" style={{ "--accent": left.accent } as CSSProperties}>
          <IdolVisual idol={left} />
          <div>
            <h2>{left.name}</h2>
            <p>{left.japaneseName}</p>
          </div>
        </article>

        <article className="compare-scoreboard">
          {comparisons.map((item) => {
            const leftWidth = (item.leftValue / maxValue) * 100;
            const rightWidth = (item.rightValue / maxValue) * 100;
            const isFocused = item.metric === metric;

            return (
              <div
                key={item.metric}
                className={`compare-row ${isFocused ? "is-focused" : ""}`}
              >
                <div className="compare-side compare-side-left">
                  <strong>{item.leftValue}</strong>
                  <div className="compare-bar-track">
                    <div
                      className="compare-bar-fill"
                      style={{ width: `${leftWidth}%`, "--accent": left.accent } as CSSProperties}
                    />
                  </div>
                </div>

                <div className="compare-center">
                  <span>{metricLabels[item.metric]}</span>
                  <small>
                    {item.winner === "draw"
                      ? "同值"
                      : `差 ${item.difference} cm`}
                  </small>
                </div>

                <div className="compare-side compare-side-right">
                  <div className="compare-bar-track">
                    <div
                      className="compare-bar-fill"
                      style={{ width: `${rightWidth}%`, "--accent": right.accent } as CSSProperties}
                    />
                  </div>
                  <strong>{item.rightValue}</strong>
                </div>
              </div>
            );
          })}
        </article>

        <article className="compare-idol-panel" style={{ "--accent": right.accent } as CSSProperties}>
          <IdolVisual idol={right} />
          <div>
            <h2>{right.name}</h2>
            <p>{right.japaneseName}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
