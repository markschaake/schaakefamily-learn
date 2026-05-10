import type { ShapeDefinition, Position } from './types';

/**
 * Generate a deterministic grid of positions for a shape on the board.
 * Board uses a 100×100 viewBox.
 * Returns an empty array for non-tessellating shapes.
 */
export function generatePattern(
  shape: ShapeDefinition,
  boardSize = 100,
): Position[] {
  const pattern = shape.singleShapePattern;
  if (!pattern || !shape.tessellatesByItself) {
    return [];
  }

  const positions: Position[] = [];
  const tileWidth = boardSize / pattern.columns;
  const tileHeight = boardSize / pattern.rows;

  for (let row = 0; row < pattern.rows; row++) {
    for (let col = 0; col < pattern.columns; col++) {
      const staggerOffset =
        pattern.staggerRows && row % 2 === 1 ? tileWidth * 0.5 : 0;
      const x = col * tileWidth + staggerOffset;
      const y = row * tileHeight;
      const flip =
        pattern.flipAlternateRows && row % 2 === 1 ? 1 : 0;

      positions.push({ x, y, flip });
    }
  }

  return positions;
}

/**
 * Compute the tile size (in board units) for a shape's pattern.
 * Used to scale individual shape instances.
 */
export function getTileSize(
  shape: ShapeDefinition,
  boardSize = 100,
): { width: number; height: number } {
  const pattern = shape.singleShapePattern;
  if (pattern) {
    return {
      width: boardSize / pattern.columns,
      height: boardSize / pattern.rows,
    };
  }
  // Default comfortable size for single-shape drag mode
  return { width: 20, height: 20 };
}
