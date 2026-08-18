// Both drawers slide in from the left and are dismissed the same way, so the
// travel distance and the gesture thresholds are shared rather than tuned per
// drawer — a legend that closed at a different flick speed than the layer list
// would read as a bug.
const DRAWER_TRANSLATE_X = -320;
const DRAWER_OPEN_DURATION_MS = 240;
const DRAWER_CLOSE_DURATION_MS = 210;
const DRAWER_SWIPE_ACTIVATION_DISTANCE = 10;
const DRAWER_SWIPE_CLOSE_DISTANCE = 80;
const DRAWER_SWIPE_CLOSE_VELOCITY = 0.5;

// Geometry of the round map buttons. They appear in two places — beside the
// search bar and stacked under it — and the gap has to read as the same one
// throughout, so every position is derived from these rather than written out.
const MAP_BUTTON_SIZE = 42;
const MAP_BUTTON_GAP = 8;
const MAP_BUTTON_PITCH = MAP_BUTTON_SIZE + MAP_BUTTON_GAP;
// The search bar the stack hangs below.
const SEARCH_BAR_TOP = 12;
const SEARCH_BAR_HEIGHT = 46;
// A button is shorter than the bar, so it is centred against it.
const MAP_BUTTON_BAR_OFFSET = (SEARCH_BAR_HEIGHT - MAP_BUTTON_SIZE) / 2;
// First slot of the stack: one whole pitch below the button beside the bar.
const MAP_BUTTON_STACK_TOP =
  SEARCH_BAR_TOP + MAP_BUTTON_BAR_OFFSET + MAP_BUTTON_PITCH;

export {
  MAP_BUTTON_BAR_OFFSET,
  MAP_BUTTON_GAP,
  MAP_BUTTON_PITCH,
  MAP_BUTTON_SIZE,
  MAP_BUTTON_STACK_TOP,
  SEARCH_BAR_HEIGHT,
  SEARCH_BAR_TOP,
  DRAWER_TRANSLATE_X,
  DRAWER_OPEN_DURATION_MS,
  DRAWER_CLOSE_DURATION_MS,
  DRAWER_SWIPE_ACTIVATION_DISTANCE,
  DRAWER_SWIPE_CLOSE_DISTANCE,
  DRAWER_SWIPE_CLOSE_VELOCITY,
};
