/**
 * File Routes - Transactions Routes
 * Các endpoint quản lý giao dịch thanh toán
 */

import { Router } from 'express'
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  createTransaction,
  getTransactionById,
  getAllTransactions,
  getTransactionsByInvoice,
  refundTransaction,
  updateInvoiceStatus,
} from '../controllers/transactions.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { permissionCheckMiddleware } from '../middleware/roleCheck.middleware'

const router = Router()

/**
 * POST /api/transactions/invoices/:orderId - Tạo hóa đơn
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.post(
  '/invoices/:orderId',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  createInvoice
)

/**
 * GET /api/transactions/invoices - Lấy tất cả hóa đơn
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.get(
  '/invoices',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  getAllInvoices
)

/**
 * GET /api/transactions/invoices/:id - Lấy chi tiết hóa đơn
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.get(
  '/invoices/:id',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  getInvoiceById
)

/**
 * PUT /api/transactions/invoices/:id/status - Cập nhật trạng thái hóa đơn
 * Body: { status }
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.put(
  '/invoices/:id/status',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  updateInvoiceStatus
)

/**
 * POST /api/transactions - Ghi nhận giao dịch
 * Body: { invoiceId, orderId, amount, paymentMethod, processedBy }
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.post(
  '/',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  createTransaction
)

/**
 * GET /api/transactions - Lấy tất cả giao dịch
 * Query: page, limit, status
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.get(
  '/',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  getAllTransactions
)

/**
 * GET /api/transactions/:id - Lấy chi tiết giao dịch
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.get(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  getTransactionById
)

/**
 * GET /api/transactions/invoice/:invoiceId - Lấy giao dịch theo hóa đơn
 * Query: page, limit
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.get(
  '/invoice/:invoiceId',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  getTransactionsByInvoice
)

/**
 * POST /api/transactions/:id/refund - Hoàn tiền giao dịch
 * Body: { refundAmount? }
 * Yêu cầu: AUTH + paymentManagement permission
 */
router.post(
  '/:id/refund',
  authMiddleware,
  permissionCheckMiddleware('paymentManagement'),
  refundTransaction
)

export default router
