"use client";

import { useState } from "react";
import Link from "next/link";
import {
  shapes,
  getShapeById,
} from "../_lib";
import { ShapePicker } from "./ShapePicker";
import { Board } from "./Board";
import { FeedbackPanel } from "./FeedbackPanel";

export function TessellationsApp() {
  const [selectedId, setSelectedId] = useState<string>(shapes[0].id);
  const [showPreview, setShowPreview] = useState(false);
  const selectedShape = getShapeById(selectedId) ?? shapes[0];

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-slate-100">
            Tessellations
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Discover which shapes tile cleanly without gaps.
          </p>
        </div>

        {/* Shape Picker */}
        <ShapePicker
          shapes={shapes}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setShowPreview(false);
          }}
        />

        {/* Preview Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:shadow-sm transition text-sm font-medium active:scale-[0.98] dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:ring-slate-600"
          >
            {showPreview ? "✕" : "◫"} {showPreview ? "Hide pattern" : "Show pattern"}
          </button>
        </div>

        {/* Board */}
        <Board shape={selectedShape} showPreview={showPreview} />

        {/* Feedback */}
        <FeedbackPanel shape={selectedShape} />

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
