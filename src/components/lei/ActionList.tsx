import type { RecommendationAction } from '../../types/lei';
import { actionMeta } from '../../utils/action';
import styles from './ActionList.module.css';

interface Props {
  actions: RecommendationAction[];
  projectedLei: number | null;
}

export default function ActionList({ actions, projectedLei }: Props) {
  if (actions.length === 0) return null;

  return (
    <div>
      <div className={styles.heading}>Your improvement plan</div>

      <div className={styles.list}>
        {actions.map((action) => {
          const meta = actionMeta(action.actionType);
          return (
            <div className={styles.row} key={action.rank}>
              <span className={`${styles.rank} mono`}>
                {String(action.rank).padStart(2, '0')}
              </span>
              <span className={styles.desc}>{action.actionDescription}</span>
              <span
                className={styles.chip}
                style={{ color: meta.chipColor, background: `${meta.chipColor}26` }}
              >
                {meta.chipLabel}
              </span>
              <span className={styles.delta}>+{action.expectedLeiDelta} LEI</span>
            </div>
          );
        })}
      </div>

      <div className={styles.summary}>
        Complete all {actions.length} →{' '}
        <span className={styles.projected}>
          Projected LEI: {projectedLei ?? '—'}
        </span>
      </div>
    </div>
  );
}
