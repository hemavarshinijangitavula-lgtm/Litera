export type TierName =
  | 'Beginner'
  | 'Developing'
  | 'Career Ready'
  | 'Advanced'
  | 'Industry Competitive';

export const TIER_RANGES: Record<TierName, [number, number]> = {
  Beginner: [0, 39],
  Developing: [40, 59],
  'Career Ready': [60, 74],
  Advanced: [75, 89],
  'Industry Competitive': [90, 100],
};

export const TIER_VAR: Record<TierName, string> = {
  Beginner: '--tier-beginner',
  Developing: '--tier-developing',
  'Career Ready': '--tier-career-ready',
  Advanced: '--tier-advanced',
  'Industry Competitive': '--tier-competitive',
};

export const TIER_ORDER: TierName[] = [
  'Beginner',
  'Developing',
  'Career Ready',
  'Advanced',
  'Industry Competitive',
];

export interface LEIScore {
  id: string;
  userId: string;
  totalScore: number;
  tier: TierName;
  skillsScore: number | null;
  assessmentsScore: number | null;
  projectsScore: number | null;
  interviewScore: number | null;
  resumeScore: number | null;
  experienceScore: number | null;
  certificationsScore: number | null;
  calculatedAt: string;
}

export interface RoleFit {
  roleName: string;
  fitScore: number;
}

export interface BenchmarkItem {
  component: string;
  userScore: number;
  percentile: number;
  platformAvg: number;
}

export type Severity = 'Critical' | 'Important' | 'Recommended';

export interface SkillGap {
  id: string;
  skillName: string;
  severity: Severity;
  identifiedAt: string;
  resolvedAt: string | null;
  lmsTrack: { id: string; title: string | null; url: string | null } | null;
}

export interface SkillGapSummary {
  critical: number;
  important: number;
  recommended: number;
  resolved: number;
}

export type ActionType = 'lms_track' | 'mock_interview' | 'resume_update' | 'project';

export interface RecommendationAction {
  rank: number;
  actionType: ActionType;
  actionDescription: string;
  targetId: string | null;
  expectedLeiDelta: number;
  priority: number;
}
