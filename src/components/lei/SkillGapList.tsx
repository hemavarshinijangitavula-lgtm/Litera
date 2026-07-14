import type { Severity, SkillGap, SkillGapSummary } from '../../types/lei';
import styles from './SkillGapList.module.css';

interface Props {
  gaps: SkillGap[];
  summary: SkillGapSummary | null;
}

const GROUPS: { severity: Severity; varName: string }[] = [
  { severity: 'Critical', varName: '--sev-critical' },
  { severity: 'Important', varName: '--sev-important' },
  { severity: 'Recommended', varName: '--sev-recommended' },
];

export default function SkillGapList({ gaps, summary }: Props) {
  const open = gaps.filter((g) => !g.resolvedAt);
  const noBlocking =
    (summary?.critical ?? open.filter((g) => g.severity === 'Critical').length) === 0 &&
    (summary?.important ?? open.filter((g) => g.severity === 'Important').length) === 0;

  if (open.length === 0 || noBlocking) {
    return (
      <div className={styles.empty}>
        <div className={styles.check}>✓</div>
        <p>Nothing critical holding you back right now. Keep building.</p>
      </div>
    );
  }

  return (
    <div>
      {GROUPS.map(({ severity, varName }) => {
        const items = open.filter((g) => g.severity === severity);
        if (items.length === 0) return null;
        const color = `var(${varName})`;
        return (
          <div className={styles.group} key={severity}>
            <div className={styles.groupHeader}>
              <span style={{ color }}>{severity}</span>
              <span className={styles.count} style={{ color, background: `${color}22` }}>
                {items.length}
              </span>
            </div>
            {items.map((gap) => (
              <div className={styles.row} key={gap.id}>
                <span className={styles.skill}>{gap.skillName}</span>
                <span className={styles.pill} style={{ color, background: `${color}22` }}>
                  {gap.severity}
                </span>
                {gap.lmsTrack && (
                  <a
                    className={styles.fix}
                    href={gap.lmsTrack.url ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    → Fix with {gap.lmsTrack.title ?? 'a track'}
                  </a>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {summary && summary.resolved > 0 && (
        <span className={styles.resolved}>{summary.resolved} skills resolved</span>
      )}
    </div>
  );
}
