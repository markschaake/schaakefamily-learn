/**
 * Versioned localStorage wrapper for the Fractions Practice V1 app.
 *
 * All V1 state is namespaced under `fractions-practice:v1:*`:
 *   - `fractions-practice:v1:progress` — SessionRecord[] (append-only history)
 *   - `fractions-practice:v1:settings` — Settings
 *
 * All reads and writes are SSR-safe (no-op when `window` is undefined).
 * All errors (quota, private mode, malformed JSON) are swallowed so that
 * storage failures never crash a practice session.
 */

// --- Types (architecture: Shared Data Model) ---

/**
 * QuestionType is defined locally to avoid a cross-module import on
 * `@/lib/problems/types` (owned by the `problem-domain` module, which is
 * a peer, not a dependency). The canonical definition lives there;
 * TypeScript's structural typing makes the two string-literal unions
 * interchangeable at use sites.
 */
export type QuestionType =
  | 'visual-to-fraction'
  | 'fraction-to-number-line'
  | 'word-to-visual';

export interface PerTypeCounts {
  correctFirstTry: number;
  correctOnRetry: number;
  incorrect: number;
}

export interface SessionRecord {
  date: string; // ISO date string (new Date().toISOString())
  correctFirstTry: number;
  correctOnRetry: number;
  incorrect: number;
  byQuestionType: Record<QuestionType, PerTypeCounts>;
}

export interface Settings {
  soundEnabled: boolean;
}

// --- Constants ---

export const STORAGE_PREFIX = 'fractions-practice:v1:';
export const PROGRESS_KEY = `${STORAGE_PREFIX}progress`;
export const SETTINGS_KEY = `${STORAGE_PREFIX}settings`;

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: false, // muted by default (architecture Acceptance Criteria)
};

// --- Internals ---

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded, private-mode restriction, etc. Swallow: progress
    // loss is acceptable; a crashed session is not.
  }
}

// --- Public API ---

/** Reads the full progress history. Returns `[]` on SSR, missing key, or bad data. */
export function readProgress(): SessionRecord[] {
  const value = readJSON<unknown>(PROGRESS_KEY, []);
  return Array.isArray(value) ? (value as SessionRecord[]) : [];
}

/**
 * Appends a completed session record to the progress history.
 * SSR-safe no-op. Swallows storage errors (quota, private mode).
 */
export function writeProgress(record: SessionRecord): void {
  const history = readProgress();
  history.push(record);
  writeJSON(PROGRESS_KEY, history);
}

/** Reads the settings object. Returns DEFAULT_SETTINGS on SSR, missing key, or bad data. */
export function readSettings(): Settings {
  const value = readJSON<unknown>(SETTINGS_KEY, DEFAULT_SETTINGS);
  if (value && typeof value === 'object' && 'soundEnabled' in value) {
    const s = value as { soundEnabled: unknown };
    return { soundEnabled: typeof s.soundEnabled === 'boolean' ? s.soundEnabled : false };
  }
  return DEFAULT_SETTINGS;
}

/** Writes the settings object. SSR-safe no-op. Swallows storage errors. */
export function writeSettings(settings: Settings): void {
  writeJSON(SETTINGS_KEY, settings);
}
