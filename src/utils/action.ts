import type { ActionType } from '../types/lei';

interface ActionMeta {
  chipLabel: string;
  chipColor: string; // a CSS var() reference
  cta: string;
}

const META: Record<ActionType, ActionMeta> = {
  lms_track: { chipLabel: '📚 LMS Track', chipColor: 'var(--brand)', cta: 'Start Track →' },
  mock_interview: {
    chipLabel: '🎯 Mock Interview',
    chipColor: 'var(--sev-important)',
    cta: 'Start Mock Interview →',
  },
  resume_update: {
    chipLabel: '📄 Resume Update',
    chipColor: 'var(--tier-advanced)',
    cta: 'Update My Resume →',
  },
  project: { chipLabel: '🛠 Project', chipColor: '#A855F7', cta: 'Build a Project →' },
};

const FALLBACK: ActionMeta = {
  chipLabel: 'Action',
  chipColor: 'var(--brand)',
  cta: 'Get Started →',
};

export function actionMeta(type: string): ActionMeta {
  return META[type as ActionType] ?? FALLBACK;
}
