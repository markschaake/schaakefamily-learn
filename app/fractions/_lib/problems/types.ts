export const QUESTION_TYPES = [
  'visual-to-fraction',
  'fraction-to-number-line',
  'word-to-visual',
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const ROTATION_ORDER: readonly QuestionType[] = [
  'visual-to-fraction',
  'fraction-to-number-line',
  'word-to-visual',
] as const;

interface BaseProblem {
  id: string; // kebab-case, unique within PROBLEMS
  numerator: number; // 1..denominator-1
  denominator: number; // 2..10
}

export interface VisualToFractionProblem extends BaseProblem {
  questionType: 'visual-to-fraction';
}

export interface FractionToNumberLineProblem extends BaseProblem {
  questionType: 'fraction-to-number-line';
}

export interface WordToVisualProblem extends BaseProblem {
  questionType: 'word-to-visual';
  distractors: ReadonlyArray<{ numerator: number; denominator: number }>;
}

export type Problem =
  | VisualToFractionProblem
  | FractionToNumberLineProblem
  | WordToVisualProblem;

export type Answer =
  | { kind: 'numerator-denominator'; numerator: number; denominator: number }
  | { kind: 'number-line-position'; numerator: number; denominator: number }
  | { kind: 'visual-choice'; numerator: number; denominator: number };
