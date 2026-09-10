/**
 * Everything the component fetches goes through one gateway, which serves a
 * staging copy of every endpoint under an extra path segment. Each feature
 * builds its own URLs on top of this, so the host and that segment are decided
 * in a single place.
 */
const DEFAULT_API_HOST = 'https://kong-cdtmc-devtest.mbfs.vn';

let currentApiHost = DEFAULT_API_HOST;

function configureMFBanDoSo({ apiHost } = {}) {
  if (typeof apiHost === 'string' && apiHost.length > 0) {
    currentApiHost = apiHost.replace(/\/+$/, '');
  }
}

function buildApiUrl(path, isStaging) {
  const stagingSegment = isStaging ? '/staging' : '';
  return `${currentApiHost}${stagingSegment}/bds/${path}`;
}

function buildGatewayUrl(path, isStaging) {
  const stagingSegment = isStaging ? '/staging' : '';
  return `${currentApiHost}${stagingSegment}/${path}`;
}

/**
 * Every call wants the parsed body, and a failed status to raise rather than
 * return. `what` names the thing being fetched so the warning that reaches the
 * console says which request failed, not merely that one did.
 */
async function fetchJson(url, what) {
  const response = await fetch(url);
  if (!response.ok) {
    const subject = what ? `Failed to fetch ${what}` : 'Request failed';
    throw new Error(`${subject}: ${response.status}`);
  }

  return response.json();
}

export { buildApiUrl, buildGatewayUrl, configureMFBanDoSo, fetchJson };
