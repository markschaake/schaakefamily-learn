import type { Problem, Answer } from '../../_lib/problems/types';

/**
 * V1 correctness: numerator + denominator match.
 * Uniform across all three Answer variants — all carry { numerator, denominator }.
 * Any future per-type tolerance rules would live here.
 */
export function isCorrect(problem: Problem, answer: Answer): boolean {
  // All Answer variants share numerator + denominator fields regardless of kind.
  return answer.numerator === problem.numerator && answer.denominator === problem.denominator;
}
