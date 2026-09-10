import { buildApiUrl } from '../shared/api';

const SEARCH_URL_PATH = 'api/portal/TimKiem/auto';

function getSearchUrl(isStaging, keyword) {
  const base = buildApiUrl(SEARCH_URL_PATH, isStaging);
  return `${base}?keyword=${encodeURIComponent(keyword)}`;
}

export { getSearchUrl };
