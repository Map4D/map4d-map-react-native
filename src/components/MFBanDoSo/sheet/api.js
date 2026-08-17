import { buildApiUrl } from '../shared/api';
import { ZONE_PROJECT_KINDS } from './constants';

const PROVINCE_INVESTMENT_INFO_URL_PATH =
  'bds/api/portal/ProvinceInvestmentInfo/reverse';
const ZONE_DETAIL_URL_PATH = 'bds/api/portal/kcnkkt';

function getProvinceInvestmentInfoUrl(isStaging, latitude, longitude) {
  const query = `latitude=${encodeURIComponent(
    latitude
  )}&longitude=${encodeURIComponent(longitude)}`;
  return `${buildApiUrl(
    PROVINCE_INVESTMENT_INFO_URL_PATH,
    isStaging
  )}?${query}`;
}

function getZoneDetailUrl(isStaging, id) {
  const base = buildApiUrl(ZONE_DETAIL_URL_PATH, isStaging);
  return `${base}/${encodeURIComponent(id)}`;
}

function getZoneProjectsUrl(isStaging, id, kind) {
  const config = ZONE_PROJECT_KINDS[kind];
  if (!config) {
    return null;
  }

  return `${getZoneDetailUrl(isStaging, id)}/${config.urlSuffix}`;
}

export { getProvinceInvestmentInfoUrl, getZoneDetailUrl, getZoneProjectsUrl };
