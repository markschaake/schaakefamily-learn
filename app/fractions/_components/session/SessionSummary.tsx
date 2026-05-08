import type { SessionRecord } from '../../_lib/storage/progress';

interface SessionSummaryProps {
  counts: SessionRecord;
  onRestart: () => void;
}

export function SessionSummary({ counts, onRestart }: SessionSummaryProps) {
  const total = counts.correctFirstTry + counts.correctOnRetry + counts.incorrect;
  const correct = counts.correctFirstTry + counts.correctOnRetry;

  return (
    <section className="flex flex-col items-center gap-8 py-12 text-center">
      <div className="text-6xl" aria-hidden="true">
        {counts.correctFirstTry >= total * 0.9 ? '🌟' : correct >= total * 0.7 ? '✅' : '📝'}
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Session complete!
      </h2>
      <div className="w-full max-w-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-3 text-left">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Total problems</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{total}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Correct first try</span>
          <span className="font-semibold text-emerald-600">{counts.correctFirstTry}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Correct on retry</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {counts.correctOnRetry}
          </span>
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Needed review</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {counts.incorrect}
          </span>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="min-h-[44px] px-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium active:scale-[0.98] transition"
      >
        Practice again
      </button>
    </section>
  );
}
