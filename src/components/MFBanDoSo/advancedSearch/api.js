import { buildApiUrl } from '../shared/api';
import { ADVANCED_PAGE_SIZE } from './constants';

const ZONE_SEARCH_URL_PATH = 'bds/api/portal/TimKiem/nang-cao';
const INFRA_SEARCH_URL_PATH = 'bds/api/portal/TimKiem/ha-tang-ket-noi/nang-cao';
const ZONE_TYPE_URL_PATH = 'bds/api/portal/kcnkkt/danh-sach-loai';
// Form types are listed per zone type and numbered from one within each, so an
// id only means anything alongside the zone type it was listed under.
const ZONE_FORM_TYPE_URL_PATH = 'bds/api/kcnkkt/danh-sach-loai-hinh';
const INFRA_TYPE_URL_PATH =
  'bds/api/portal/danh-muc/HaTangKetNoi/lay-danh-sach-chon';
const INFRA_LAYER_URL_PATH =
  'bds/api/portal/Lop/HaTangKetNoi/lay-danh-sach-chon';
// The place dictionaries sit outside the bds service, under the shared admin
// one, and are the public cut of it.
const PROVINCE_URL_PATH =
  'admin/api/TinhXaPhuongCongKhai/lay-danh-sach-chon-tinh-cong-khai';
const WARD_URL_PATH =
  'admin/api/TinhXaPhuongCongKhai/lay-danh-sach-chon-xa-cong-khai';

/**
 * The endpoint reads its filters off a nested `Query` object, which it expects
 * flattened into `Query.Field` parameters. Anything left unset is left out
 * entirely rather than sent empty, which the endpoint treats as a filter.
 */
function buildSearchQuery(page, entries) {
  const params = [`Page=${page}`, `PageSize=${ADVANCED_PAGE_SIZE}`];

  entries.forEach(([name, value]) => {
    if (typeof value === 'string') {
      const keyword = value.trim();
      if (keyword.length > 0) {
        params.push(`${name}=${encodeURIComponent(keyword)}`);
      }
      return;
    }

    if (Number.isFinite(value)) {
      params.push(`${name}=${value}`);
    }
  });

  return params.join('&');
}

function getAdvancedZoneSearchUrl(isStaging, filters, page) {
  const query = buildSearchQuery(page, [
    ['Keyword', filters?.keyword],
    ['Query.LoaiKhuId', filters?.zoneTypeId],
    ['Query.LoaiHinhId', filters?.formTypeId],
    ['Query.TinhTrang', filters?.status],
    ['Query.TinhThanhId', filters?.provinceId],
    ['Query.XaPhuongId', filters?.wardId],
  ]);

  return `${buildApiUrl(ZONE_SEARCH_URL_PATH, isStaging)}?${query}`;
}

function getAdvancedInfraSearchUrl(isStaging, filters, page) {
  const query = buildSearchQuery(page, [
    ['Keyword', filters?.keyword],
    ['Query.LoaiHaTang', filters?.infraTypeId],
    ['Query.LopId', filters?.infraLayerId],
  ]);

  return `${buildApiUrl(INFRA_SEARCH_URL_PATH, isStaging)}?${query}`;
}

function getZoneTypeOptionsUrl(isStaging) {
  return buildApiUrl(ZONE_TYPE_URL_PATH, isStaging);
}

function getZoneFormTypeOptionsUrl(isStaging, zoneTypeId) {
  const base = buildApiUrl(ZONE_FORM_TYPE_URL_PATH, isStaging);
  return `${base}?loaiKhu=${encodeURIComponent(zoneTypeId)}`;
}

function getInfraTypeOptionsUrl(isStaging) {
  return buildApiUrl(INFRA_TYPE_URL_PATH, isStaging);
}

function getInfraLayerOptionsUrl(isStaging) {
  return buildApiUrl(INFRA_LAYER_URL_PATH, isStaging);
}

function getProvinceOptionsUrl(isStaging) {
  return buildApiUrl(PROVINCE_URL_PATH, isStaging);
}

function getWardOptionsUrl(isStaging, provinceId) {
  const base = buildApiUrl(WARD_URL_PATH, isStaging);
  return `${base}?Query.TinhThanhId=${encodeURIComponent(provinceId)}`;
}

export {
  getAdvancedInfraSearchUrl,
  getAdvancedZoneSearchUrl,
  getInfraLayerOptionsUrl,
  getInfraTypeOptionsUrl,
  getProvinceOptionsUrl,
  getWardOptionsUrl,
  getZoneFormTypeOptionsUrl,
  getZoneTypeOptionsUrl,
};
