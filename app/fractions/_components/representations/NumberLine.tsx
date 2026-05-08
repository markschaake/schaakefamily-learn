'use client';

import { useEffect, useRef, useState } from 'react';
import type { NumberLineProps } from './types';

/** Minimum knob tap target size in pixels (≥44pt per HIG). */
const KNOB_SIZE_PX = 48;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * A custom pointer-event number-line slider from 0 to 1.
 *
 * - Passive when `onChange` is omitted: renders the knob at the given
 *   `numerator / denominator` position with no interactive handlers.
 * - Interactive when `onChange` is provided: the knob starts at 0, snaps
 *   visually to the nearest tick during drag, and fires `onChange` exactly
 *   once on pointer release with the snapped `{ numerator, denominator }`.
 *
 * Native `<input type="range">` is intentionally not used (architecture
 * Technical Decision 4).
 */
export function NumberLine({ numerator, denominator, onChange }: NumberLineProps) {
  if (process.env.NODE_ENV === 'development') {
    if (denominator < 2 || denominator > 10) {
      console.warn(
        `[NumberLine] denominator (${denominator}) must be between 2 and 10`,
      );
    }
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
      console.warn('[NumberLine] numerator and denominator must be integers');
    }
  }

  const interactive = typeof onChange === 'function';

  // Interactive mode starts at 0 (fresh question); passive mode derives from props each render.
  const [index, setIndex] = useState<number>(0);

  // Reset index to 0 in interactive mode when denominator changes (prevents knob going off-track).
  useEffect(() => {
    if (interactive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(0);
    }
  }, [denominator]); // eslint-disable-line react-hooks/exhaustive-deps

  // Passive mode always derives the displayed position directly from props so it
  // stays in sync across re-renders (e.g. parent moves to a new problem).
  const displayIndex = interactive ? index : clamp(numerator, 0, denominator);

  const trackRef = useRef<HTMLDivElement | null>(null);
  /** Stores the pointerId that is currently being tracked, or null if none. */
  const capturedIdRef = useRef<number | null>(null);

  function tickFromClientX(clientX: number): number {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = clamp(ratio, 0, 1);
    return Math.round(clamped * denominator);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>): void {
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    capturedIdRef.current = e.pointerId;
    setIndex(tickFromClientX(e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>): void {
    if (capturedIdRef.current !== e.pointerId) return;
    setIndex(tickFromClientX(e.clientX));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>): void {
    if (capturedIdRef.current !== e.pointerId) return;
    capturedIdRef.current = null;
    const snapped = tickFromClientX(e.clientX);
    setIndex(snapped);
    onChange?.({ numerator: snapped, denominator });
  }

  const knobPercent = (displayIndex / denominator) * 100;

  return (
    <div className="w-full select-none">
      {/* Track area — measures pointer positions and hosts the SVG + knob. */}
      <div
        ref={trackRef}
        className="relative w-full touch-none text-slate-900 dark:text-slate-100"
        style={{ height: `${KNOB_SIZE_PX}px` }}
        onPointerDown={interactive ? handlePointerDown : undefined}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerUp={interactive ? handlePointerUp : undefined}
      >
        {/* SVG: horizontal track line + tick marks at each 1/denominator interval. */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Horizontal track */}
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* Tick marks at every multiple of 1/denominator, including 0 and 1. */}
          {Array.from({ length: denominator + 1 }, (_, i) => (
            <line
              key={i}
              x1={`${(i / denominator) * 100}`}
              y1="25"
              x2={`${(i / denominator) * 100}`}
              y2="75"
              stroke="currentColor"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Knob: circular indicator centred on the current tick position. */}
        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={denominator}
          aria-valuenow={displayIndex}
          aria-label="Number line from 0 to 1"
          style={{
            position: 'absolute',
            left: `${knobPercent}%`,
            top: '50%',
            width: KNOB_SIZE_PX,
            height: KNOB_SIZE_PX,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none',
          }}
          className={`rounded-full bg-emerald-600${interactive ? ' cursor-grab' : ''}`}
        />
      </div>

      {/* End labels: "0" and "1" aligned with the track extremes. */}
      <div className="flex justify-between text-sm text-slate-900 dark:text-slate-100 mt-1">
        <span>0</span>
        <span>1</span>
      </div>
    </div>
  );
}
