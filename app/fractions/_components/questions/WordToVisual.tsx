'use client';

import { useMemo } from 'react';
import type { WordToVisualProblem, Answer } from '../../_lib/problems/types';
import { VisualFraction } from '../representations';

interface WordToVisualProps {
  problem: WordToVisualProblem;
  onAnswer: (answer: Answer) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

export function WordToVisual({ problem, onAnswer }: WordToVisualProps) {
  // Shuffle once per problem identity (problem.id changes when a new problem is shown).
  const choices = useMemo(
    () =>
      shuffleArray([
        { numerator: problem.numerator, denominator: problem.denominator },
        ...problem.distractors,
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [problem.id],
  );

  return (
    <section className="flex flex-col items-center gap-6 w-full">
      <p className="text-lg font-medium text-slate-900 dark:text-slate-100 text-center">
        Which picture shows this fraction?
      </p>
      <p className="text-xl font-medium text-slate-900 dark:text-slate-100">
        {problem.numerator} out of {problem.denominator} equal parts
      </p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() =>
              onAnswer({
                kind: 'visual-choice',
                numerator: choice.numerator,
                denominator: choice.denominator,
              })
            }
            className="min-h-[44px] rounded-xl border-2 border-slate-300 dark:border-slate-700 p-3 active:scale-[0.98] transition hover:border-emerald-500 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={`${choice.numerator} out of ${choice.denominator} equal parts`}
          >
            <VisualFraction numerator={choice.numerator} denominator={choice.denominator} />
          </button>
        ))}
      </div>
    </section>
  );
}
