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

export {
  DRAWER_TRANSLATE_X,
  DRAWER_OPEN_DURATION_MS,
  DRAWER_CLOSE_DURATION_MS,
  DRAWER_SWIPE_ACTIVATION_DISTANCE,
  DRAWER_SWIPE_CLOSE_DISTANCE,
  DRAWER_SWIPE_CLOSE_VELOCITY,
};
