'use client';
import {
  VisualFraction,
  WordFraction,
  DivisionFraction,
  NumberLine,
} from '../representations';
import { RETRY_COPY } from './retry-copy';
import type { Problem, Answer, FeedbackOutcome } from './types';

interface AnswerFeedbackProps {
  problem: Problem;
  userAnswer: Answer;
  outcome: FeedbackOutcome;
  onContinue?: () => void;
  onRetry?: () => void;
}

export function AnswerFeedback({
  problem,
  outcome,
  onContinue,
  onRetry,
}: AnswerFeedbackProps) {
  if (outcome === 'correct') {
    return (
      <section
        role="status"
        aria-live="polite"
        className="flex items-center justify-center gap-3 rounded-md bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100 px-4 py-3"
      >
        <span aria-hidden="true" className="text-xl">✓</span>
        <span className="text-lg font-medium">Nice.</span>
      </section>
    );
  }

  if (outcome === 'retry') {
    return (
      <section
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-3 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-xl font-bold">!</span>
          <span className="text-base">{RETRY_COPY[problem.questionType]}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="min-h-[44px] px-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium active:scale-[0.98] transition"
          >
            Try again
          </button>
        )}
      </section>
    );
  }

  // outcome === 'reveal'
  const { numerator, denominator } = problem;
  return (
    <section aria-label="Answer reveal" className="flex flex-col gap-6">
      <p className="text-center text-lg text-slate-900 dark:text-slate-100">
        Here&apos;s how this fraction looks in four ways:
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <VisualFraction numerator={numerator} denominator={denominator} mode="reveal" />
        </div>
        <div className="flex items-center justify-center">
          <WordFraction numerator={numerator} denominator={denominator} mode="reveal" />
        </div>
        <div className="flex items-center justify-center">
          <DivisionFraction numerator={numerator} denominator={denominator} mode="reveal" />
        </div>
        <div className="flex items-center justify-center">
          <NumberLine numerator={numerator} denominator={denominator} mode="reveal" />
        </div>
      </div>
      {onContinue && (
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="min-h-[44px] px-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium active:scale-[0.98] transition"
          >
            Continue
          </button>
        </div>
      )}
    </section>
  );
}
