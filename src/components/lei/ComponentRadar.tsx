import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { LEIScore } from '../../types/lei';
import styles from './ComponentRadar.module.css';

interface Props {
  score: LEIScore;
}

const AXES = [
  { key: 'skillsScore', label: 'Skills', weight: 20 },
  { key: 'assessmentsScore', label: 'Assessments', weight: 20 },
  { key: 'projectsScore', label: 'Projects', weight: 20 },
  { key: 'interviewScore', label: 'Interview', weight: 15 },
  { key: 'resumeScore', label: 'Resume', weight: 10 },
  { key: 'experienceScore', label: 'Experience', weight: 10 },
  { key: 'certificationsScore', label: 'Certifications', weight: 5 },
] as const;

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { axis, value, weight } = payload[0].payload;
  return (
    <div className={styles.tooltip}>
      <strong>{axis}</strong>
      <div className="mono">
        {value} / 100 &nbsp;({weight}% of LEI)
      </div>
    </div>
  );
}

export default function ComponentRadar({ score }: Props) {
  const data = AXES.map((a) => ({
    axis: a.label,
    value: (score[a.key] as number | null) ?? 0,
    weight: a.weight,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%">
          <PolarGrid stroke="var(--text-muted)" strokeOpacity={0.3} />
          <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke="var(--brand)"
            strokeWidth={2}
            fill="var(--brand)"
            fillOpacity={0.2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        {data.map((d) => (
          <div className={styles.legendRow} key={d.axis}>
            <span className={styles.legendLabel}>{d.axis}</span>
            <div className={styles.legendBar}>
              <div className={styles.legendFill} style={{ width: `${d.value}%` }} />
            </div>
            <span className={`${styles.legendScore} mono`}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
