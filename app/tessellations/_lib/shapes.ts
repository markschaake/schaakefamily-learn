import type { ShapeDefinition } from './types';

export const shapes: ShapeDefinition[] = [
  {
    id: 'square',
    name: 'Square',
    emoji: '🟦',
    color: '#3b82f6',
    svgElement: 'polygon',
    polygonPoints: '0,0 1,0 1,1 0,1',
    tessellatesByItself: true,
    explanation:
      'Squares tile perfectly! They fit edge-to-edge with no gaps or overlaps, filling the whole plane.',
    singleShapePattern: {
      columns: 5,
      rows: 5,
    },
  },
  {
    id: 'triangle',
    name: 'Triangle',
    emoji: '🔺',
    color: '#ef4444',
    svgElement: 'polygon',
    // Equilateral triangle in 0-1 space:
    // apex at top-center, base corners at bottom-left and bottom-right
    polygonPoints: '0.5,0 0,1 1,1',
    tessellatesByItself: true,
    explanation:
      'Equilateral triangles tile perfectly! They fit together in rows, with alternating rows flipped upside-down, filling the whole plane.',
    singleShapePattern: {
      columns: 6,
      rows: 6,
      staggerRows: false,
      flipAlternateRows: true,
    },
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    emoji: '⬢',
    color: '#8b5cf6',
    svgElement: 'polygon',
    // Regular hexagon in 0-1 space (pointy-top, centered at 0.5,0.5)
    // vertices at 60-degree intervals
    polygonPoints: '0.5,0 0.933,0.25 0.933,0.75 0.5,1 0.067,0.75 0.067,0.25',
    tessellatesByItself: true,
    explanation:
      'Regular hexagons tile perfectly! They fit together like a honeycomb with no gaps or overlaps, filling the whole plane.',
    singleShapePattern: {
      columns: 3,
      rows: 4,
      staggerRows: true,
    },
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    emoji: '⬠',
    color: '#f59e0b',
    svgElement: 'polygon',
    // Regular pentagon in 0-1 space (pointy-top, centered at 0.5,0.5)
    // Using approximate vertex positions for a regular pentagon
    polygonPoints: '0.5,0.085 0.924,0.418 0.781,0.915 0.219,0.915 0.076,0.418',
    tessellatesByItself: false,
    explanation:
      'This selected regular pentagon does not tessellate by itself in this app. No matter how you arrange identical regular pentagons, gaps always appear between them.',
  },
  {
    id: 'circle',
    name: 'Circle',
    emoji: '🔵',
    color: '#06b6d4',
    svgElement: 'circle',
    circleRadius: 0.5,
    tessellatesByItself: false,
    explanation:
      'This selected regular circle does not tessellate by itself in this app. Circles are round, so there will always be gaps between them when placed side by side.',
  },
];

export function getShapeById(id: string): ShapeDefinition | undefined {
  return shapes.find((s) => s.id === id);
}
