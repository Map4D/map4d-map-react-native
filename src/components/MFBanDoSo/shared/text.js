/**
 * Reading helpers for the API payloads. Every endpoint answers with loosely
 * typed JSON — a field may be missing, null, an empty string or a number where
 * a string was expected — so each feature's mapper leans on these rather than
 * repeating the same guards.
 */

/**
 * The first value that is a non-empty string, trimmed. Used to pick between
 * the several fields a payload may carry the same thing under.
 */
function firstNonEmptyString(values) {
  const found = (Array.isArray(values) ? values : []).find(
    (value) => typeof value === 'string' && value.trim().length > 0
  );

  return found ? found.trim() : null;
}

/** A finite number, or null for anything that does not convert to one. */
function toFiniteNumber(value) {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export { firstNonEmptyString, toFiniteNumber };
