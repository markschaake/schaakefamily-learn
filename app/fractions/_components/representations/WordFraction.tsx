'use client';

import type { FractionProps } from './types';

export function WordFraction({ numerator, denominator }: FractionProps) {
  if (process.env.NODE_ENV === 'development') {
    if (denominator < 2 || denominator > 10) {
      console.warn(
        `[WordFraction] denominator (${denominator}) must be between 2 and 10`,
      );
    }
    if (numerator >= denominator) {
      console.warn(
        `[WordFraction] numerator (${numerator}) must be less than denominator (${denominator})`,
      );
    }
  }

  return (
    <span className="text-slate-900 dark:text-slate-100 text-xl">
      {numerator} out of {denominator} equal parts
    </span>
  );
}
