import type { RecommendationAction } from '../../types/lei';
import { actionMeta } from '../../utils/action';
import styles from './PriorityActionCard.module.css';

interface Props {
  action: RecommendationAction;
  projectedLei: number | null;
}

export default function PriorityActionCard({ action, projectedLei }: Props) {
  const meta = actionMeta(action.actionType);

  const onClick = () => {
    if (action.targetId) {
      window.location.assign(`/dashboard/lms/tracks/${action.targetId}`);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>Start here →</div>
      <div className={styles.description}>{action.actionDescription}</div>

      <span className={styles.chip} style={{ color: meta.chipColor, background: `${meta.chipColor}26` }}>
        {meta.chipLabel}
      </span>

      <button className={styles.cta} onClick={onClick}>
        {meta.cta}
      </button>

      <div className={styles.delta}>
        +{action.expectedLeiDelta} LEI points projected
        {projectedLei != null && <span className={styles.proj}> · target {projectedLei}</span>}
      </div>
    </div>
  );
}
