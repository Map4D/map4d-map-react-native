import { buildApiUrl } from '../shared/api';

// Routing sits behind its own service and its own key, unlike the rest of the
// gateway's endpoints.
const ROUTE_URL_PATH = 'bds-sdk/sdk/route';
const ROUTE_API_KEY = '5c643df61c0356baecdc81a4b4aca826';
const ROUTE_MODE = 'car';
const ROUTE_LANGUAGE = 'vi';

function getRouteUrl(isStaging, origin, destination) {
  if (!origin || !destination) {
    return null;
  }

  const from = `${origin.latitude},${origin.longitude}`;
  const to = `${destination.latitude},${destination.longitude}`;
  const query = [
    `origin=${encodeURIComponent(from)}`,
    `destination=${encodeURIComponent(to)}`,
    `language=${ROUTE_LANGUAGE}`,
    `mode=${ROUTE_MODE}`,
    `key=${ROUTE_API_KEY}`,
  ].join('&');

  return `${buildApiUrl(ROUTE_URL_PATH, isStaging)}?${query}`;
}

export { getRouteUrl };
