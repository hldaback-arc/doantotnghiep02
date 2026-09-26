import type { InterviewSessionSummary } from "@/types/database";

export type ProgressMetrics = {
  completedCount: number;
  averageScore: number | null;
  bestScore: number | null;
  latestScore: number | null;
  scoreChange: number | null;
  trend: "up" | "down" | "steady" | "no-data";
};

export function calculateProgress(sessions: InterviewSessionSummary[]): ProgressMetrics {
  const scored = sessions.filter((session) => session.status === "completed" && session.overall_score !== null).sort((a, b) => a.created_at.localeCompare(b.created_at));
  if (!scored.length) return { completedCount: 0, averageScore: null, bestScore: null, latestScore: null, scoreChange: null, trend: "no-data" };
  const scores = scored.map((session) => session.overall_score ?? 0);
  const latestScore = scores.at(-1) ?? null;
  const previousScore = scores.length > 1 ? scores.at(-2) ?? null : null;
  const scoreChange = latestScore !== null && previousScore !== null ? Number((latestScore - previousScore).toFixed(1)) : null;
  return { completedCount: scored.length, averageScore: Number((scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)), bestScore: Math.max(...scores), latestScore, scoreChange, trend: scoreChange === null ? "steady" : scoreChange > 0 ? "up" : scoreChange < 0 ? "down" : "steady" };
}