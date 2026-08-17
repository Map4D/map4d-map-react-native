import {
  SHEET_FULL_SNAP_RATIO,
  SHEET_HALF_SNAP_RATIO,
  SHEET_SWIPE_FLICK_VELOCITY,
} from './constants';

/**
 * Anchors a drag may settle on. Closing is deliberately not one of them — the
 * sheet is dismissed only through its close button — so dragging down stops at
 * the smallest anchor instead of throwing the sheet away.
 */
function getSheetSnapAnchors() {
  return [SHEET_HALF_SNAP_RATIO, SHEET_FULL_SNAP_RATIO].sort((a, b) => a - b);
}

function clampSnapValue(value) {
  const anchors = getSheetSnapAnchors();
  return Math.max(anchors[0], Math.min(anchors[anchors.length - 1], value));
}

/**
 * Picks the anchor a released drag should settle on. A fast flick moves one
 * anchor in the flick direction regardless of distance travelled; a slow drag
 * settles on whichever anchor the panel ended up closest to.
 */
function resolveSheetSnapTarget(releasedValue, velocity, startValue) {
  const anchors = getSheetSnapAnchors();

  if (velocity > SHEET_SWIPE_FLICK_VELOCITY) {
    const lower = anchors.filter((anchor) => anchor < startValue - 0.001);
    return lower.length > 0 ? lower[lower.length - 1] : anchors[0];
  }

  if (velocity < -SHEET_SWIPE_FLICK_VELOCITY) {
    const higher = anchors.filter((anchor) => anchor > startValue + 0.001);
    return higher.length > 0 ? higher[0] : anchors[anchors.length - 1];
  }

  return anchors.reduce(
    (best, anchor) =>
      Math.abs(anchor - releasedValue) < Math.abs(best - releasedValue)
        ? anchor
        : best,
    anchors[0]
  );
}

export { clampSnapValue, resolveSheetSnapTarget };
