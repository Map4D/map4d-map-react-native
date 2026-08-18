const ADVANCED_SEARCH_TITLE = 'Tìm kiếm nâng cao';

// Where each knob sits down its 16px track. Three different heights is what
// makes the icon read as sliders rather than as a set of bars.
const ADVANCED_SLIDER_KNOB_OFFSETS = [3, 9, 6];

// The two things the search can be pointed at. They take different filters and
// answer from different endpoints, so the view switches wholesale between them.
const ADVANCED_TARGET_ZONE = 'kcnkkt';
const ADVANCED_TARGET_INFRA = 'htkn';
const ADVANCED_TARGET_LABELS = {
  [ADVANCED_TARGET_ZONE]: 'KCN / KKT',
  [ADVANCED_TARGET_INFRA]: 'Hạ tầng kết nối',
};

const ADVANCED_KEYWORD_LABEL = 'Từ khóa';
const ADVANCED_KEYWORD_PLACEHOLDER = 'Nhập tên khu, mã khu...';
const ADVANCED_ZONE_TYPE_LABEL = 'Loại khu';
const ADVANCED_FORM_TYPE_LABEL = 'Loại hình';
const ADVANCED_STATUS_LABEL = 'Tình trạng';
const ADVANCED_PROVINCE_LABEL = 'Tỉnh/Thành phố';
const ADVANCED_WARD_LABEL = 'Xã/Phường';
const ADVANCED_INFRA_TYPE_LABEL = 'Loại hạ tầng';
const ADVANCED_INFRA_LAYER_LABEL = 'Lớp';
const ADVANCED_SELECT_PLACEHOLDER = 'Tất cả';
// A ward list runs to thousands of entries, so its picker is searchable.
const ADVANCED_PICKER_SEARCH_PLACEHOLDER = 'Tìm trong danh sách...';
const ADVANCED_WARD_DISABLED_HINT = 'Chọn tỉnh/thành trước';
const ADVANCED_FORM_TYPE_DISABLED_HINT = 'Chọn loại khu trước';

const ADVANCED_SEARCH_ACTION = 'Tìm kiếm';
const ADVANCED_RESET_ACTION = 'Xóa lọc';
const ADVANCED_LOADING_TEXT = 'Đang tìm...';
const ADVANCED_EMPTY_TEXT = 'Không có kết quả phù hợp.';
const ADVANCED_ERROR_TEXT = 'Không tải được kết quả. Thử lại sau.';
const ADVANCED_IDLE_TEXT = 'Chọn điều kiện rồi bấm Tìm kiếm.';
const ADVANCED_RESULT_COUNT_SUFFIX = ' kết quả';
const ADVANCED_MORE_LOADING_TEXT = 'Đang tải thêm...';

const ADVANCED_PAGE_SIZE = 20;
// How close to the bottom of the list a scroll gets before the next page is
// asked for.
const ADVANCED_LOAD_MORE_THRESHOLD = 240;

/**
 * Fixed on the web side too: the endpoint takes the status as a number and
 * serves no dictionary for it.
 */
const ADVANCED_STATUS_OPTIONS = [
  { value: 1, label: 'Mới phê duyệt/chấp thuận CTDT' },
  { value: 2, label: 'Đang GPMB' },
  { value: 3, label: 'Đang hoạt động' },
  { value: 4, label: 'Tạm ngừng hoạt động' },
  { value: 5, label: 'Đã thu hồi/chấm dứt' },
];

export {
  ADVANCED_EMPTY_TEXT,
  ADVANCED_ERROR_TEXT,
  ADVANCED_FORM_TYPE_DISABLED_HINT,
  ADVANCED_FORM_TYPE_LABEL,
  ADVANCED_IDLE_TEXT,
  ADVANCED_INFRA_LAYER_LABEL,
  ADVANCED_INFRA_TYPE_LABEL,
  ADVANCED_KEYWORD_LABEL,
  ADVANCED_KEYWORD_PLACEHOLDER,
  ADVANCED_LOADING_TEXT,
  ADVANCED_LOAD_MORE_THRESHOLD,
  ADVANCED_MORE_LOADING_TEXT,
  ADVANCED_PAGE_SIZE,
  ADVANCED_PICKER_SEARCH_PLACEHOLDER,
  ADVANCED_PROVINCE_LABEL,
  ADVANCED_RESET_ACTION,
  ADVANCED_RESULT_COUNT_SUFFIX,
  ADVANCED_SEARCH_ACTION,
  ADVANCED_SEARCH_TITLE,
  ADVANCED_SLIDER_KNOB_OFFSETS,
  ADVANCED_SELECT_PLACEHOLDER,
  ADVANCED_STATUS_LABEL,
  ADVANCED_STATUS_OPTIONS,
  ADVANCED_TARGET_INFRA,
  ADVANCED_TARGET_LABELS,
  ADVANCED_TARGET_ZONE,
  ADVANCED_WARD_DISABLED_HINT,
  ADVANCED_WARD_LABEL,
  ADVANCED_ZONE_TYPE_LABEL,
};
