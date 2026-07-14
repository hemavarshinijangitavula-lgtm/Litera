import { supabase } from './supabaseClient';

// Dev/demo bypass: a JWT minted with the backend JWT_SECRET. When set, all calls
// use it directly instead of a Supabase session (the backend services validate
// against JWT_SECRET, not Supabase's signing key).
const DEV_JWT = import.meta.env.VITE_DEV_JWT as string | undefined;

async function authToken(): Promise<string> {
  if (DEV_JWT) return DEV_JWT;
  if (!supabase) throw new Error('Not authenticated');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return token;
}

async function authHeader(): Promise<HeadersInit> {
  return { Authorization: `Bearer ${await authToken()}`, 'Content-Type': 'application/json' };
}

const LEI_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8030';
const GAP_URL = import.meta.env.VITE_SKILL_GAP_URL ?? 'http://localhost:8031';
const REC_URL = import.meta.env.VITE_RECOMMENDATION_URL ?? 'http://localhost:8032';

async function get<T>(base: string, path: string): Promise<T> {
  const headers = await authHeader();
  const res = await fetch(`${base}${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  getLEI: () => get<any>(LEI_URL, '/api/v1/lei/me'),
  getLEIHistory: () => get<any>(LEI_URL, '/api/v1/lei/me/history'),
  getLEIBenchmark: () => get<any>(LEI_URL, '/api/v1/lei/me/benchmark'),
  getSkillGaps: () => get<any>(GAP_URL, '/api/v1/lei/me/skill-gaps'),
  getRecommendations: () => get<any>(REC_URL, '/api/v1/lei/me/recommendations'),
};

export function isAuthAvailable(): boolean {
  return Boolean(DEV_JWT) || Boolean(supabase);
}
