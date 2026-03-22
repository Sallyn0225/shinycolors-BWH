import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { MetricKey, SortDirection } from "../types";

interface RankingPreferences {
  metric: MetricKey;
  direction: SortDirection;
  setMetric: (metric: MetricKey) => void;
  toggleDirection: () => void;
}

const STORAGE_KEY = "shinycolors-bwh-preferences";
const RankingPreferencesContext = createContext<RankingPreferences | null>(null);

export function RankingPreferencesProvider({ children }: PropsWithChildren) {
  const [metric, setMetric] = useState<MetricKey>("bust");
  const [direction, setDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<{ metric: MetricKey; direction: SortDirection }>;
      if (parsed.metric) {
        setMetric(parsed.metric);
      }
      if (parsed.direction) {
        setDirection(parsed.direction);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ metric, direction }));
  }, [direction, metric]);

  const value = useMemo<RankingPreferences>(
    () => ({
      metric,
      direction,
      setMetric,
      toggleDirection: () =>
        setDirection((current) => (current === "desc" ? "asc" : "desc")),
    }),
    [direction, metric],
  );

  return (
    <RankingPreferencesContext.Provider value={value}>
      {children}
    </RankingPreferencesContext.Provider>
  );
}

export function useRankingPreferences() {
  const context = useContext(RankingPreferencesContext);
  if (!context) {
    throw new Error("useRankingPreferences must be used within RankingPreferencesProvider");
  }

  return context;
}
