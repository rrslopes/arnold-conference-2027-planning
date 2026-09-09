import { describe, expect, it } from "vitest";
import {
  MLABS_REPORT_URL,
  SOCIAL_ACCOUNT_GOALS,
  SOCIAL_BEST_TIMES,
  SOCIAL_FORMAT_GOALS,
  SOCIAL_HISTORY,
  SOCIAL_MISSING_BASELINES,
  SOCIAL_RESULT_FIELDS,
  calculateGoalProgress,
  calculatePerHundred,
  createEmptySocialValues,
  formatStatisticMode,
  hasAnySocialResult,
} from "../shared/socialMetrics";

describe("social metrics references", () => {
  it("keeps four historical phases separate instead of averaging them", () => {
    expect(SOCIAL_HISTORY.map(period => period.key)).toEqual(["2026-03", "2026-04", "2026-05", "2026-08"]);
    expect(SOCIAL_HISTORY.find(period => period.key === "2026-04")?.context).toMatch(/excepcional/i);
    expect(SOCIAL_HISTORY.find(period => period.key === "2026-08")?.context).toMatch(/retomada/i);
  });

  it("defines minimum, operational and stretch levels for available account metrics", () => {
    expect(SOCIAL_ACCOUNT_GOALS.map(goal => goal.key)).toEqual(["accountsReached", "views", "interactions", "netFollowers"]);
    SOCIAL_ACCOUNT_GOALS.forEach(goal => {
      expect(goal.minimum).toBeGreaterThan(goal.baseline);
      expect(goal.operational).toBeGreaterThan(goal.minimum);
      expect(goal.stretch).toBeGreaterThan(goal.operational);
    });
  });

  it("uses shares plus saves for Reels and carousels", () => {
    expect(SOCIAL_FORMAT_GOALS.find(format => format.key === "reels")?.metrics.some(metric => metric.field === "reelsMedianShares")).toBe(true);
    expect(SOCIAL_FORMAT_GOALS.find(format => format.key === "reels")?.metrics.some(metric => metric.field === "reelsMedianSaves")).toBe(true);
    expect(SOCIAL_FORMAT_GOALS.find(format => format.key === "carousels")?.metrics.some(metric => metric.field === "carouselsMedianShares")).toBe(true);
    expect(SOCIAL_FORMAT_GOALS.find(format => format.key === "carousels")?.metrics.some(metric => metric.field === "carouselsMedianSaves")).toBe(true);
  });

  it("does not calculate progress when a metric has no actual result", () => {
    expect(calculateGoalProgress(null, 100)).toEqual({ percentage: null, barPercentage: 0, reached: false });
    expect(calculateGoalProgress(160, 100)).toEqual({ percentage: 160, barPercentage: 100, reached: true });
  });

  it("normalizes Story actions only when a publication count exists", () => {
    expect(calculatePerHundred(25, 10)).toBe(250);
    expect(calculatePerHundred(25, 0)).toBeNull();
    expect(calculatePerHundred(null, 10)).toBeNull();
  });

  it("keeps unavailable Story breakdowns explicitly without baselines", () => {
    expect(SOCIAL_MISSING_BASELINES.join(" ")).toMatch(/avanços, voltas/i);
    expect(SOCIAL_MISSING_BASELINES.join(" ")).toMatch(/figurinha/i);
    expect(SOCIAL_RESULT_FIELDS).not.toContain("storyCompletionRate");
  });

  it("distinguishes an empty month from a reported zero", () => {
    const empty = createEmptySocialValues();
    expect(hasAnySocialResult(empty)).toBe(false);
    expect(hasAnySocialResult({ ...empty, accountsReached: 0 })).toBe(true);
  });

  it("uses a result label for one or two posts and median only from three items", () => {
    expect(formatStatisticMode(null)).toBe("Aguardando publicações");
    expect(formatStatisticMode(1)).toBe("Resultado do período");
    expect(formatStatisticMode(2)).toBe("Resultado do período");
    expect(formatStatisticMode(3)).toBe("Mediana do período");
    expect(formatStatisticMode(5)).toBe("Mediana do período");
  });

  it("keeps the mLabs source and all seven Education and Courses day references", () => {
    expect(MLABS_REPORT_URL).toMatch(/^https:\/\/relatorio\.digital\//);
    expect(SOCIAL_BEST_TIMES).toHaveLength(7);
    expect(SOCIAL_BEST_TIMES.find(item => item.day === "Segunda")?.recommended).toContain("19:00");
    expect(SOCIAL_BEST_TIMES.find(item => item.day === "Domingo")?.avoid).toContain("08:00");
  });
});
