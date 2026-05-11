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
    snapAngle: 15,
    tileSize: { w: 20, h: 20 },
  },
  {
    id: 'triangle',
    name: 'Triangle',
    emoji: '🔺',
    color: '#ef4444',
    svgElement: 'polygon',
    polygonPoints: '0.5,0 0,1 1,1',
    tessellatesByItself: true,
    explanation:
      'Equilateral triangles tile perfectly! Alternate rows flip upside-down to fill the plane with no gaps.',
    snapAngle: 15,
    tileSize: { w: 16.67, h: 20 },
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    emoji: '⬢',
    color: '#8b5cf6',
    svgElement: 'polygon',
    polygonPoints: '0.5,0 0.933,0.25 0.933,0.75 0.5,1 0.067,0.75 0.067,0.25',
    tessellatesByItself: true,
    explanation:
      'Regular hexagons tile perfectly like a honeycomb — no gaps, no overlaps!',
    snapAngle: 15,
    tileSize: { w: 33.33, h: 25 },
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    emoji: '⬠',
    color: '#f59e0b',
    svgElement: 'polygon',
    polygonPoints: '0.5,0.085 0.924,0.418 0.781,0.915 0.219,0.915 0.076,0.418',
    tessellatesByItself: false,
    explanation:
      'Regular pentagons cannot tile the plane by themselves — gaps always appear between them.',
    snapAngle: 90,
    tileSize: { w: 25, h: 25 },
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
      'Circles are round, so there will always be gaps between them — they cannot tessellate.',
    snapAngle: 0,
    tileSize: { w: 25, h: 25 },
  },
];

export function getShapeById(id: string): ShapeDefinition | undefined {
  return shapes.find((s) => s.id === id);
}
