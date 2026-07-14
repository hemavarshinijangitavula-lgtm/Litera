import type { ReactNode } from 'react';
import { useLEIDashboard } from '../../hooks/useLEIDashboard';
import Skeleton from '../../components/common/Skeleton';
import HeroScoreCard from '../../components/lei/HeroScoreCard';
import ComponentRadar from '../../components/lei/ComponentRadar';
import PriorityActionCard from '../../components/lei/PriorityActionCard';
import SkillGapList from '../../components/lei/SkillGapList';
import ActionList from '../../components/lei/ActionList';
import RoleFitChart from '../../components/lei/RoleFitChart';
import LEIHistoryChart from '../../components/lei/LEIHistoryChart';
import styles from './LEIDashboard.module.css';

function Card({ children }: { children: ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}

export default function LEIDashboard() {
  const { data, loading, error, refetch } = useLEIDashboard();

  if (loading) {
    return (
      <div className={styles.page}>
        <Skeleton height="220px" borderRadius="16px" />
        <div className={styles.row57}>
          <Skeleton height="360px" borderRadius="16px" />
          <Skeleton height="360px" borderRadius="16px" />
        </div>
        <Skeleton height="200px" borderRadius="16px" />
        <p className={styles.loadingText}>Calculating your profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.centerWrap}>
        <div className={styles.stateCard}>
          <div className={styles.warn}>⚠</div>
          <p>Couldn't load your score right now — try refreshing.</p>
          <button className={styles.primaryBtn} onClick={refetch}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!data.score) {
    return (
      <div className={styles.centerWrap}>
        <div className={styles.stateCard}>
          <div className={styles.scoreIcon}>?</div>
          <h2>Your LEI Score</h2>
          <p>Your score will appear here once you complete your first assessment.</p>
          <button className={styles.primaryBtn}>Take your first assessment →</button>
        </div>
      </div>
    );
  }

  const previousScore = data.history.length > 1 ? data.history[1] : null;
  const topAction = data.actions[0] ?? null;

  return (
    <div className={styles.page}>
      <HeroScoreCard score={data.score} previousScore={previousScore} />

      <div className={styles.row57}>
        <Card>
          <h3 className={styles.cardTitle}>Component breakdown</h3>
          <ComponentRadar score={data.score} />
        </Card>
        <Card>
          {topAction ? (
            <PriorityActionCard action={topAction} projectedLei={data.projectedLei} />
          ) : (
            <div className={styles.noAction}>
              {data.emptyMessage ?? 'No improvement actions needed right now. Keep building!'}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className={styles.cardTitle}>Skill gaps</h3>
        <SkillGapList gaps={data.gaps} summary={data.gapSummary} />
      </Card>

      {data.actions.length > 0 && (
        <Card>
          <ActionList actions={data.actions} projectedLei={data.projectedLei} />
        </Card>
      )}

      <div className={styles.row57}>
        <Card>
          <h3 className={styles.cardTitle}>Role fit</h3>
          <RoleFitChart roleFit={data.roleFit} />
        </Card>
        <Card>
          <h3 className={styles.cardTitle}>Score history</h3>
          <LEIHistoryChart history={data.history} />
        </Card>
      </div>
    </div>
  );
}
