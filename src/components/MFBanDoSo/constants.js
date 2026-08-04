const SELECTOR_DRAWER_TRANSLATE_X = -320;
const SELECTOR_OPEN_DURATION_MS = 240;
const SELECTOR_CLOSE_DURATION_MS = 210;
const SELECTOR_SWIPE_ACTIVATION_DISTANCE = 10;
const SELECTOR_SWIPE_CLOSE_DISTANCE = 80;
const SELECTOR_SWIPE_CLOSE_VELOCITY = 0.5;
const SELECTOR_TITLE = 'Chọn lớp dữ liệu trên bản đồ';
const LEGEND_TITLE = 'Chú giải';

// Strip of map left uncovered above the sheet, so the backdrop stays tappable
// and the sheet still reads as an overlay rather than a full screen.
const SHEET_TOP_PEEK = 0;
const SHEET_OPEN_DURATION_MS = 260;
const SHEET_CLOSE_DURATION_MS = 220;
const SHEET_TRANSLATE_Y = 720;
const SHEET_SWIPE_ACTIVATION_DISTANCE = 10;
// A flick faster than this jumps to the neighbouring anchor instead of snapping
// back to whichever anchor the panel happens to sit closest to.
const SHEET_SWIPE_FLICK_VELOCITY = 0.6;
// Snap anchors, expressed as the fraction of the panel that stays visible:
// 0 is closed, 1 is fully open. The middle anchor sits between the two.
const SHEET_HALF_SNAP_RATIO = 0.5;
const SHEET_INITIAL_SNAP_RATIO = SHEET_HALF_SNAP_RATIO;
// The action bar stays pinned to the bottom of the screen at every anchor, so
// it only fades out once the sheet is nearly closed.
const SHEET_FOOTER_FADE_RATIO = 0.25;
const SHEET_MARKER_ID = 'mfbandoso-investment-marker';
// Breathing room (dp) kept around a province when fitting the camera to it.
const SHEET_FOCUS_PADDING = 24;
const SHEET_TITLE = 'Thông tin đầu tư';
const SHEET_LOADING_TEXT = 'Đang tải thông tin đầu tư...';
const SHEET_EMPTY_TEXT = 'Không có thông tin đầu tư tại vị trí này.';
const SHEET_STATS_TITLE = 'Chỉ số nổi bật';
const SHEET_INDUSTRIAL_ZONES_TITLE = 'Khu công nghiệp';
const SHEET_FOCUS_ACTION_LABEL = 'Xem tỉnh trên bản đồ';

const API_HOST = 'https://cmcdtqg-gateway.dieuhanhso.vn';
const SOURCE_URL_PATH = 'bds/api/tile/vector/{z}/{x}/{y}.pbf?p=1';
const CATEGORY_CONFIG_URL_PATH = 'bds/api/BanDo/dau-tu/category-config';
const PROVINCE_INVESTMENT_INFO_URL_PATH =
  'bds/api/portal/ProvinceInvestmentInfo/reverse';

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

function getProvinceInvestmentInfoUrl(isStaging, latitude, longitude) {
  const query = `latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
  return `${buildApiUrl(PROVINCE_INVESTMENT_INFO_URL_PATH, isStaging)}?${query}`;
}

export {
  SELECTOR_DRAWER_TRANSLATE_X,
  SELECTOR_OPEN_DURATION_MS,
  SELECTOR_CLOSE_DURATION_MS,
  SELECTOR_SWIPE_ACTIVATION_DISTANCE,
  SELECTOR_SWIPE_CLOSE_DISTANCE,
  SELECTOR_SWIPE_CLOSE_VELOCITY,
  SELECTOR_TITLE,
  LEGEND_TITLE,
  SHEET_TOP_PEEK,
  SHEET_OPEN_DURATION_MS,
  SHEET_CLOSE_DURATION_MS,
  SHEET_TRANSLATE_Y,
  SHEET_SWIPE_ACTIVATION_DISTANCE,
  SHEET_SWIPE_FLICK_VELOCITY,
  SHEET_HALF_SNAP_RATIO,
  SHEET_INITIAL_SNAP_RATIO,
  SHEET_FOOTER_FADE_RATIO,
  SHEET_MARKER_ID,
  SHEET_FOCUS_PADDING,
  SHEET_TITLE,
  SHEET_LOADING_TEXT,
  SHEET_EMPTY_TEXT,
  SHEET_STATS_TITLE,
  SHEET_INDUSTRIAL_ZONES_TITLE,
  SHEET_FOCUS_ACTION_LABEL,
  getSourceUrl,
  getCategoryConfigUrl,
  getProvinceInvestmentInfoUrl,
};
