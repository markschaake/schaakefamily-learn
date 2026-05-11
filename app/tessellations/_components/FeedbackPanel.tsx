"use client";

import type { ShapeDefinition } from "../_lib/types";

interface FeedbackPanelProps {
  shape: ShapeDefinition;
  placedCount: number;
}

export function FeedbackPanel({ shape, placedCount }: FeedbackPanelProps) {
  const isTessellating = shape.tessellatesByItself;

  let message = shape.explanation;
  if (placedCount === 0) {
    message = `Can the ${shape.name.toLowerCase()} tile the plane without gaps? Try adding shapes and arranging them to find out!`;
  } else if (placedCount === 1) {
    message = "Good start! Add more shapes and try to fit them edge-to-edge.";
  }

  return (
    <div
      className={`w-full rounded-2xl p-5 ${
        isTessellating
          ? "bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-800"
          : "bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 leading-none mt-0.5" aria-hidden="true">
          {isTessellating ? "🧩" : "🤔"}
        </span>
        <div>
          <h3
            className={`text-lg font-semibold ${
              isTessellating
                ? "text-emerald-900 dark:text-emerald-200"
                : "text-amber-900 dark:text-amber-200"
            }`}
          >
            {placedCount === 0
              ? `Will the ${shape.name} tessellate?`
              : isTessellating
                ? `${shape.name} tessellates!`
                : `${shape.name} does not tessellate by itself`}
          </h3>
          <p
            className={`mt-1 text-sm leading-relaxed ${
              isTessellating
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
