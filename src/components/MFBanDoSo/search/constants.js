const SEARCH_PLACEHOLDER = 'Tìm tỉnh, khu công nghiệp, khu kinh tế...';
const SEARCH_LOADING_TEXT = 'Đang tìm...';
const SEARCH_EMPTY_TEXT = 'Không tìm thấy kết quả phù hợp.';
// Keystrokes are cheap, requests are not: wait for a pause before asking.
const SEARCH_DEBOUNCE_MS = 350;
// One or two letters match nearly everything, so the list would be noise.
const SEARCH_MIN_KEYWORD_LENGTH = 2;
// `loai` on a result, telling a zone apart from a province.
const SEARCH_ZONE_KIND = 'kcnkkt';

export {
  SEARCH_DEBOUNCE_MS,
  SEARCH_EMPTY_TEXT,
  SEARCH_LOADING_TEXT,
  SEARCH_MIN_KEYWORD_LENGTH,
  SEARCH_PLACEHOLDER,
  SEARCH_ZONE_KIND,
};
