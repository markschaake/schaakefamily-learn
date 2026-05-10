"use client";

import type { ShapeDefinition } from "../_lib/types";

interface ShapePickerProps {
  shapes: ShapeDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ShapePicker({
  shapes,
  selectedId,
  onSelect,
}: ShapePickerProps) {
  return (
    <div className="grid grid-cols-5 gap-3 w-full">
      {shapes.map((shape) => {
        const isSelected = shape.id === selectedId;
        return (
          <button
            key={shape.id}
            onClick={() => onSelect(shape.id)}
            aria-pressed={isSelected}
            aria-label={`Select ${shape.name}`}
            className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-sm font-medium transition active:scale-[0.98] ${
              isSelected
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:shadow-sm hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:ring-slate-600"
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {shape.emoji}
            </span>
            <span className="text-xs leading-none truncate w-full text-center">
              {shape.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
