import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type {
  BenchmarkItem,
  LEIScore,
  RecommendationAction,
  RoleFit,
  SkillGap,
  SkillGapSummary,
} from '../types/lei';

export interface LEIDashboardData {
  score: LEIScore | null;
  roleFit: RoleFit[];
  history: LEIScore[];
  benchmark: BenchmarkItem[];
  gaps: SkillGap[];
  gapSummary: SkillGapSummary | null;
  actions: RecommendationAction[];
  currentLei: number | null;
  projectedLei: number | null;
  emptyMessage: string | null;
}

// ── Mappers: backend returns snake_case rows / wrapper objects ────────────────
function mapScore(raw: any): LEIScore | null {
  if (!raw) return null;
  return {
    id: raw.id,
    userId: raw.user_id,
    totalScore: raw.total_score,
    tier: raw.tier,
    skillsScore: raw.skills_score,
    assessmentsScore: raw.assessments_score,
    projectsScore: raw.projects_score,
    interviewScore: raw.interview_score,
    resumeScore: raw.resume_score,
    experienceScore: raw.experience_score,
    certificationsScore: raw.certifications_score,
    calculatedAt: raw.calculated_at,
  };
}

function mapRoleFits(raw: any[]): RoleFit[] {
  return (raw ?? []).map((r) => ({
    roleName: r.roleName ?? r.role_name,
    fitScore: r.fitScore ?? r.fit_score,
  }));
}

function mapGap(raw: any): SkillGap {
  return {
    id: raw.id,
    skillName: raw.skillName,
    severity: raw.severity,
    identifiedAt: raw.identifiedAt,
    resolvedAt: raw.resolvedAt ?? null,
    lmsTrack: raw.lmsTrack ?? null,
  };
}

function summarize(gaps: SkillGap[], raw: any): SkillGapSummary {
  // Prefer a backend-provided summary; otherwise derive from the gaps list.
  const s = raw?.summary;
  if (s) {
    return {
      critical: s.critical ?? s.Critical ?? 0,
      important: s.important ?? s.Important ?? 0,
      recommended: s.recommended ?? s.Recommended ?? 0,
      resolved: s.resolved ?? 0,
    };
  }
  return {
    critical: gaps.filter((g) => g.severity === 'Critical').length,
    important: gaps.filter((g) => g.severity === 'Important').length,
    recommended: gaps.filter((g) => g.severity === 'Recommended').length,
    resolved: 0,
  };
}

function value<T>(r: PromiseSettledResult<T>): T | null {
  return r.status === 'fulfilled' ? r.value : null;
}

export function useLEIDashboard() {
  const [data, setData] = useState<LEIDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const results = await Promise.allSettled([
      api.getLEI(),
      api.getLEIHistory(),
      api.getLEIBenchmark(),
      api.getSkillGaps(),
      api.getRecommendations(),
    ]);

    if (results.every((r) => r.status === 'rejected')) {
      const first = results.find((r) => r.status === 'rejected') as
        | PromiseRejectedResult
        | undefined;
      setError(first ? String(first.reason?.message ?? first.reason) : 'Failed to load');
      setData(null);
      setLoading(false);
      return;
    }

    const lei = value(results[0]);
    const hist = value(results[1]);
    const bench = value(results[2]);
    const gapRaw = value(results[3]);
    const rec = value(results[4]);

    const gaps = ((gapRaw?.gaps ?? []) as any[]).map(mapGap);

    setData({
      score: mapScore(lei?.score),
      roleFit: mapRoleFits(lei?.roleFits ?? lei?.roleFit),
      history: ((hist?.history ?? hist ?? []) as any[]).map(mapScore).filter(Boolean) as LEIScore[],
      benchmark: (bench?.components ?? (Array.isArray(bench) ? bench : [])) as BenchmarkItem[],
      gaps,
      gapSummary: summarize(gaps, gapRaw),
      actions: (rec?.actions ?? []) as RecommendationAction[],
      currentLei: rec?.currentLei ?? mapScore(lei?.score)?.totalScore ?? null,
      projectedLei: rec?.projectedLei ?? null,
      emptyMessage: rec?.message ?? null,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
