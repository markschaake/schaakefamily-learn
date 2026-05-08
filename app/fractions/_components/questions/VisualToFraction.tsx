'use client';

import { useState } from 'react';
import type { VisualToFractionProblem, Answer } from '../../_lib/problems/types';
import { VisualFraction } from '../representations';

interface VisualToFractionProps {
  problem: VisualToFractionProblem;
  onAnswer: (answer: Answer) => void;
}

export function VisualToFraction({ problem, onAnswer }: VisualToFractionProps) {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');

  const n = parseInt(numerator, 10);
  const d = parseInt(denominator, 10);
  const canSubmit = !isNaN(n) && !isNaN(d) && n >= 1 && d >= 2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onAnswer({ kind: 'numerator-denominator', numerator: n, denominator: d });
  }

  return (
    <section className="flex flex-col items-center gap-6 w-full">
      <p className="text-lg font-medium text-slate-900 dark:text-slate-100 text-center">
        What fraction is shaded?
      </p>
      <div className="w-full max-w-xs">
        <VisualFraction numerator={problem.numerator} denominator={problem.denominator} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
        aria-label="Enter the fraction"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <label
              htmlFor="vtf-numerator"
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              numerator
            </label>
            <input
              id="vtf-numerator"
              type="number"
              min={1}
              max={99}
              className="w-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-center text-xl font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={numerator}
              onChange={(e) => setNumerator(e.target.value)}
              placeholder="?"
              autoComplete="off"
              inputMode="numeric"
            />
          </div>
          <div className="mt-5 h-0.5 w-6 bg-slate-900 dark:bg-slate-100" aria-hidden="true" />
          <div className="flex flex-col items-center gap-1">
            <label
              htmlFor="vtf-denominator"
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              denominator
            </label>
            <input
              id="vtf-denominator"
              type="number"
              min={2}
              max={99}
              className="w-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-center text-xl font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
              placeholder="?"
              autoComplete="off"
              inputMode="numeric"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="min-h-[44px] px-6 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-40 active:scale-[0.98] transition"
        >
          Check
        </button>
      </form>
    </section>
  );
}
