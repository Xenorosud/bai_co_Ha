/**
 * File Types - TypeScript Types Definitions
 * Định nghĩa các kiểu dữ liệu sử dụng trong ứng dụng
 */

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  status: 'OK' | 'ERROR'
  message: string
  data?: T
  code?: string
  timestamp?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: PaginationMeta
}

/**
 * User Related Types
 */
export interface UserLoginRequest {
  email: string
  password: string
}

export interface UserRegisterRequest {
  email: string
  password: string
  passwordConfirm: string
}

export interface UserResponse {
  id: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'SERVER' | 'CUSTOMER'
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  updatedAt: Date
}

/**
 * Auth Response Types
 */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserResponse
}

export interface TokenResponse {
  accessToken: string
  refreshToken?: string
}

/**
 * Dish Related Types
 */
export interface DishCreateRequest {
  name: string
  description: string
  price: number
  image: string
  typeId: number
}

export interface DishUpdateRequest {
  name?: string
  description?: string
  price?: number
  image?: string
  typeId?: number
  availability?: boolean
}

export interface DishResponse {
  id: number
  name: string
  description: string
  price: number
  image: string
  typeId: number
  availability: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Order Related Types
 */
export interface OrderItemRequest {
  dishId: number
  quantity: number
  specialInstructions?: string
}

export interface OrderCreateRequest {
  tableId?: number
  customerId?: string
  employeeId: string
  orderItems: OrderItemRequest[]
  deliveryType: 'DINE_IN' | 'DELIVERY' | 'TAKEOUT'
  deliveryAddress?: string
}

export interface OrderUpdateRequest {
  orderStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
}

export interface OrderResponse {
  id: number
  orderId: string
  tableId?: number
  customerId?: string
  employeeId: string
  orderStatus: string
  subtotal: number
  tax: number
  total: number
  deliveryType: string
  deliveryAddress?: string
  orderDate: Date
  orderTime: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Reservation Related Types
 */
export interface ReservationCreateRequest {
  customerName: string
  phone: string
  email: string
  reservationDate: Date
  reservationTime: Date
  guestCount: number
  specialRequests?: string
  higherTable?: boolean
}

export interface ReservationUpdateRequest {
  status: 'APPROVED' | 'DENIED' | 'COMPLETED' | 'CANCELLED'
  tableId?: number
}

export interface ReservationResponse {
  id: number
  tableId?: number
  customerName: string
  phone: string
  email: string
  reservationDate: Date
  reservationTime: Date
  guestCount: number
  specialRequests?: string
  higherTable: boolean
  status: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Table Related Types
 */
export interface TableCreateRequest {
  number: number
  capacity: number
}

export interface TableUpdateRequest {
  status?: 'EMPTY' | 'BEING_USED' | 'RESERVED'
  capacity?: number
}

export interface TableResponse {
  id: number
  number: number
  capacity: number
  status: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Inventory Related Types
 */
export interface InventoryCreateRequest {
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  supplierId?: number
}

export interface InventoryUpdateRequest {
  quantity?: number
  minStock?: number
  lastRestocked?: Date
}

export interface InventoryResponse {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  supplierId?: number
  lastRestocked: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Payment Related Types
 */
export interface TransactionCreateRequest {
  invoiceId?: number
  orderId: number
  amount: number
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'ONLINE'
  processedBy: string
}

export interface TransactionResponse {
  id: number
  transactionId: string
  invoiceId?: number
  orderId: number
  amount: number
  paymentMethod: string
  transactionStatus: string
  processedBy: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Query Params Types
 */
export interface PaginationParams {
  page?: number
  limit?: number
  skip?: number
}

export interface FilterParams {
  status?: string
  search?: string
  startDate?: Date
  endDate?: Date
  [key: string]: any
}

/**
 * Employee Related Types
 */
export interface EmployeeCreateRequest {
  userId: string
  name: string
  phone: string
  hireDate: Date
}

export interface EmployeeUpdateRequest {
  name?: string
  phone?: string
  status?: 'ACTIVE' | 'INACTIVE'
  permissions?: Record<string, boolean>
}

export interface EmployeeResponse {
  id: string
  userId: string
  name: string
  phone: string
  hireDate: Date
  status: string
  permissions: Record<string, boolean>
  createdAt: Date
  updatedAt: Date
}
