/**
 * API Client - Axios wrapper with interceptors
 * Tất cả API calls đi qua đây
 */

import axios, { AxiosError, AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// ============================================
// API Client Instance
// ============================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// ============================================
// Request Interceptor - Add JWT Token (disabled in development)
// ============================================

apiClient.interceptors.request.use(
  (config) => {
    // Always add token for authenticated requests
    const token = localStorage.getItem('restora_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ============================================
// Response Interceptor - Handle Errors (disabled in development)
// ============================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Disable auth logic trong dev mode với mock API
    const isDev = import.meta.env.DEV && API_BASE_URL.includes('localhost:3001')

    if (isDev) {
      // Trong dev mode, chỉ log error và return rejection
      console.error('API Error (Dev Mode):', error.response?.status, error.response?.data)
      return Promise.reject(error)
    }

    const originalRequest = error.config as any

    // Nếu 401 & chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        })

        const { accessToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh token hết hạn - logout
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ============================================
// API Methods - Auth
// ============================================

export const authAPI = {
  // Real authentication endpoints
  login: (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password })
  },

  logout: () => {
    return apiClient.post('/auth/logout')
  },

  refreshToken: (refreshToken: string) => {
    return apiClient.post('/auth/refresh-token', { refreshToken })
  },

  me: () => {
    return apiClient.get('/auth/me')
  },

  changePassword: (currentPassword: string, newPassword: string) => {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword })
  },

  // Keep register for potential future use
  register: (email: string, password: string, passwordConfirm: string) => {
    return apiClient.post('/auth/register', { email, password, passwordConfirm })
  }
}

// ============================================
// API Methods - Orders
// ============================================

export const ordersAPI = {
  getAll: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (status) params.append('status', status)
    return apiClient.get(`/orders?${params.toString()}`)
  },

  getById: (id: number) => apiClient.get(`/orders/${id}`),

  create: (data: any) => apiClient.post('/orders', data),

  updateStatus: (id: number, orderStatus: string) =>
    apiClient.put(`/orders/${id}`, { orderStatus }),

  cancel: (id: number) => apiClient.delete(`/orders/${id}`),

  getByStatus: (status: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/orders/status/${status}?${params.toString()}`)
  },

  getByTable: (tableId: number) => apiClient.get(`/orders/table/${tableId}`),

  getByCustomer: (customerId: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/orders/customer/${customerId}?${params.toString()}`)
  },
}

// ============================================
// API Methods - Reservations
// ============================================

export const reservationsAPI = {
  getAll: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (status) params.append('status', status)
    return apiClient.get(`/reservations?${params.toString()}`)
  },

  getById: (id: number) => apiClient.get(`/reservations/${id}`),

  create: (data: any) => apiClient.post('/reservations', data),

  approve: (id: number, tableId?: number) =>
    apiClient.post(`/reservations/${id}/approve`, { tableId }),

  deny: (id: number) => apiClient.post(`/reservations/${id}/deny`, {}),

  complete: (id: number) => apiClient.post(`/reservations/${id}/complete`, {}),

  cancel: (id: number) => apiClient.post(`/reservations/${id}/cancel`),

  getByDate: (date: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/reservations/date/${date}?${params.toString()}`)
  },

  getByStatus: (status: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/reservations/status/${status}?${params.toString()}`)
  },
}

// ============================================
// API Methods - Dishes
// ============================================

export const dishesAPI = {
  getAll: (page = 1, limit = 20, search?: string) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (search) params.append('search', search)
    return apiClient.get(`/dishes?${params.toString()}`)
  },

  getById: (id: number) => apiClient.get(`/dishes/${id}`),

  create: (data: any) => apiClient.post('/dishes', data),

  update: (id: number, data: any) => apiClient.put(`/dishes/${id}`, data),

  delete: (id: number) => apiClient.delete(`/dishes/${id}`),

  getByType: (typeId: number) => apiClient.get(`/dishes/type/${typeId}`),
}

// ============================================
// API Methods - Tables
// ============================================

export const tablesAPI = {
  getAll: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (status) params.append('status', status)
    return apiClient.get(`/tables?${params.toString()}`)
  },

  getById: (id: number) => apiClient.get(`/tables/${id}`),

  create: (data: any) => apiClient.post('/tables', data),

  update: (id: number, data: any) => apiClient.put(`/tables/${id}`, data),

  delete: (id: number) => apiClient.delete(`/tables/${id}`),

  getAvailable: () => apiClient.get('/tables/available'),

  getByStatus: (status: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/tables/status/${status}?${params.toString()}`)
  },

  findForGuests: (guestCount: number) =>
    apiClient.get(`/tables/for-guests/${guestCount}`),
}

// ============================================
// API Methods - Inventory
// ============================================

export const inventoryAPI = {
  getAll: (page = 1, limit = 20, search?: string, filters?: any) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (search) params.append('search', search)
    if (filters?.category) params.append('category', filters.category)
    return apiClient.get(`/inventory?${params.toString()}`)
  },

  getById: (id: number) => apiClient.get(`/inventory/${id}`),

  create: (data: any) => apiClient.post('/inventory', data),

  update: (id: number, data: any) => apiClient.put(`/inventory/${id}`, data),

  delete: (id: number) => apiClient.delete(`/inventory/${id}`),

  getLowStock: (page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/inventory/status/low?${params.toString()}`)
  },

  getCriticalStock: () => apiClient.get('/inventory/status/critical'),

  getByCategory: (category: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/inventory/category/${category}?${params.toString()}`)
  },

  restock: (id: number, quantity: number) =>
    apiClient.post(`/inventory/${id}/restock`, { quantity }),
}

// ============================================
// API Methods - Transactions
// ============================================

export const transactionsAPI = {
  createInvoice: (orderId: number) =>
    apiClient.post(`/transactions/invoices/${orderId}`),

  getAllInvoices: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (status) params.append('status', status)
    return apiClient.get(`/transactions/invoices?${params.toString()}`)
  },

  getInvoiceById: (id: number) => apiClient.get(`/transactions/invoices/${id}`),

  updateInvoiceStatus: (id: number, status: string) =>
    apiClient.put(`/invoices/${id}/status`, { status }),

  create: (data: any) => apiClient.post('/transactions', data),

  getAll: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (status) params.append('status', status)
    return apiClient.get(`/transactions?${params.toString()}`)
  },

  getById: (id: number) => apiClient.get(`/transactions/${id}`),

  getByInvoice: (invoiceId: number, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(
      `/transactions/invoice/${invoiceId}?${params.toString()}`
    )
  },

  refund: (id: number, amount: number) =>
    apiClient.post(`/transactions/${id}/refund`, { amount }),
}

// ============================================
// API Methods - Employees
// ============================================

export const employeesAPI = {
  getAll: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (status) params.append('status', status)
    return apiClient.get(`/employees?${params.toString()}`)
  },

  getById: (id: string) => apiClient.get(`/employees/${id}`),

  create: (data: any) => apiClient.post('/employees', data),

  update: (id: string, data: any) => apiClient.put(`/employees/${id}`, data),

  delete: (id: string) => apiClient.delete(`/employees/${id}`),

  updatePermissions: (id: string, permissions: Record<string, boolean>) =>
    apiClient.put(`/employees/${id}/permissions`, { permissions }),

  getByStatus: (status: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/employees/status/${status}?${params.toString()}`)
  },

  getByRole: (role: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    return apiClient.get(`/employees/role/${role}?${params.toString()}`)
  },

  toggleStatus: (id: string) =>
    apiClient.post(`/employees/${id}/toggle-status`),
}

export default apiClient
