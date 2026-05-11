"use client";

import { useState } from "react";
import Link from "next/link";
import { shapes, getShapeById } from "../_lib";
import type { PlacedShape } from "../_lib/types";
import { ShapePicker } from "./ShapePicker";
import { Board } from "./Board";
import { FeedbackPanel } from "./FeedbackPanel";

let nextId = 1;
function makeId(): string {
  return `shape-${Date.now()}-${nextId++}`;
}

export function TessellationsApp() {
  const [selectedId, setSelectedId] = useState<string>(shapes[0].id);
  const [placedShapes, setPlacedShapes] = useState<PlacedShape[]>([]);
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const selectedShape = getShapeById(selectedId) ?? shapes[0];

  function handleSelectShape(id: string) {
    setSelectedId(id);
    setPlacedShapes([]);
    setSelectedPlacedId(null);
    setShowHint(false);
  }

  function handleAddShape() {
    const { w, h } = selectedShape.tileSize;
    const offset = placedShapes.length % 4;
    const x = 25 + (offset % 2) * (w + 2);
    const y = 25 + Math.floor(offset / 2) * (h + 2);

    setPlacedShapes((prev) => [
      ...prev,
      {
        id: makeId(),
        shapeId: selectedShape.id,
        x,
        y,
        rotation: 0,
      },
    ]);
    setSelectedPlacedId(null);
    setShowHint(false);
  }

  function handleMoveShape(id: string, x: number, y: number) {
    setPlacedShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x, y } : s)),
    );
  }

  function handleRotateShape(id: string) {
    setPlacedShapes((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, rotation: s.rotation + (selectedShape.snapAngle || 15) }
          : s,
      ),
    );
  }

  function handleDeleteShape(id: string) {
    setPlacedShapes((prev) => prev.filter((s) => s.id !== id));
    setSelectedPlacedId(null);
  }

  function handleClearBoard() {
    setPlacedShapes([]);
    setSelectedPlacedId(null);
    setShowHint(false);
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-slate-100">
            Tessellations
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Drag, rotate, and arrange shapes to see if they tile without gaps.
          </p>
        </div>

        {/* Shape Picker */}
        <ShapePicker
          shapes={shapes}
          selectedId={selectedId}
          onSelect={handleSelectShape}
        />

        {/* Board + Controls */}
        <div className="flex flex-col items-center gap-3">
          <Board
            shape={selectedShape}
            placedShapes={placedShapes}
            selectedId={selectedPlacedId}
            showHint={showHint}
            onMoveShape={handleMoveShape}
            onRotateShape={handleRotateShape}
            onDeleteShape={handleDeleteShape}
            onSelectShape={setSelectedPlacedId}
          />

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleAddShape}
              disabled={showHint}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition text-sm font-semibold shadow-sm active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              + Add shape
            </button>

            <button
              onClick={() => setShowHint((v) => !v)}
              disabled={placedShapes.length > 0 && !showHint}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:shadow-sm transition text-sm font-medium active:scale-[0.98] dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:ring-slate-600 disabled:opacity-40 disabled:pointer-events-none"
            >
              {showHint ? "✕ Hide hint" : "◫ Show hint"}
            </button>

            {placedShapes.length > 0 && (
              <button
                onClick={handleClearBoard}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 transition text-sm font-medium active:scale-[0.98] dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                ↺ Clear board
              </button>
            )}
          </div>

          {/* Hint text */}
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-sm">
            {showHint
              ? "This is the correct tessellation pattern. Try to recreate it yourself!"
              : placedShapes.length === 0
                ? "Add shapes and arrange them to test if they tessellate."
                : "Drag shapes to move. Tap a shape, then use ↻ to rotate or ✕ to delete."}
          </p>
        </div>

        {/* Feedback */}
        <FeedbackPanel shape={selectedShape} placedCount={placedShapes.length} />

        {/* Back link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
