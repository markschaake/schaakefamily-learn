'use client';

import { useState } from 'react';
import type { FractionToNumberLineProblem, Answer } from '../../_lib/problems/types';
import { NumberLine, WordFraction } from '../representations';

interface FractionToNumberLineProps {
  problem: FractionToNumberLineProblem;
  onAnswer: (answer: Answer) => void;
}

export function FractionToNumberLine({ problem, onAnswer }: FractionToNumberLineProps) {
  const [selection, setSelection] = useState<{
    numerator: number;
    denominator: number;
  } | null>(null);

  function handleChange(value: { numerator: number; denominator: number }) {
    setSelection(value);
  }

  function handleSubmit() {
    if (!selection) return;
    onAnswer({
      kind: 'number-line-position',
      numerator: selection.numerator,
      denominator: selection.denominator,
    });
  }

  return (
    <section className="flex flex-col items-center gap-6 w-full">
      <p className="text-lg font-medium text-slate-900 dark:text-slate-100 text-center">
        Mark this fraction on the number line.
      </p>
      <div className="flex justify-center">
        <WordFraction numerator={problem.numerator} denominator={problem.denominator} />
      </div>
      <div className="w-full max-w-sm px-4">
        <NumberLine
          numerator={problem.numerator}
          denominator={problem.denominator}
          onChange={handleChange}
          mode="input"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selection}
        className="min-h-[44px] px-6 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-40 active:scale-[0.98] transition"
      >
        Check
      </button>
    </section>
  );
}
