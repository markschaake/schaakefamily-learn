import type { Problem } from './types';
import { validateProblemSet } from './problem-set.validate';

export const PROBLEMS: readonly Problem[] = [
  // --- visual-to-fraction (14) ---
  { id: 'v2f-1-of-2', questionType: 'visual-to-fraction', numerator: 1, denominator: 2 },
  { id: 'v2f-1-of-3', questionType: 'visual-to-fraction', numerator: 1, denominator: 3 },
  { id: 'v2f-2-of-3', questionType: 'visual-to-fraction', numerator: 2, denominator: 3 },
  { id: 'v2f-1-of-4', questionType: 'visual-to-fraction', numerator: 1, denominator: 4 },
  { id: 'v2f-3-of-4', questionType: 'visual-to-fraction', numerator: 3, denominator: 4 },
  { id: 'v2f-2-of-5', questionType: 'visual-to-fraction', numerator: 2, denominator: 5 },
  { id: 'v2f-4-of-5', questionType: 'visual-to-fraction', numerator: 4, denominator: 5 },
  { id: 'v2f-1-of-6', questionType: 'visual-to-fraction', numerator: 1, denominator: 6 },
  { id: 'v2f-5-of-6', questionType: 'visual-to-fraction', numerator: 5, denominator: 6 },
  { id: 'v2f-3-of-7', questionType: 'visual-to-fraction', numerator: 3, denominator: 7 },
  { id: 'v2f-3-of-8', questionType: 'visual-to-fraction', numerator: 3, denominator: 8 },
  { id: 'v2f-5-of-8', questionType: 'visual-to-fraction', numerator: 5, denominator: 8 },
  { id: 'v2f-4-of-9', questionType: 'visual-to-fraction', numerator: 4, denominator: 9 },
  { id: 'v2f-7-of-10', questionType: 'visual-to-fraction', numerator: 7, denominator: 10 },

  // --- fraction-to-number-line (13) ---
  { id: 'f2nl-1-of-2', questionType: 'fraction-to-number-line', numerator: 1, denominator: 2 },
  { id: 'f2nl-2-of-3', questionType: 'fraction-to-number-line', numerator: 2, denominator: 3 },
  { id: 'f2nl-1-of-4', questionType: 'fraction-to-number-line', numerator: 1, denominator: 4 },
  { id: 'f2nl-3-of-4', questionType: 'fraction-to-number-line', numerator: 3, denominator: 4 },
  { id: 'f2nl-3-of-5', questionType: 'fraction-to-number-line', numerator: 3, denominator: 5 },
  { id: 'f2nl-5-of-6', questionType: 'fraction-to-number-line', numerator: 5, denominator: 6 },
  { id: 'f2nl-2-of-7', questionType: 'fraction-to-number-line', numerator: 2, denominator: 7 },
  { id: 'f2nl-6-of-7', questionType: 'fraction-to-number-line', numerator: 6, denominator: 7 },
  { id: 'f2nl-1-of-8', questionType: 'fraction-to-number-line', numerator: 1, denominator: 8 },
  { id: 'f2nl-7-of-8', questionType: 'fraction-to-number-line', numerator: 7, denominator: 8 },
  { id: 'f2nl-2-of-9', questionType: 'fraction-to-number-line', numerator: 2, denominator: 9 },
  { id: 'f2nl-5-of-9', questionType: 'fraction-to-number-line', numerator: 5, denominator: 9 },
  { id: 'f2nl-3-of-10', questionType: 'fraction-to-number-line', numerator: 3, denominator: 10 },

  // --- word-to-visual (13) ---
  {
    id: 'w2v-1-of-2',
    questionType: 'word-to-visual',
    numerator: 1,
    denominator: 2,
    distractors: [
      { numerator: 1, denominator: 3 },
      { numerator: 1, denominator: 4 },
      { numerator: 2, denominator: 3 },
    ],
  },
  {
    id: 'w2v-2-of-3',
    questionType: 'word-to-visual',
    numerator: 2,
    denominator: 3,
    distractors: [
      { numerator: 1, denominator: 3 },
      { numerator: 2, denominator: 5 },
      { numerator: 3, denominator: 4 },
    ],
  },
  {
    id: 'w2v-1-of-4',
    questionType: 'word-to-visual',
    numerator: 1,
    denominator: 4,
    distractors: [
      { numerator: 1, denominator: 3 },
      { numerator: 3, denominator: 4 },
      { numerator: 2, denominator: 4 },
    ],
  },
  {
    id: 'w2v-3-of-4',
    questionType: 'word-to-visual',
    numerator: 3,
    denominator: 4,
    distractors: [
      { numerator: 1, denominator: 4 },
      { numerator: 3, denominator: 5 },
      { numerator: 2, denominator: 4 },
    ],
  },
  {
    id: 'w2v-2-of-5',
    questionType: 'word-to-visual',
    numerator: 2,
    denominator: 5,
    distractors: [
      { numerator: 1, denominator: 5 },
      { numerator: 3, denominator: 5 },
      { numerator: 2, denominator: 3 },
    ],
  },
  {
    id: 'w2v-3-of-5',
    questionType: 'word-to-visual',
    numerator: 3,
    denominator: 5,
    distractors: [
      { numerator: 2, denominator: 5 },
      { numerator: 4, denominator: 5 },
      { numerator: 3, denominator: 4 },
    ],
  },
  {
    id: 'w2v-1-of-6',
    questionType: 'word-to-visual',
    numerator: 1,
    denominator: 6,
    distractors: [
      { numerator: 1, denominator: 4 },
      { numerator: 5, denominator: 6 },
      { numerator: 2, denominator: 6 },
    ],
  },
  {
    id: 'w2v-4-of-6',
    questionType: 'word-to-visual',
    numerator: 4,
    denominator: 6,
    distractors: [
      { numerator: 1, denominator: 6 },
      { numerator: 5, denominator: 6 },
      { numerator: 4, denominator: 9 },
    ],
  },
  {
    id: 'w2v-2-of-7',
    questionType: 'word-to-visual',
    numerator: 2,
    denominator: 7,
    distractors: [
      { numerator: 1, denominator: 7 },
      { numerator: 3, denominator: 7 },
      { numerator: 2, denominator: 9 },
    ],
  },
  {
    id: 'w2v-4-of-7',
    questionType: 'word-to-visual',
    numerator: 4,
    denominator: 7,
    distractors: [
      { numerator: 2, denominator: 7 },
      { numerator: 6, denominator: 7 },
      { numerator: 4, denominator: 9 },
    ],
  },
  {
    id: 'w2v-3-of-8',
    questionType: 'word-to-visual',
    numerator: 3,
    denominator: 8,
    distractors: [
      { numerator: 1, denominator: 8 },
      { numerator: 5, denominator: 8 },
      { numerator: 3, denominator: 5 },
    ],
  },
  {
    id: 'w2v-6-of-9',
    questionType: 'word-to-visual',
    numerator: 6,
    denominator: 9,
    distractors: [
      { numerator: 3, denominator: 9 },
      { numerator: 7, denominator: 9 },
      { numerator: 6, denominator: 10 },
    ],
  },
  {
    id: 'w2v-7-of-10',
    questionType: 'word-to-visual',
    numerator: 7,
    denominator: 10,
    distractors: [
      { numerator: 3, denominator: 10 },
      { numerator: 9, denominator: 10 },
      { numerator: 7, denominator: 8 },
    ],
  },
];

// Validates at module-import time — any violation fails `bun run build`.
validateProblemSet(PROBLEMS);
