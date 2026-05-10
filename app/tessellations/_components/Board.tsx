"use client";

import { useRef, useState } from "react";
import type { ShapeDefinition } from "../_lib/types";
import { generatePattern, getTileSize } from "../_lib/pattern-generator";

interface BoardProps {
  shape: ShapeDefinition;
  showPreview: boolean;
}

function renderShapeElement(
  shape: ShapeDefinition,
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number,
  flip: number = 0,
): React.ReactNode {
  if (shape.svgElement === "circle" && shape.circleRadius != null) {
    const cx = x + tileWidth / 2;
    const cy = y + tileHeight / 2;
    const r = Math.min(tileWidth, tileHeight) * shape.circleRadius;
    return (
      <circle key={`${x}-${y}`} cx={cx} cy={cy} r={r} fill={shape.color} />
    );
  }

  if (shape.svgElement === "polygon" && shape.polygonPoints) {
    const points = shape.polygonPoints
      .split(" ")
      .map((p) => {
        const [px, py] = p.split(",").map(Number);
        const newX = x + px * tileWidth;
        const newY =
          flip === 1
            ? y + tileHeight - py * tileHeight
            : y + py * tileHeight;
        return `${newX},${newY}`;
      })
      .join(" ");

    return (
      <polygon
        key={`${x}-${y}`}
        points={points}
        fill={shape.color}
        stroke="#fff"
        strokeWidth={0.5}
      />
    );
  }

  return null;
}

export function Board({ shape, showPreview }: BoardProps) {
  const boardSize = 100;
  const pattern = generatePattern(shape, boardSize);
  const tileSize = getTileSize(shape, boardSize);

  const svgRef = useRef<SVGSVGElement>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({
    x: 30,
    y: 30,
  });
  const isDragging = useRef(false);

  function onPointerDown(e: React.PointerEvent): void {
    if (showPreview) return;
    e.preventDefault();
    isDragging.current = true;
    svgRef.current?.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent): void {
    if (!isDragging.current || showPreview) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * boardSize;
    const y = ((e.clientY - rect.top) / rect.height) * boardSize;
    setDragPos({ x: x - tileSize.width / 2, y: y - tileSize.height / 2 });
  }

  function onPointerUp(): void {
    isDragging.current = false;
  }

  function onPointerCancel(): void {
    isDragging.current = false;
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="w-full max-w-[400px] aspect-square">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${boardSize} ${boardSize}`}
          className="w-full h-full rounded-2xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          style={{ touchAction: "none" }}
        >
          {/* Preview pattern */}
          {showPreview && pattern.length > 0 &&
            pattern.map((pos) =>
              renderShapeElement(
                shape,
                pos.x,
                pos.y,
                tileSize.width,
                tileSize.height,
                pos.flip,
              ),
            )}

          {/* Single draggable shape */}
          {!showPreview && (
            <g style={{ cursor: "grab", touchAction: "none" }}>
              {renderShapeElement(
                shape,
                dragPos.x,
                dragPos.y,
                tileSize.width,
                tileSize.height,
                0,
              )}
            </g>
          )}

          {/* Non-tessellating preview message */}
          {showPreview && shape.tessellatesByItself === false && (
            <text
              x={boardSize / 2}
              y={boardSize / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-500 dark:fill-slate-400 text-[4px] font-medium"
            >
              This shape does not repeat cleanly — gaps always appear.
            </text>
          )}
        </svg>
      </div>
      {!showPreview && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Drag the shape around the board
        </p>
      )}
    </div>
  );
}
