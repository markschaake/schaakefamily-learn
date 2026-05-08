'use client';

import type { FractionProps } from './types';

/**
 * Formats the quotient of numerator/denominator to at most 3 decimal places
 * with trailing zeros trimmed. A lone decimal point is replaced with '.0'.
 *
 * Examples:
 *   1/2  → "0.5"
 *   1/4  → "0.25"
 *   3/8  → "0.375"
 *   1/3  → "0.333"  (repeating, truncated at 3 places)
 *   7/10 → "0.7"
 */
function formatQuotient(n: number, d: number): string {
  const raw = (n / d).toFixed(3);
  const trimmed = raw.replace(/0+$/, '').replace(/\.$/, '.0');
  return trimmed;
}

/**
 * Renders the division form: "{N} ÷ {D} = {decimal}".
 *
 * Used only as passive output by AnswerFeedback. Must never be composed
 * inside a question component (that contract is enforced by convention, not runtime).
 */
export function DivisionFraction({ numerator, denominator }: FractionProps) {
  if (process.env.NODE_ENV === 'development') {
    if (denominator < 2 || denominator > 10) {
      console.warn(
        `[DivisionFraction] denominator (${denominator}) must be between 2 and 10`,
      );
    }
    if (numerator >= denominator) {
      console.warn(
        `[DivisionFraction] numerator (${numerator}) must be less than denominator (${denominator})`,
      );
    }
  }

  const decimal = formatQuotient(numerator, denominator);

  return (
    <span
      className="text-slate-900 dark:text-slate-100 text-xl tabular-nums"
      aria-label={`${numerator} divided by ${denominator} equals ${decimal}`}
    >
      {numerator} ÷ {denominator} = {decimal}
    </span>
  );
}
