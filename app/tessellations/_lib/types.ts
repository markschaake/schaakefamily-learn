export interface SingleShapePattern {
  columns: number;
  rows: number;
  /** If true, odd rows are shifted horizontally by half a tile width. */
  staggerRows?: boolean;
  /** If true, alternate rows are flipped vertically (for triangles). */
  flipAlternateRows?: boolean;
}

export interface Position {
  x: number;
  y: number;
  /** 0 = normal, 1 = flipped vertically */
  flip?: number;
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
  /** Pattern config for single-shape tiling (only for tessellating shapes). */
  singleShapePattern?: SingleShapePattern;
}
