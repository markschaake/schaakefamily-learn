// Structural copies of problem-domain / storage types.
// Source of truth: architecture §Shared Data Model.
// Intentionally duplicated here — see module plan Key Decisions #1.

export type QuestionType =
  | 'visual-to-fraction'
  | 'fraction-to-number-line'
  | 'word-to-visual';

export interface Problem {
  id: string;
  numerator: number;
  denominator: number;
  questionType: QuestionType;
  distractors?: Array<{ numerator: number; denominator: number }>;
}

export type Answer =
  | { kind: 'numerator-denominator'; numerator: number; denominator: number }
  | { kind: 'number-line-position'; numerator: number; denominator: number }
  | { kind: 'visual-choice'; numerator: number; denominator: number };

export type FeedbackOutcome = 'correct' | 'retry' | 'reveal';
