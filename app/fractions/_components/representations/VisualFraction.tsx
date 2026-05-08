'use client';

import type { FractionProps } from './types';

export function VisualFraction({ numerator, denominator }: FractionProps) {
  if (process.env.NODE_ENV === 'development') {
    if (denominator < 2 || denominator > 10) {
      console.warn(
        `[VisualFraction] denominator (${denominator}) must be between 2 and 10`,
      );
    }
    if (numerator >= denominator) {
      console.warn(
        `[VisualFraction] numerator (${numerator}) must be less than denominator (${denominator})`,
      );
    }
  }

  const stripWidth = 100 / denominator;

  const strips = Array.from({ length: denominator }, (_, i) => {
    const filled = i < numerator;
    return (
      <rect
        key={i}
        x={i * stripWidth}
        y={0}
        width={stripWidth}
        height={40}
        className={(filled ? 'fill-emerald-600' : 'fill-white dark:fill-slate-950') + ' stroke-slate-900 dark:stroke-slate-100'}
        strokeWidth={0.5}
      />
    );
  });

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 100 40"
        className="w-full h-auto text-slate-900 dark:text-slate-100"
        role="img"
        aria-label={`${numerator} out of ${denominator} equal parts shaded`}
      >
        {strips}
      </svg>
      <p className="mt-2 text-center text-sm text-slate-900 dark:text-slate-100">{denominator} equal parts</p>
    </div>
  );
}
