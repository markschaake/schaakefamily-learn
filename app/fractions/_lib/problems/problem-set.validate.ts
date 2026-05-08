import type { Problem } from './types';
import { QUESTION_TYPES } from './types';

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_D = 2;
const MAX_D = 10;

export function validateProblemSet(problems: readonly Problem[]): void {
  const seenIds = new Set<string>();
  const seenTriple = new Set<string>();

  problems.forEach((p, i) => {
    const where = `index ${i}${p.id ? ` (id '${p.id}')` : ''}`;

    if (!p.id || !KEBAB.test(p.id)) {
      throw new Error(
        `problem-set.validate: ${where} has invalid id (must be kebab-case)`,
      );
    }
    if (seenIds.has(p.id)) {
      throw new Error(
        `problem-set.validate: duplicate id '${p.id}' at index ${i}`,
      );
    }
    seenIds.add(p.id);

    if (!QUESTION_TYPES.includes(p.questionType)) {
      throw new Error(
        `problem-set.validate: ${where} has unknown questionType '${p.questionType}'`,
      );
    }
    if (
      !Number.isInteger(p.denominator) ||
      p.denominator < MIN_D ||
      p.denominator > MAX_D
    ) {
      throw new Error(
        `problem-set.validate: ${where} has denominator ${p.denominator} (must be ${MIN_D}..${MAX_D})`,
      );
    }
    if (
      !Number.isInteger(p.numerator) ||
      p.numerator < 1 ||
      p.numerator >= p.denominator
    ) {
      throw new Error(
        `problem-set.validate: ${where} has numerator ${p.numerator} (must be 1..${p.denominator - 1})`,
      );
    }

    const triple = `${p.questionType}:${p.numerator}/${p.denominator}`;
    if (seenTriple.has(triple)) {
      throw new Error(
        `problem-set.validate: duplicate (questionType, numerator, denominator) for ${triple} at ${where}`,
      );
    }
    seenTriple.add(triple);

    if (p.questionType === 'word-to-visual') {
      if (!p.distractors || p.distractors.length < 1) {
        throw new Error(
          `problem-set.validate: ${where} is word-to-visual but has no distractors`,
        );
      }
      p.distractors.forEach((d, j) => {
        if (
          !Number.isInteger(d.denominator) ||
          d.denominator < MIN_D ||
          d.denominator > MAX_D
        ) {
          throw new Error(
            `problem-set.validate: ${where} distractor ${j} has denominator ${d.denominator} (must be ${MIN_D}..${MAX_D})`,
          );
        }
        if (
          !Number.isInteger(d.numerator) ||
          d.numerator < 1 ||
          d.numerator >= d.denominator
        ) {
          throw new Error(
            `problem-set.validate: ${where} distractor ${j} has numerator ${d.numerator} (must be 1..${d.denominator - 1})`,
          );
        }
        if (d.numerator === p.numerator && d.denominator === p.denominator) {
          throw new Error(
            `problem-set.validate: ${where} distractor ${j} duplicates the correct answer`,
          );
        }
      });
      const distractorSeen = new Set<string>();
      p.distractors.forEach((d, j) => {
        const key = `${d.numerator}/${d.denominator}`;
        if (distractorSeen.has(key)) {
          throw new Error(
            `problem-set.validate: ${where} has duplicate distractor '${key}' at position ${j}`,
          );
        }
        distractorSeen.add(key);
      });
    }
  });
}
