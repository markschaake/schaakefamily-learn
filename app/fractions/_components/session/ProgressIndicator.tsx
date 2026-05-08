interface ProgressIndicatorProps {
  /** Total number of problems in the session. */
  total: number;
  /** Zero-based index of the current problem. */
  current: number;
}

export function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Problem ${current + 1} of ${total}`}
      className="flex gap-2 flex-wrap justify-center"
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            'h-2 w-2 rounded-full',
            i < current
              ? 'bg-emerald-600'
              : i === current
                ? 'bg-slate-900 dark:bg-slate-100'
                : 'bg-slate-300 dark:bg-slate-700',
          ].join(' ')}
        />
      ))}
    </div>
  );
}
