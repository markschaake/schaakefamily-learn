'use client';

import type { Problem, Answer } from '../../_lib/problems/types';
import { VisualToFraction } from './VisualToFraction';
import { FractionToNumberLine } from './FractionToNumberLine';
import { WordToVisual } from './WordToVisual';

interface QuestionHostProps {
  problem: Problem;
  onAnswer: (answer: Answer) => void;
}

export function QuestionHost({ problem, onAnswer }: QuestionHostProps) {
  switch (problem.questionType) {
    case 'visual-to-fraction':
      return <VisualToFraction problem={problem} onAnswer={onAnswer} />;
    case 'fraction-to-number-line':
      return <FractionToNumberLine problem={problem} onAnswer={onAnswer} />;
    case 'word-to-visual':
      return <WordToVisual problem={problem} onAnswer={onAnswer} />;
  }
}
