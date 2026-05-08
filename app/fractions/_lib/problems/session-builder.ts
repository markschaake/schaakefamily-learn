import { PROBLEMS } from './problem-set';
import { ROTATION_ORDER, type Problem, type QuestionType } from './types';

export const SESSION_LENGTH = 10;

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

export function buildSession(rng: () => number = Math.random): Problem[] {
  const buckets = new Map<QuestionType, Problem[]>();
  for (const qt of ROTATION_ORDER) {
    buckets.set(
      qt,
      shuffle(
        PROBLEMS.filter((p) => p.questionType === qt),
        rng,
      ),
    );
  }

  const session: Problem[] = [];
  let rotIndex = 0;
  while (session.length < SESSION_LENGTH) {
    const qt = ROTATION_ORDER[rotIndex % ROTATION_ORDER.length]!;
    const bucket = buckets.get(qt);
    if (!bucket || bucket.length === 0) {
      throw new Error(
        `session-builder: not enough problems in bucket '${qt}' to fill a ${SESSION_LENGTH}-problem session`,
      );
    }
    session.push(bucket.shift()!);
    rotIndex++;
  }
  return session;
}
