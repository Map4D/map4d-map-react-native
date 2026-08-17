import { firstNonEmptyString, toFiniteNumber } from '../shared/text';

/**
 * `bbox` arrives as the GeoJSON ordering [minLng, minLat, maxLng, maxLat],
 * which is the opposite pairing of the `{latitude, longitude}` bounds the map
 * takes. Entries can also carry a null bbox.
 */
function normalizeBounds(bbox) {
  if (!Array.isArray(bbox) || bbox.length < 4) {
    return null;
  }

  const minLng = toFiniteNumber(bbox[0]);
  const minLat = toFiniteNumber(bbox[1]);
  const maxLng = toFiniteNumber(bbox[2]);
  const maxLat = toFiniteNumber(bbox[3]);

  if (minLng == null || minLat == null || maxLng == null || maxLat == null) {
    return null;
  }

  return { minLat, minLng, maxLat, maxLng };
}

function normalizePin(pin) {
  const coordinates = pin?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const longitude = toFiniteNumber(coordinates[0]);
  const latitude = toFiniteNumber(coordinates[1]);

  if (longitude == null || latitude == null) {
    return null;
  }

  return { latitude, longitude };
}

/**
 * Maps the `portal/TimKiem/auto` payload to the sections the suggestion list
 * renders. The payload is already grouped ("Tinh/Thanh pho", "Khu CN, KT");
 * groups that came back empty are dropped so the list shows no bare headers.
 */
function resolveSearchSections(json) {
  const groups = Array.isArray(json?.data) ? json.data : [];

  return groups
    .map((group, groupIndex) => {
      const title = firstNonEmptyString([group?.title]);
      const items = (Array.isArray(group?.data) ? group.data : [])
        .map((item, index) => {
          const name = firstNonEmptyString([item?.ten]);
          if (!name) {
            return null;
          }

          return {
            key: `${groupIndex}-${index}-${name}`,
            name,
            kind: firstNonEmptyString([item?.loai]),
            typeLabel: firstNonEmptyString([item?.tenLoai]) || title,
            bounds: normalizeBounds(item?.bbox),
            pin: normalizePin(item?.pin),
          };
        })
        .filter((item) => item != null);

      return { key: `${groupIndex}-${title}`, title, items };
    })
    .filter((group) => group.items.length > 0);
}

function countSearchResults(sections) {
  return (Array.isArray(sections) ? sections : []).reduce(
    (total, group) => total + group.items.length,
    0
  );
}

export { countSearchResults, resolveSearchSections };
