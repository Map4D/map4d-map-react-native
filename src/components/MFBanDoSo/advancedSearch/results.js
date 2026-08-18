import { firstNonEmptyString, toFiniteNumber } from '../shared/text';

/**
 * The dictionaries come in two shapes. The bds service answers with a list of
 * `{id, ten}`; the shared admin one answers with an id-to-name object, which
 * has no order of its own, so those are sorted by name.
 */
function resolveListOptions(json) {
  return (Array.isArray(json?.data) ? json.data : [])
    .map((entry) => {
      const value = toFiniteNumber(entry?.id);
      const label = firstNonEmptyString([entry?.ten]);

      return value != null && label ? { value, label } : null;
    })
    .filter((option) => option != null);
}

function resolveMapOptions(json) {
  const data = json?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return [];
  }

  return Object.entries(data)
    .map(([key, name]) => {
      const value = toFiniteNumber(key);
      const label = firstNonEmptyString([name]);

      return value != null && label ? { value, label } : null;
    })
    .filter((option) => option != null)
    .sort((a, b) => a.label.localeCompare(b.label, 'vi'));
}

/** Page counters, so the list knows whether asking for more is worth it. */
function resolvePaging(json, page) {
  const meta = json?.metaData;
  const total = toFiniteNumber(meta?.total) ?? 0;
  const totalPage = toFiniteNumber(meta?.totalPage) ?? 0;
  const current = toFiniteNumber(meta?.page) ?? page;

  return { total, page: current, hasMore: current < totalPage };
}

function normalizePin(pin) {
  const coordinates = pin?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const longitude = toFiniteNumber(coordinates[0]);
  const latitude = toFiniteNumber(coordinates[1]);

  return longitude == null || latitude == null ? null : { latitude, longitude };
}

/**
 * A zone hit carries the id its detail is addressed with, so picking one opens
 * the very same sheet a tap on the map would.
 */
function resolveZoneResults(json, page) {
  const items = (Array.isArray(json?.data) ? json.data : [])
    .map((entry, index) => {
      const id = toFiniteNumber(entry?.id);
      const name = firstNonEmptyString([entry?.ten]);

      if (id == null || !name) {
        return null;
      }

      return {
        key: `zone-${id}-${index}`,
        id,
        name,
        typeLabel: firstNonEmptyString([entry?.tenLoai]),
        statusLabel: firstNonEmptyString([entry?.tenTinhTrang]),
        pin: normalizePin(entry?.pin),
      };
    })
    .filter((item) => item != null);

  return { items, ...resolvePaging(json, page) };
}

/**
 * Connectivity features have no detail sheet of their own, so what a hit needs
 * to carry is where it sits, to move the map there.
 */
function resolveInfraResults(json, page) {
  const items = (Array.isArray(json?.data) ? json.data : [])
    .map((entry, index) => {
      const id = toFiniteNumber(entry?.id);
      const name = firstNonEmptyString([entry?.ten]);

      if (id == null || !name) {
        return null;
      }

      return {
        key: `infra-${id}-${index}`,
        id,
        name,
        typeLabel: firstNonEmptyString([entry?.tenLoaiHaTang]),
        statusLabel: firstNonEmptyString([entry?.tenLop]),
        pin: normalizePin(entry?.geometry),
      };
    })
    .filter((item) => item != null);

  return { items, ...resolvePaging(json, page) };
}

export {
  resolveInfraResults,
  resolveListOptions,
  resolveMapOptions,
  resolveZoneResults,
};
