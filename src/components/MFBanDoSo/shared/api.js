/**
 * Everything the component fetches goes through one gateway, which serves a
 * staging copy of every endpoint under an extra path segment. Each feature
 * builds its own URLs on top of this, so the host and that segment are decided
 * in a single place.
 */
const API_HOST = 'https://cmcdtqg-gateway.dieuhanhso.vn';

function buildApiUrl(path, isStaging) {
  const stagingSegment = isStaging ? '/staging' : '';
  return `${API_HOST}${stagingSegment}/${path}`;
}

export { buildApiUrl };
