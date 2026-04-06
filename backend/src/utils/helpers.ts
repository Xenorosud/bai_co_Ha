/**
 * File Utilities - Các hàm tiện ích
 * Chứa các hàm tạo ID tự động và các tiện ích khác
 */

/**
 * Tạo ID đơn hàng (ORD-XXXXX)
 * @returns string - ID đơn hàng theo định dạng ORD-XXXXX
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  const id = String(timestamp % 100000).padStart(5, '0')
  return `ORD-${id}`
}

/**
 * Tạo ID hóa đơn (INV-XXXXX)
 * @returns string - ID hóa đơn theo định dạng INV-XXXXX
 */
export const generateInvoiceId = (): string => {
  const timestamp = Date.now()
  const id = String(timestamp % 100000).padStart(5, '0')
  return `INV-${id}`
}

/**
 * Tạo ID giao dịch (TXN-XXXXX)
 * @returns string - ID giao dịch theo định dạng TXN-XXXXX
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now()
  const id = String(timestamp % 100000).padStart(5, '0')
  return `TXN-${id}`
}

/**
 * Tính thuế cho đơn hàng
 * @param subtotal - Tổng tiền hàng
 * @param taxRate - Tỷ lệ thuế (mặc định 0.08 = 8%)
 * @returns number - Số tiền thuế
 */
export const calculateTax = (subtotal: number, taxRate: number = 0.08): number => {
  return Number((subtotal * taxRate).toFixed(2))
}

/**
 * Tính tổng tiền đơn hàng
 * @param subtotal - Tổng tiền hàng
 * @param tax - Số tiền thuế
 * @param deliveryFee - Phí giao hàng (mặc định 0)
 * @returns number - Tổng tiền
 */
export const calculateTotal = (
  subtotal: number,
  tax: number,
  deliveryFee: number = 0
): number => {
  return Number((subtotal + tax + deliveryFee).toFixed(2))
}

/**
 * Kiểm tra trạng thái kho
 * @param quantity - Số lượng hiện tại
 * @param minStock - Số lượng tối thiểu
 * @returns string - Trạng thái ('CRITICAL' | 'LOW' | 'GOOD')
 */
export const getInventoryStatus = (quantity: number, minStock: number): string => {
  if (quantity <= minStock * 0.5) {
    return 'CRITICAL'
  } else if (quantity <= minStock) {
    return 'LOW'
  }
  return 'GOOD'
}

/**
 * Định dạng số thành tiền tệ VND
 * @param amount - Số tiền
 * @returns string - Số tiền được định dạng
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

/**
 * Định dạng ngày theo format Việt Nam
 * @param date - Ngày tháng
 * @returns string - Ngày theo định dạng dd/mm/yyyy
 */
export const formatDateVN = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

/**
 * Lấy danh sách quyền mặc định cho từng vai trò
 * @param role - Vai trò nhân viên
 * @returns object - Danh sách quyền
 */
export const getDefaultPermissions = (role: string) => {
  const permissions: Record<string, boolean> = {
    dashboard: false,
    foodManagement: false,
    orderManagement: false,
    tableManagement: false,
    reservationManagement: false,
    paymentManagement: false,
    inventoryManagement: false,
    workersManagement: false,
  }

  switch (role) {
    case 'ADMIN':
      // Admin có tất cả quyền
      return Object.keys(permissions).reduce((acc: Record<string, boolean>, key) => {
        acc[key] = true
        return acc
      }, { ...permissions })

    case 'MANAGER':
      // Manager có hầu hết quyền (trừ quản lý nhân viên)
      return {
        ...permissions,
        dashboard: true,
        foodManagement: true,
        orderManagement: true,
        tableManagement: true,
        reservationManagement: true,
        paymentManagement: true,
        inventoryManagement: true,
      }

    case 'SERVER':
      // Server chỉ có quyền xem dashboard và quản lý đơn hàng, bàn, đặt bàn
      return {
        ...permissions,
        dashboard: true,
        orderManagement: true,
        tableManagement: true,
        reservationManagement: true,
      }

    default:
      return permissions
  }
}
