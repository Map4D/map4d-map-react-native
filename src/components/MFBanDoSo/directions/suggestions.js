import { firstNonEmptyString, toCoordinate } from '../shared/text';

/**
 * Maps the `/sdk/autosuggest` payload to the rows the endpoint list renders.
 *
 * Each suggestion already carries its own coordinate, so picking one needs no
 * second call to look the place up — which is why the rows can be handed
 * straight to the endpoint the way a tap on the map is.
 *
 * A suggestion with no coordinate is dropped rather than shown: it would look
 * like every other row and then route to nowhere.
 */
function resolveSuggestions(json) {
  const items = Array.isArray(json?.result) ? json.result : [];

  return items
    .map((item, index) => {
      const name = firstNonEmptyString([item?.name]);
      const coordinate = toCoordinate(item?.location);

      if (!name || !coordinate) {
        return null;
      }

      return {
        key: firstNonEmptyString([item?.id]) ?? `suggest-${index}`,
        name,
        // `oldAddress` is the pre-merger wording of the same place, kept as a
        // fallback for entries the new addressing has not reached yet.
        address: firstNonEmptyString([item?.address, item?.oldAddress]),
        coordinate,
      };
    })
    .filter((item) => item != null);
}

export { resolveSuggestions };
