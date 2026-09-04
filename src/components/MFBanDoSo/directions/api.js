import { buildApiUrl } from '../shared/api';
import { DIRECTIONS_DEFAULT_MODE, DIRECTIONS_MODES } from './constants';

// Routing sits behind its own service and its own key, unlike the rest of the
// gateway's endpoints.
const ROUTE_URL_PATH = 'bds-sdk/sdk/route';
const SUGGEST_URL_PATH = 'bds-sdk/sdk/autosuggest';
const SDK_API_KEY = '5c643df61c0356baecdc81a4b4aca826';
const ROUTE_LANGUAGE = 'vi';

/**
 * An unknown mode is answered with `invalid_model` rather than a route, so the
 * value is checked here instead of being passed straight through.
 */
function resolveMode(mode) {
  return DIRECTIONS_MODES.some((item) => item.key === mode)
    ? mode
    : DIRECTIONS_DEFAULT_MODE;
}

function getRouteUrl(isStaging, origin, destination, mode) {
  if (!origin || !destination) {
    return null;
  }

  const from = `${origin.latitude},${origin.longitude}`;
  const to = `${destination.latitude},${destination.longitude}`;
  const query = [
    `origin=${encodeURIComponent(from)}`,
    `destination=${encodeURIComponent(to)}`,
    `language=${ROUTE_LANGUAGE}`,
    `mode=${resolveMode(mode)}`,
    `key=${SDK_API_KEY}`,
  ].join('&');

  return `${buildApiUrl(ROUTE_URL_PATH, isStaging)}?${query}`;
}

/**
 * Place suggestions for what is typed into an endpoint. `location` only biases
 * the ranking — the endpoint answers without it — so a map that has not
 * reported a camera yet still gets suggestions, just not nearest-first.
 */
function getSuggestUrl(isStaging, text, location) {
  const query = [`text=${encodeURIComponent(text)}`, `key=${SDK_API_KEY}`];

  if (location) {
    const at = `${location.latitude},${location.longitude}`;
    query.push(`location=${encodeURIComponent(at)}`);
  }

  return `${buildApiUrl(SUGGEST_URL_PATH, isStaging)}?${query.join('&')}`;
}

export { getRouteUrl, getSuggestUrl };
