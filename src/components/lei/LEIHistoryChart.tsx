import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { LEIScore } from '../../types/lei';
import styles from './LEIHistoryChart.module.css';

interface Props {
  history: LEIScore[];
}

export default function LEIHistoryChart({ history }: Props) {
  if (history.length < 2) {
    return <div className={styles.empty}>Complete more assessments to see your score trend.</div>;
  }

  const data = [...history].reverse().map((h) => ({
    date: new Date(h.calculatedAt).toLocaleDateString(),
    score: h.totalScore,
    tier: h.tier,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
        <CartesianGrid stroke="var(--bg-raise)" />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: 'none',
            borderRadius: 8,
            color: 'var(--text-primary)',
          }}
          formatter={(v: any, _: any, p: any) => [`${v} — ${p.payload.tier}`, 'LEI Score']}
        />
        <ReferenceLine y={40} stroke="var(--tier-developing)" strokeOpacity={0.4} />
        <ReferenceLine y={60} stroke="var(--tier-career-ready)" strokeOpacity={0.4} />
        <ReferenceLine y={75} stroke="var(--tier-advanced)" strokeOpacity={0.4} />
        <ReferenceLine y={90} stroke="var(--tier-competitive)" strokeOpacity={0.4} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="var(--brand)"
          strokeWidth={2}
          dot={{ r: 4, fill: 'var(--brand)', strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
