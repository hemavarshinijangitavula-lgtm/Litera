import { useEffect, useState } from 'react';
import type { LEIScore } from '../../types/lei';
import { tierColor, tierProgress, nextTier, pointsToNextTier } from '../../utils/tier';
import styles from './HeroScoreCard.module.css';

interface Props {
  score: LEIScore;
  previousScore: LEIScore | null;
}

function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function HeroScoreCard({ score, previousScore }: Props) {
  const displayed = useCountUp(score.totalScore);
  const color = tierColor(score.tier);
  const progress = tierProgress(score.totalScore, score.tier);
  const next = nextTier(score.tier);
  const pointsLeft = pointsToNextTier(score.totalScore, score.tier);

  const delta =
    previousScore != null
      ? Math.round((score.totalScore - previousScore.totalScore) * 10) / 10
      : null;

  return (
    <div className={styles.card} style={{ boxShadow: `0 0 80px var(--brand-glow)` }}>
      <div className={styles.topRow}>
        <span className={styles.label}>Your LEI Score</span>
        <span
          className={styles.tierPill}
          style={{ color, borderColor: color, background: `${color}22` }}
        >
          You're at {score.tier}
        </span>
      </div>

      <div className={styles.score}>{Math.round(displayed)}</div>

      {delta !== null && (
        <div
          className={styles.delta}
          style={{
            color:
              delta > 0
                ? 'var(--tier-advanced)'
                : delta < 0
                  ? 'var(--sev-critical)'
                  : 'var(--text-muted)',
          }}
        >
          {delta > 0 && `↑ +${delta.toFixed(1)} from last calculation`}
          {delta < 0 && `↓ ${Math.abs(delta).toFixed(1)} from last calculation`}
          {delta === 0 && 'No change'}
        </div>
      )}

      <div className={styles.progressWrap}>
        <div className={styles.progressLabels}>
          <span style={{ color }}>{score.tier}</span>
          <span className={styles.muted}>{next ?? 'Maximum'}</span>
        </div>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progress}%`, background: color }} />
        </div>
        {next && (
          <div className={styles.toNext}>
            {pointsLeft.toFixed(1)} points to {next}
          </div>
        )}
      </div>
    </div>
  );
}
