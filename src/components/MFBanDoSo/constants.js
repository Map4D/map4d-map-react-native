const SELECTOR_DRAWER_TRANSLATE_X = -320;
const SELECTOR_OPEN_DURATION_MS = 240;
const SELECTOR_CLOSE_DURATION_MS = 210;
const SELECTOR_TITLE = 'Chọn lớp dữ liệu trên bản đồ';
const LEGEND_TITLE = 'Chú giải';

const API_HOST = 'https://cmcdtqg-gateway.dieuhanhso.vn';
const SOURCE_URL_PATH = 'bds/api/tile/vector/{z}/{x}/{y}.pbf?p=1';
const CATEGORY_CONFIG_URL_PATH = 'bds/api/BanDo/dau-tu/category-config';

function buildApiUrl(path, isStaging) {
  const stagingSegment = isStaging ? '/staging' : '';
  return `${API_HOST}${stagingSegment}/${path}`;
}

function getSourceUrl(isStaging) {
  return buildApiUrl(SOURCE_URL_PATH, isStaging);
}

function getCategoryConfigUrl(isStaging) {
  return buildApiUrl(CATEGORY_CONFIG_URL_PATH, isStaging);
}

export {
  SELECTOR_DRAWER_TRANSLATE_X,
  SELECTOR_OPEN_DURATION_MS,
  SELECTOR_CLOSE_DURATION_MS,
  SELECTOR_TITLE,
  LEGEND_TITLE,
  getSourceUrl,
  getCategoryConfigUrl,
};
