"use client";

import { useCallback, useRef } from "react";
import type { PlacedShape, ShapeDefinition } from "../_lib/types";
import { generatePattern } from "../_lib/pattern-generator";

interface BoardProps {
  shape: ShapeDefinition;
  placedShapes: PlacedShape[];
  selectedId: string | null;
  showHint: boolean;
  onMoveShape: (id: string, x: number, y: number) => void;
  onRotateShape: (id: string) => void;
  onDeleteShape: (id: string) => void;
  onSelectShape: (id: string | null) => void;
}

// ── geometry helpers ─────────────────────────────────────────────────

function polygonVertices(
  pointsStr: string,
  w: number,
  h: number,
): [number, number][] {
  return pointsStr.split(" ").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return [x * w, y * h];
  });
}

function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  deg: number,
): [number, number] {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
}

function worldVertices(
  pointsStr: string,
  w: number,
  h: number,
  ox: number,
  oy: number,
  rotation: number,
): [number, number][] {
  const verts = polygonVertices(pointsStr, w, h);
  const cx = ox + w / 2;
  const cy = oy + h / 2;
  return verts.map(([v, ht]) => rotatePoint(v + ox, ht + oy, cx, cy, rotation));
}

function edgeAngle(ax: number, ay: number, bx: number, by: number): number {
  return Math.atan2(by - ay, bx - ax) * (180 / Math.PI);
}

function angleDiff(a: number, b: number): number {
  const d = ((a - b + 540) % 360) - 180;
  return d < -180 ? d + 360 : d;
}

function boundingBox(verts: [number, number][]) {
  let xMin = Infinity,
    xMax = -Infinity,
    yMin = Infinity,
    yMax = -Infinity;
  for (const [x, y] of verts) {
    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  }
  return { xMin, xMax, yMin, yMax };
}

function bboxesOverlap(
  a: ReturnType<typeof boundingBox>,
  b: ReturnType<typeof boundingBox>,
  pad: number,
): boolean {
  return (
    a.xMax + pad >= b.xMin &&
    a.xMin - pad <= b.xMax &&
    a.yMax + pad >= b.yMin &&
    a.yMin - pad <= b.yMax
  );
}

// ── snap-to-edge logic ───────────────────────────────────────────────

function computeSnap(
  target: PlacedShape,
  others: PlacedShape[],
  shape: ShapeDefinition,
): { x: number; y: number } | null {
  if (!shape.polygonPoints || shape.svgElement === "circle") return null;

  const { w, h } = shape.tileSize;
  const verts = worldVertices(
    shape.polygonPoints,
    w,
    h,
    target.x,
    target.y,
    target.rotation,
  );
  const tBb = boundingBox(verts);
  const tCenterX = tBb.xMin + (tBb.xMax - tBb.xMin) / 2;
  const tCenterY = tBb.yMin + (tBb.yMax - tBb.yMin) / 2;
  const SNAP = 16;

  // Minimum perpendicular distance between centers to avoid overlap.
  // If centers are closer than this, snapping would overlap the shapes.
  const MIN_PERP = Math.min(w, h) * 0.35;

  let bestDist = Infinity;
  let bestSnap: { x: number; y: number } | null = null;

  for (const other of others) {
    if (other.id === target.id || other.shapeId !== target.shapeId) continue;

    const oVerts = worldVertices(
      shape.polygonPoints,
      w,
      h,
      other.x,
      other.y,
      other.rotation,
    );
    const oBb = boundingBox(oVerts);

    if (!bboxesOverlap(tBb, oBb, SNAP * 2)) continue;

    // Check every edge pair for parallel or anti-parallel alignment
    for (let ei = 0; ei < oVerts.length; ei++) {
      const ej = (ei + 1) % oVerts.length;
      const [oax, oay] = oVerts[ei];
      const [obx, oby] = oVerts[ej];
      const oAngle = edgeAngle(oax, oay, obx, oby);
      const oMidX = (oax + obx) / 2;
      const oMidY = (oay + oby) / 2;

      for (let ti = 0; ti < verts.length; ti++) {
        const tj = (ti + 1) % verts.length;
        const [tax, tay] = verts[ti];
        const [tbx, tby] = verts[tj];
        const tAngle = edgeAngle(tax, tay, tbx, tby);

        const ad = Math.abs(angleDiff(oAngle, tAngle));
        // Accept parallel (≈0°) or anti-parallel (≈180°) edges
        if (ad > 10 && ad < 170) continue;

        const tMidX = (tax + tbx) / 2;
        const tMidY = (tay + tby) / 2;
        const dist = Math.hypot(oMidX - tMidX, oMidY - tMidY);
        if (dist > SNAP) continue;

        // Check perpendicular offset (midpoints should align along the edge)
        const perpRad = ((oAngle + 90) * Math.PI) / 180;
        const perpDiff = Math.abs(
          (oMidX - tMidX) * Math.cos(perpRad) +
            (oMidY - tMidY) * Math.sin(perpRad),
        );
        if (perpDiff > SNAP * 0.6) continue;

        // Overlap guard: snap the shape and verify centers are on opposite
        // sides of the shared edge (i.e. shapes don't overlap).
        const dx = oMidX - tMidX;
        const dy = oMidY - tMidY;
        const snappedX = target.x + dx;
        const snappedY = target.y + dy;

        // Compute snapped shape center
        const snappedVerts = worldVertices(
          shape.polygonPoints,
          w,
          h,
          snappedX,
          snappedY,
          target.rotation,
        );
        const sBb = boundingBox(snappedVerts);
        const sCenterX = sBb.xMin + (sBb.xMax - sBb.xMin) / 2;
        const sCenterY = sBb.yMin + (sBb.yMax - sBb.yMin) / 2;
        const oCenterX = oBb.xMin + (oBb.xMax - oBb.xMin) / 2;
        const oCenterY = oBb.yMin + (oBb.yMax - oBb.yMin) / 2;

        // Project the center-to-center vector onto the edge normal.
        // If the perpendicular separation is too small, shapes overlap.
        const centerPerp = Math.abs(
          (sCenterX - oCenterX) * Math.cos(perpRad) +
            (sCenterY - oCenterY) * Math.sin(perpRad),
        );
        if (centerPerp < MIN_PERP) continue;

        if (dist < bestDist) {
          bestDist = dist;
          bestSnap = { x: snappedX, y: snappedY };
        }
      }
    }
  }

  return bestSnap;
}

// ── shape renderer ───────────────────────────────────────────────────

function ShapeOnBoard({
  shape,
  placed,
  isSelected,
  onPointerDown,
  onRotate,
  onDelete,
}: {
  shape: ShapeDefinition;
  placed: PlacedShape;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onRotate: () => void;
  onDelete: () => void;
}) {
  const { w, h } = shape.tileSize;
  const transform = `translate(${placed.x} ${placed.y}) rotate(${placed.rotation} ${w / 2} ${h / 2})`;

  const geo =
    shape.svgElement === "polygon" && shape.polygonPoints ? (
      <polygon
        points={shape.polygonPoints.split(" ").map((p) => {
          const [x, y] = p.split(",").map(Number);
          return `${x * w},${y * h}`;
        }).join(" ")}
        fill={shape.color}
        fillOpacity={0.8}
        stroke={isSelected ? "#4f46e5" : "rgba(255,255,255,0.9)"}
        strokeWidth={isSelected ? 1.2 : 0.7}
        strokeLinejoin="round"
      />
    ) : shape.svgElement === "circle" && shape.circleRadius != null ? (
      <circle
        cx={w / 2}
        cy={h / 2}
        r={Math.min(w, h) * shape.circleRadius}
        fill={shape.color}
        fillOpacity={0.8}
        stroke={isSelected ? "#4f46e5" : "rgba(255,255,255,0.9)"}
        strokeWidth={isSelected ? 1.2 : 0.7}
      />
    ) : null;

  return (
    <g transform={transform}>
      {/* Shape body */}
      <g style={{ cursor: "grab", touchAction: "none" }} onPointerDown={onPointerDown}>
        {geo}
      </g>

      {/* Selection ring */}
      {isSelected && (
        <rect
          x={-2.5}
          y={-2.5}
          width={w + 5}
          height={h + 5}
          rx={3}
          fill="none"
          stroke="#6366f1"
          strokeWidth={1.2}
          strokeDasharray="4 2"
          opacity={0.8}
          style={{ pointerEvents: "none", userSelect: "none" }}
        />
      )}

      {/* Action buttons (appear on selection) */}
      {isSelected && (
        <g style={{ cursor: "pointer" }}>
          {/* Rotate button */}
          <circle
            cx={w / 2}
            cy={-5}
            r={4}
            fill="#6366f1"
            stroke="#fff"
            strokeWidth={0.8}
            onClick={onRotate}
          >
            <title>Rotate</title>
          </circle>
          <text
            x={w / 2}
            y={-5}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fff"
            fontSize={3}
            fontWeight="bold"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            ↻
          </text>

          {/* Delete button */}
          <circle
            cx={w + 3}
            cy={-3}
            r={3.5}
            fill="#ef4444"
            stroke="#fff"
            strokeWidth={0.8}
            onClick={onDelete}
          >
            <title>Delete</title>
          </circle>
          <text
            x={w + 3}
            y={-3}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fff"
            fontSize={2.8}
            fontWeight="bold"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            ✕
          </text>
        </g>
      )}
    </g>
  );
}

// ── board ────────────────────────────────────────────────────────────

export function Board({
  shape,
  placedShapes,
  selectedId,
  showHint,
  onMoveShape,
  onRotateShape,
  onDeleteShape,
  onSelectShape,
}: BoardProps) {
  const boardSize = 100;
  const svgRef = useRef<SVGSVGElement>(null);
  const pattern = showHint ? generatePattern(shape, boardSize) : [];

  const dragRef = useRef<{
    id: string;
    startPtrX: number;
    startPtrY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const boardPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Click on empty board background → deselect
      if (
        e.target === svgRef.current ||
        (e.target as SVGElement).tagName === "rect"
      ) {
        onSelectShape(null);
      }
    },
    [onSelectShape],
  );

  const handlePointerDown = useCallback(
    (id: string) => (e: React.PointerEvent) => {
      if (showHint) return;
      e.stopPropagation();
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const ptrX = ((e.clientX - rect.left) / rect.width) * boardSize;
      const ptrY = ((e.clientY - rect.top) / rect.height) * boardSize;
      const ps = placedShapes.find((s) => s.id === id);
      if (!ps) return;

      svg.setPointerCapture(e.pointerId);
      dragRef.current = {
        id,
        startPtrX: ptrX,
        startPtrY: ptrY,
        startX: ps.x,
        startY: ps.y,
        moved: false,
      };

      onSelectShape(id);
    },
    [placedShapes, showHint, onSelectShape, boardSize],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current || showHint) return;
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const ptrX = ((e.clientX - rect.left) / rect.width) * boardSize;
      const ptrY = ((e.clientY - rect.top) / rect.height) * boardSize;

      const dx = ptrX - dragRef.current.startPtrX;
      const dy = ptrY - dragRef.current.startPtrY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        dragRef.current.moved = true;
      }

      onMoveShape(
        dragRef.current.id,
        dragRef.current.startX + dx,
        dragRef.current.startY + dy,
      );
    },
    [onMoveShape, showHint, boardSize],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const { id, moved } = dragRef.current;
      dragRef.current = null;

      const svg = svgRef.current;
      if (svg) svg.releasePointerCapture(e.pointerId);

      if (moved) {
        const ps = placedShapes.find((s) => s.id === id);
        if (!ps) return;
        const snap = computeSnap(ps, placedShapes, shape);
        if (snap) {
          onMoveShape(id, snap.x, snap.y);
        }
      }
    },
    [placedShapes, shape, onMoveShape],
  );

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="w-full max-w-[480px] aspect-square">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${boardSize} ${boardSize}`}
          className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 ring-1 ring-slate-200 dark:ring-slate-700"
          onPointerDown={boardPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          {/* Dot grid */}
          <defs>
            <pattern id="tess-grid" width={10} height={10} patternUnits="userSpaceOnUse">
              <circle cx={10} cy={10} r={0.3} className="fill-slate-200 dark:fill-slate-600" />
            </pattern>
          </defs>
          <rect width={boardSize} height={boardSize} fill="url(#tess-grid)" />

          {/* Hint pattern */}
          {showHint &&
            pattern.map((tile, i) => {
              const tW = shape.tileSize.w;
              const tH = shape.tileSize.h;
              const t = `translate(${tile.x} ${tile.y}) rotate(${tile.rotation} ${tW / 2} ${tH / 2})`;
              return (
                <g key={i} transform={t} opacity={0.3}>
                  {shape.svgElement === "polygon" && shape.polygonPoints ? (
                    <polygon
                      points={shape.polygonPoints.split(" ").map((p) => {
                        const [x, y] = p.split(",").map(Number);
                        return `${x * tW},${y * tH}`;
                      }).join(" ")}
                      fill={shape.color}
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth={0.5}
                    />
                  ) : shape.svgElement === "circle" && shape.circleRadius != null ? (
                    <circle
                      cx={tW / 2}
                      cy={tH / 2}
                      r={Math.min(tW, tH) * shape.circleRadius}
                      fill={shape.color}
                    />
                  ) : null}
                </g>
              );
            })}

          {/* Placed shapes */}
          {!showHint &&
            placedShapes.map((ps) => (
              <ShapeOnBoard
                key={ps.id}
                shape={shape}
                placed={ps}
                isSelected={ps.id === selectedId}
                onPointerDown={handlePointerDown(ps.id)}
                onRotate={() => {
                  onRotateShape(ps.id);
                }}
                onDelete={() => {
                  onDeleteShape(ps.id);
                  onSelectShape(null);
                }}
              />
            ))}

          {/* Empty state */}
          {!showHint && placedShapes.length === 0 && (
            <g>
              <text
                x={boardSize / 2}
                y={boardSize / 2 - 3}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-700 dark:fill-slate-200 text-[5px] font-semibold"
              >
                Add shapes to start
              </text>
              <text
                x={boardSize / 2}
                y={boardSize / 2 + 4}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-700 dark:fill-slate-200 text-[3.5px]"
              >
                Tap the + Add shape button below
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
