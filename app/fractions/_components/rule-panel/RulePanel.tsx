'use client';

interface RulePanelProps {
  highlighted?: boolean;
}

export function RulePanel({ highlighted = false }: RulePanelProps) {
  return (
    <aside
      role="note"
      aria-label="Rule reminder"
      className={[
        'fixed inset-x-0 top-0 z-40',
        'pt-[env(safe-area-inset-top)]',
        'border-b border-slate-400/10 dark:border-slate-600/10',
        'px-4 py-3',
        highlighted
          ? 'bg-emerald-600/10 ring-2 ring-emerald-600'
          : 'bg-white dark:bg-slate-950',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-1 text-center">
        <p className="text-base font-medium text-slate-900 dark:text-slate-100">
          Top number = shaded parts{' '}
          <span className="text-sm text-slate-900/60 dark:text-slate-100/60">(numerator)</span>
        </p>
        <p className="text-base font-medium text-slate-900 dark:text-slate-100">
          Bottom number = total equal parts{' '}
          <span className="text-sm text-slate-900/60 dark:text-slate-100/60">(denominator)</span>
        </p>
      </div>
    </aside>
  );
}
