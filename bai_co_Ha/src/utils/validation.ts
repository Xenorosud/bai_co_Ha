/**
 * Validation Utilities - Các hàm validation cho forms
 */

// Email validation
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email.trim()) {
    return { isValid: false, message: "Email là bắt buộc" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email không hợp lệ" };
  }

  if (email.length > 100) {
    return { isValid: false, message: "Email không được dài quá 100 ký tự" };
  }

  return { isValid: true };
};

// Phone validation cho Việt Nam
export const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone.trim()) {
    return { isValid: false, message: "Số điện thoại là bắt buộc" };
  }

  // Vietnamese phone number patterns
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, message: "Số điện thoại không hợp lệ (VD: 0901234567)" };
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name: string, fieldName: string = "Tên"): { isValid: boolean; message?: string } => {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} là bắt buộc` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} phải có ít nhất 2 ký tự` };
  }

  if (name.length > 100) {
    return { isValid: false, message: `${fieldName} không được dài quá 100 ký tự` };
  }

  // Check for invalid characters (only Vietnamese letters, spaces, and common punctuation)
  const nameRegex = /^[a-zA-ZÀàÁáÂâÃãÈèÉéÊêÌìÍíÒòÓóÔôÕõÙùÚúÝýĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰự\s\.'-]+$/;

  if (!nameRegex.test(name)) {
    return { isValid: false, message: `${fieldName} chỉ được chứa chữ cái, khoảng trắng và dấu phẩy` };
  }

  return { isValid: true };
};

// Number range validation
export const validateNumber = (
  value: string | number,
  min?: number,
  max?: number,
  fieldName: string = "Giá trị"
): { isValid: boolean; message?: string } => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} phải là số hợp lệ` };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, message: `${fieldName} không được nhỏ hơn ${min.toLocaleString()}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, message: `${fieldName} không được lớn hơn ${max.toLocaleString()}` };
  }

  return { isValid: true };
};

// Date validation
export const validateDate = (
  date: string | Date,
  minDate?: Date,
  maxDate?: Date,
  fieldName: string = "Ngày"
): { isValid: boolean; message?: string } => {
  let dateObj: Date;

  if (typeof date === 'string') {
    if (!date.trim()) {
      return { isValid: false, message: `${fieldName} là bắt buộc` };
    }
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: `${fieldName} không hợp lệ` };
  }

  if (minDate && dateObj < minDate) {
    return { isValid: false, message: `${fieldName} không được trước ${minDate.toLocaleDateString('vi-VN')}` };
  }

  if (maxDate && dateObj > maxDate) {
    return { isValid: false, message: `${fieldName} không được sau ${maxDate.toLocaleDateString('vi-VN')}` };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: "Mật khẩu là bắt buộc" };
  }

  if (password.length < 8) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 8 ký tự" };
  }

  if (password.length > 128) {
    return { isValid: false, message: "Mật khẩu không được dài quá 128 ký tự" };
  }

  // Check for at least one uppercase, one lowercase, one number
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpper || !hasLower || !hasNumber) {
    return { isValid: false, message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số" };
  }

  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: any, fieldName: string): { isValid: boolean; message?: string } => {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `${fieldName} là bắt buộc` };
  }
  return { isValid: true };
};