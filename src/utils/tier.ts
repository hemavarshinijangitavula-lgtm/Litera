import { TIER_RANGES, TIER_VAR, TIER_ORDER } from '../types/lei';
import type { TierName } from '../types/lei';

export function tierSlug(tier: TierName): string {
  // 'Career Ready' -> 'career-ready'; 'Industry Competitive' -> 'competitive'
  if (tier === 'Industry Competitive') return 'competitive';
  return tier.toLowerCase().replace(/ /g, '-');
}

export function tierColor(tier: TierName): string {
  return `var(${TIER_VAR[tier]})`;
}

export function tierProgress(score: number, tier: TierName): number {
  const [lo, hi] = TIER_RANGES[tier];
  if (hi === lo) return 100;
  return Math.max(0, Math.min(100, Math.round(((score - lo) / (hi - lo)) * 100)));
}

export function nextTier(tier: TierName): TierName | null {
  const idx = TIER_ORDER.indexOf(tier);
  return idx >= 0 && idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null;
}

export function pointsToNextTier(score: number, tier: TierName): number {
  const next = nextTier(tier);
  if (!next) return 0;
  const [lo] = TIER_RANGES[next];
  return Math.max(0, Math.round((lo - score) * 10) / 10);
}
