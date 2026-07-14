import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { RoleFit } from '../../types/lei';
import styles from './RoleFitChart.module.css';

interface Props {
  roleFit: RoleFit[];
}

export default function RoleFitChart({ roleFit }: Props) {
  if (!roleFit || roleFit.length === 0) {
    return (
      <div className={styles.empty}>
        Role fit appears once your profile has enough signal to match roles.
      </div>
    );
  }

  const sorted = [...roleFit].sort((a, b) => b.fitScore - a.fitScore);
  const data = sorted.map((r) => ({ name: r.roleName, score: r.fitScore }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart layout="vertical" data={data} margin={{ left: 16, right: 24, top: 8, bottom: 8 }}>
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--bg-raise)' }}
          contentStyle={{
            background: 'var(--bg-card)',
            border: 'none',
            borderRadius: 8,
            color: 'var(--text-primary)',
          }}
        />
        <ReferenceLine
          x={60}
          stroke="var(--sev-important)"
          strokeDasharray="4 4"
          label={{
            value: 'Career Ready',
            fill: 'var(--sev-important)',
            fontSize: 10,
            position: 'insideTopRight',
          }}
        />
        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? 'var(--brand)' : 'var(--bg-raise)'}
              stroke={i === 0 ? 'var(--brand)' : 'none'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
