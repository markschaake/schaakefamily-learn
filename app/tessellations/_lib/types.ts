export interface PlacedShape {
  id: string;
  shapeId: string;
  x: number;
  y: number;
  rotation: number;
}

export interface ShapeDefinition {
  id: string;
  name: string;
  emoji: string;
  color: string;
  /** SVG element type to render. */
  svgElement: "polygon" | "circle";
  /** Normalized geometry in 0–1 space. */
  polygonPoints?: string;
  circleRadius?: number;
  /** Whether this shape can tessellate the plane by itself. */
  tessellatesByItself: boolean;
  /** Kid-readable explanation of tessellation behavior. */
  explanation: string;
  /** Snap angle in degrees — 0 for shapes where rotation doesn't matter. */
  snapAngle: number;
  /** Default tile grid size (in board units) for this shape. */
  tileSize: { w: number; h: number };
}
