export type RepresentationMode = 'display' | 'input' | 'reveal';

export interface FractionProps {
  numerator: number;
  denominator: number;
  /**
   * In V1, `mode` is reserved for future differentiation (e.g., reveal-time emphasis);
   * only `NumberLine` currently branches on it.
   */
  mode?: RepresentationMode;
}

export interface NumberLineProps extends FractionProps {
  /**
   * Called when the user releases the slider on a tick (snapped).
   * Omit for passive (display/reveal) rendering.
   *
   * In `input` mode, the component ignores the `numerator` prop value for initial
   * positioning and initialises the knob at 0 (left end), since the user is
   * answering a fresh question.
   */
  onChange?: (value: { numerator: number; denominator: number }) => void;
}
