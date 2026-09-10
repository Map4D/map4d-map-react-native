import { buildApiUrl } from '../shared/api';
import { ZONE_PROJECT_KINDS } from './constants';

const PROVINCE_INVESTMENT_INFO_URL_PATH =
  'api/portal/ProvinceInvestmentInfo/reverse';
const ZONE_DETAIL_URL_PATH = 'api/portal/kcnkkt';
// Connectivity features are served from the bds service directly rather than
// its portal cut, but the endpoint is public all the same.
const INFRA_DETAIL_URL_PATH = 'api/HaTangKetNoiDT';

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

function getInfraDetailUrl(isStaging, id) {
  const base = buildApiUrl(INFRA_DETAIL_URL_PATH, isStaging);
  return `${base}/${encodeURIComponent(id)}`;
}

export {
  getInfraDetailUrl,
  getProvinceInvestmentInfoUrl,
  getZoneDetailUrl,
  getZoneProjectsUrl,
};
