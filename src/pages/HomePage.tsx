import { idols } from "../data/idols";
import { metricLabels, getMetricRange, sortIdols } from "../lib/ranking";
import { useRankingPreferences } from "../state/ranking-preferences";
import { RankingRow } from "../components/RankingRow";

export function HomePage() {
  const { metric, direction } = useRankingPreferences();
  const sorted = sortIdols(idols, metric, direction);
  const { min, max } = getMetricRange(idols, metric);

  return (
    <main className="page page-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">283 Production • 28 idols</p>
          <h1>闪耀色彩三围可视化排行</h1>
          <p className="hero-text">
            把 28 名偶像的胸围、腰围、臀围做成一面能滑动浏览的舞台榜单。当前聚焦：
            <strong>{metricLabels[metric]}</strong>。
          </p>
        </div>
        <div className="hero-stage" aria-hidden="true">
          <div className="stage-orbit stage-orbit-a" />
          <div className="stage-orbit stage-orbit-b" />
          <div className="stage-grid" />
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="section-kicker">全员总榜</p>
          <h2>从头到尾，一次看完</h2>
        </div>
        <p>列表会跟随顶部 tag 立即重排，方便切换不同维度观察整体分布。</p>
      </section>

      <section className="ranking-list">
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
      </section>
    </main>
  );
}
