import type { QuestionType } from './types';

export const RETRY_COPY: Record<QuestionType, string> = {
  'visual-to-fraction':
    'Count again. The bottom number is the total equal parts.',
  'fraction-to-number-line':
    'Slide the dot again. Think where it lands between 0 and 1.',
  'word-to-visual':
    "Read it again. 'Out of' tells you the total equal parts.",
};
