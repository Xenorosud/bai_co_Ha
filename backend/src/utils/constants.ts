/**
 * Constants & Error Messages - Các hằng số và thông báo lỗi
 */

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',
  FETCHED: 'Lấy dữ liệu thành công',
};

// Error Messages
export const ERROR_MESSAGES = {
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  INVALID_DATA: 'Dữ liệu không hợp lệ',
  DUPLICATE_ENTRY: 'Dữ liệu đã tồn tại',
  UNAUTHORIZED: 'Không có quyền truy cập',
  FORBIDDEN: 'Bị cấm truy cập',
  SERVER_ERROR: 'Lỗi máy chủ nội bộ',
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Default Tax Rate (8%)
export const TAX_RATE = 0.08;
