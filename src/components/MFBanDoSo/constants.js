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

// Sheet shown when a KCN/KKT feature is tapped instead of bare map.
const SHEET_ZONE_TITLE = 'Chi tiết khu';
const SHEET_ZONE_LOADING_TEXT = 'Đang tải thông tin khu...';
const SHEET_ZONE_EMPTY_TEXT = 'Không có thông tin chi tiết cho khu này.';
const ZONE_MAIN_INFO_TITLE = 'Thông tin chính';
const ZONE_LOCATION_TITLE = 'Vị trí';
const ZONE_ADDRESS_LABEL = 'Địa chỉ';
const ZONE_INTRO_TITLE = 'Giới thiệu';
const ZONE_ATTRACTED_SECTORS_TITLE = 'Ngành nghề thu hút đầu tư';
const ZONE_RESTRICTED_SECTORS_TITLE = 'Ngành nghề hạn chế đầu tư';
const ZONE_ADVANTAGES_TITLE = 'Lợi thế đầu tư';
const ZONE_INVESTOR_TITLE = 'Chủ đầu tư';
// Highlight drawn over the tapped zone's own geometry.
const ZONE_POLYGON_ID_PREFIX = 'mfbandoso-zone-polygon';
const ZONE_HIGHLIGHT_FILL_COLOR = '#B91C1C33';
const ZONE_HIGHLIGHT_STROKE_COLOR = '#B91C1CFF';
const ZONE_HIGHLIGHT_STROKE_WIDTH = 2;
const ZONE_HIGHLIGHT_Z_INDEX = 900;
const ZONE_PUBLISHED_TEXT = 'Đã công bố';
const ZONE_UNPUBLISHED_TEXT = 'Chưa công bố';
const ZONE_CURRENCY_SUFFIX = ' đ';

// Placeholders. The `portal/kcnkkt/{id}` payload carries no banner image and no
// sector/advantage lists, so these sections of the design are filled from here
// until the API serves them. Swap these for real fields in
// `zoneInfoHelpers.js` once it does — nothing else has to change.
const ZONE_PLACEHOLDER_BANNER_IMAGE =
  'https://minio.zamiga.vn/cmc-dtqg/public/gioithieu/muong_hoa_-_lao_cai_24072026_070844.webp';
const ZONE_PLACEHOLDER_ATTRACTED_SECTORS = [
  'Công nghiệp chế biến, chế tạo',
  'Điện tử và công nghệ thông tin',
  'Logistics và kho vận',
];
const ZONE_PLACEHOLDER_RESTRICTED_SECTORS = [
  'Sản xuất gây ô nhiễm môi trường',
  'Chế biến khoáng sản',
];
const ZONE_PLACEHOLDER_ADVANTAGES = [
  'Ưu đãi thuế theo quy định hiện hành',
  'Hạ tầng kỹ thuật đồng bộ',
  'Hỗ trợ thủ tục đầu tư một cửa',
];
const ZONE_ESTABLISHED_YEAR_LABEL = 'Năm thành lập';
const ZONE_TOTAL_INVESTMENT_LABEL = 'Tổng vốn đầu tư';
const ZONE_STATUS_LABEL = 'Tình trạng';
const ZONE_TYPE_LABEL = 'Loại hình';
const ZONE_INVESTMENT_PROJECTS_LABEL = 'Dự án đầu tư';
const ZONE_ATTRACTED_PROJECTS_LABEL = 'Dự án thu hút';
const ZONE_PROJECTS_SUBTITLE = 'Danh sách dự án thuộc khu';
const ZONE_PROJECTS_COUNT_SUFFIX = ' dự án';
const ZONE_PROJECTS_LOADING_TEXT = 'Đang tải danh sách dự án...';

// The two project lists differ only in endpoint suffix and wording, so they are
// described here instead of being branched on at every use site.
const ZONE_PROJECT_KIND_INVESTMENT = 'investment';
const ZONE_PROJECT_KIND_ATTRACTED = 'attracted';
const ZONE_PROJECT_KINDS = {
  [ZONE_PROJECT_KIND_INVESTMENT]: {
    urlSuffix: 'du-an-dau-tu',
    title: ZONE_INVESTMENT_PROJECTS_LABEL,
    emptyText: 'Chưa có dự án đầu tư.',
  },
  [ZONE_PROJECT_KIND_ATTRACTED]: {
    urlSuffix: 'du-an-thu-hut',
    title: ZONE_ATTRACTED_PROJECTS_LABEL,
    emptyText: 'Chưa có dự án thu hút đầu tư.',
  },
};
const ZONE_PROJECT_AREA_LABEL = 'Diện tích dự kiến';
const ZONE_PROJECT_INVESTMENT_LABEL = 'Tổng mức đầu tư dự kiến';
const ZONE_AREA_SUFFIX = ' m²';

const SEARCH_PLACEHOLDER = 'Tìm tỉnh, khu công nghiệp, khu kinh tế...';
const SEARCH_LOADING_TEXT = 'Đang tìm...';
const SEARCH_EMPTY_TEXT = 'Không tìm thấy kết quả phù hợp.';
// Keystrokes are cheap, requests are not: wait for a pause before asking.
const SEARCH_DEBOUNCE_MS = 350;
// One or two letters match nearly everything, so the list would be noise.
const SEARCH_MIN_KEYWORD_LENGTH = 2;

const DIRECTIONS_ACTION_LABEL = 'Chỉ đường';
const DIRECTIONS_LOADING_TEXT = 'Đang tìm đường...';
const DIRECTIONS_EMPTY_TEXT = 'Không tìm được đường đi giữa hai điểm này.';
const DIRECTIONS_PICK_ORIGIN_TEXT = 'Chạm vào bản đồ để chọn điểm bắt đầu';
const DIRECTIONS_PICK_DESTINATION_TEXT = 'Chạm vào bản đồ để chọn điểm đến';
const DIRECTIONS_PICK_ORIGIN_CANCEL = 'Huỷ';
const DIRECTIONS_ORIGIN_LABEL = 'Điểm đi';
const DIRECTIONS_DESTINATION_LABEL = 'Điểm đến';
const DIRECTIONS_MY_LOCATION_TEXT = 'Vị trí của bạn';
const DIRECTIONS_PICKED_POINT_TEXT = 'Điểm bạn đã chọn';
const DIRECTIONS_CHANGE_HINT = 'Chạm để đổi';
const DIRECTIONS_ENDPOINT_ORIGIN = 'origin';
const DIRECTIONS_ENDPOINT_DESTINATION = 'destination';
const DIRECTIONS_STEPS_TITLE = 'Chỉ dẫn từng chặng';
// Route drawing. The renderer takes the /sdk/route payload as-is and decodes
// the polyline natively, so these are only about how it is painted.
const DIRECTIONS_ACTIVE_STROKE_COLOR = '#1D4ED8';
const DIRECTIONS_ACTIVE_STROKE_WIDTH = 6;
const DIRECTIONS_ACTIVE_OUTLINE_COLOR = '#FFFFFF';
const DIRECTIONS_ACTIVE_OUTLINE_WIDTH = 2;
// Labels drawn on the map at each end of the route.
const DIRECTIONS_ORIGIN_POI_COLOR = '#1D4ED8';
const DIRECTIONS_DESTINATION_POI_COLOR = '#B91C1C';
const ROUTE_MODE = 'car';
const ROUTE_LANGUAGE = 'vi';

const API_HOST = 'https://cmcdtqg-gateway.dieuhanhso.vn';
const SOURCE_URL_PATH = 'bds/api/tile/vector/{z}/{x}/{y}.pbf?p=1';
const CATEGORY_CONFIG_URL_PATH = 'bds/api/BanDo/dau-tu/category-config';
const PROVINCE_INVESTMENT_INFO_URL_PATH =
  'bds/api/portal/ProvinceInvestmentInfo/reverse';
const ZONE_DETAIL_URL_PATH = 'bds/api/portal/kcnkkt';
const SEARCH_URL_PATH = 'bds/api/portal/TimKiem/auto';
const ROUTE_URL_PATH = 'bds-sdk/sdk/route';
const ROUTE_API_KEY = '5c643df61c0356baecdc81a4b4aca826';

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

function getSearchUrl(isStaging, keyword) {
  const base = buildApiUrl(SEARCH_URL_PATH, isStaging);
  return `${base}?keyword=${encodeURIComponent(keyword)}`;
}

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
  SHEET_ZONE_TITLE,
  SHEET_ZONE_LOADING_TEXT,
  SHEET_ZONE_EMPTY_TEXT,
  ZONE_MAIN_INFO_TITLE,
  ZONE_LOCATION_TITLE,
  ZONE_ADDRESS_LABEL,
  ZONE_INTRO_TITLE,
  ZONE_ATTRACTED_SECTORS_TITLE,
  ZONE_RESTRICTED_SECTORS_TITLE,
  ZONE_ADVANTAGES_TITLE,
  ZONE_INVESTOR_TITLE,
  ZONE_POLYGON_ID_PREFIX,
  ZONE_HIGHLIGHT_FILL_COLOR,
  ZONE_HIGHLIGHT_STROKE_COLOR,
  ZONE_HIGHLIGHT_STROKE_WIDTH,
  ZONE_HIGHLIGHT_Z_INDEX,
  ZONE_PUBLISHED_TEXT,
  ZONE_UNPUBLISHED_TEXT,
  ZONE_CURRENCY_SUFFIX,
  ZONE_PLACEHOLDER_BANNER_IMAGE,
  ZONE_PLACEHOLDER_ATTRACTED_SECTORS,
  ZONE_PLACEHOLDER_RESTRICTED_SECTORS,
  ZONE_PLACEHOLDER_ADVANTAGES,
  ZONE_ESTABLISHED_YEAR_LABEL,
  ZONE_TOTAL_INVESTMENT_LABEL,
  ZONE_STATUS_LABEL,
  ZONE_TYPE_LABEL,
  ZONE_INVESTMENT_PROJECTS_LABEL,
  ZONE_ATTRACTED_PROJECTS_LABEL,
  ZONE_PROJECTS_SUBTITLE,
  ZONE_PROJECTS_COUNT_SUFFIX,
  ZONE_PROJECTS_LOADING_TEXT,
  ZONE_PROJECT_KINDS,
  ZONE_PROJECT_KIND_INVESTMENT,
  ZONE_PROJECT_KIND_ATTRACTED,
  ZONE_PROJECT_AREA_LABEL,
  ZONE_PROJECT_INVESTMENT_LABEL,
  ZONE_AREA_SUFFIX,
  DIRECTIONS_ACTION_LABEL,
  DIRECTIONS_LOADING_TEXT,
  DIRECTIONS_EMPTY_TEXT,
  DIRECTIONS_PICK_ORIGIN_TEXT,
  DIRECTIONS_PICK_DESTINATION_TEXT,
  DIRECTIONS_PICK_ORIGIN_CANCEL,
  DIRECTIONS_ORIGIN_LABEL,
  DIRECTIONS_DESTINATION_LABEL,
  DIRECTIONS_MY_LOCATION_TEXT,
  DIRECTIONS_PICKED_POINT_TEXT,
  DIRECTIONS_CHANGE_HINT,
  DIRECTIONS_ENDPOINT_ORIGIN,
  DIRECTIONS_ENDPOINT_DESTINATION,
  DIRECTIONS_STEPS_TITLE,
  DIRECTIONS_ACTIVE_STROKE_COLOR,
  DIRECTIONS_ACTIVE_STROKE_WIDTH,
  DIRECTIONS_ACTIVE_OUTLINE_COLOR,
  DIRECTIONS_ACTIVE_OUTLINE_WIDTH,
  DIRECTIONS_ORIGIN_POI_COLOR,
  DIRECTIONS_DESTINATION_POI_COLOR,
  getRouteUrl,
  SEARCH_PLACEHOLDER,
  SEARCH_LOADING_TEXT,
  SEARCH_EMPTY_TEXT,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_KEYWORD_LENGTH,
  getSearchUrl,
  getSourceUrl,
  getCategoryConfigUrl,
  getProvinceInvestmentInfoUrl,
  getZoneDetailUrl,
  getZoneProjectsUrl,
};
