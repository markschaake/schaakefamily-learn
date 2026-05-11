import type { ShapeDefinition } from './types';

interface PatternTile {
  x: number;
  y: number;
  rotation: number;
}

/**
 * Generate a tessellation pattern for a shape on the 100×100 board.
 * Returns an empty array for non-tessellating shapes.
 */
export function generatePattern(
  shape: ShapeDefinition,
  boardSize = 100,
): PatternTile[] {
  if (!shape.tessellatesByItself) return [];

  const { w, h } = shape.tileSize;
  const tiles: PatternTile[] = [];

  for (let row = 0; row <= boardSize / h + 1; row++) {
    for (let col = -1; col <= boardSize / w + 1; col++) {
      const x = col * w;
      const y = row * h;

      if (shape.id === 'triangle') {
        // Alternate rows: flip (180°) and offset by half width
        const rotation = row % 2 === 0 ? 0 : 180;
        const offsetX = row % 2 === 0 ? 0 : w * 0.5;
        tiles.push({ x: x + offsetX, y, rotation });
      } else if (shape.id === 'hexagon') {
        // Stagger every other row
        const offsetX = row % 2 === 0 ? 0 : w * 0.5;
        tiles.push({ x: x + offsetX, y, rotation: 0 });
      } else {
        // Square — simple grid
        tiles.push({ x, y, rotation: 0 });
      }
    }
  }

  return tiles;
}
