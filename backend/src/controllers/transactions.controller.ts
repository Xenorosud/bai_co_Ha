/**
 * File Controller - Transactions Controller
 * Xử lý request liên quan đến giao dịch thanh toán
 */

import { Request, Response } from 'express'
import transactionService from '../services/transactions.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES } from '../utils/constants'

/**
 * POST /api/transactions/invoices/:orderId
 * Tạo hóa đơn từ đơn hàng
 */
export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.orderId as string)

  if (isNaN(orderId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID đơn hàng không hợp lệ')
  }

  const invoice = await transactionService.createInvoice(orderId)

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: invoice,
  })
})

/**
 * GET /api/transactions/invoices/:id
 * Lấy chi tiết hóa đơn
 */
export const getInvoiceById = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.id as string)

  if (isNaN(invoiceId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID hóa đơn không hợp lệ')
  }

  const invoice = await transactionService.getInvoiceById(invoiceId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin hóa đơn thành công',
    data: invoice,
  })
})

/**
 * GET /api/transactions/invoices
 * Lấy tất cả hóa đơn (phân trang, lọc theo trạng thái)
 */
export const getAllInvoices = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const statusParam = req.query.status as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await transactionService.getAllInvoices(page, limit, statusParam)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách hóa đơn thành công',
    data: result.invoices,
    meta: result.pagination,
  })
})

/**
 * POST /api/transactions
 * Ghi nhận giao dịch thanh toán
 */
export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { invoiceId, orderId, amount, paymentMethod, processedBy } = req.body

  if (!invoiceId || !orderId || !amount || !paymentMethod || !processedBy) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  const transaction = await transactionService.createTransaction({
    invoiceId,
    orderId,
    amount,
    paymentMethod,
    processedBy,
  })

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: transaction,
  })
})

/**
 * GET /api/transactions/:id
 * Lấy chi tiết giao dịch
 */
export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transactionId = parseInt(req.params.id as string)

  if (isNaN(transactionId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID giao dịch không hợp lệ')
  }

  const transaction = await transactionService.getTransactionById(transactionId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin giao dịch thành công',
    data: transaction,
  })
})

/**
 * GET /api/transactions
 * Lấy tất cả giao dịch (phân trang, lọc theo trạng thái)
 */
export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const statusParam = req.query.status as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await transactionService.getAllTransactions(page, limit, statusParam)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách giao dịch thành công',
    data: result.transactions,
    meta: result.pagination,
  })
})

/**
 * GET /api/transactions/invoice/:invoiceId
 * Lấy giao dịch theo hóa đơn
 */
export const getTransactionsByInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.invoiceId as string)
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  if (isNaN(invoiceId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID hóa đơn không hợp lệ')
  }

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await transactionService.getTransactionsByInvoice(invoiceId, page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách giao dịch theo hóa đơn thành công',
    data: result.transactions,
    meta: result.pagination,
  })
})

/**
 * POST /api/transactions/:id/refund
 * Hoàn tiền giao dịch
 */
export const refundTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transactionId = parseInt(req.params.id as string)
  const { refundAmount } = req.body

  if (isNaN(transactionId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID giao dịch không hợp lệ')
  }

  const transaction = await transactionService.refundTransaction(transactionId, refundAmount)

  res.status(200).json({
    status: 'OK',
    message: 'Hoàn tiền thành công',
    data: transaction,
  })
})

/**
 * PUT /api/transactions/invoices/:id/status
 * Cập nhật trạng thái hóa đơn
 */
export const updateInvoiceStatus = asyncHandler(async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.id as string)
  const { status } = req.body

  if (isNaN(invoiceId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID hóa đơn không hợp lệ')
  }

  if (!status) {
    throw new ApiError(400, 'MISSING_STATUS', 'Trạng thái không được để trống')
  }

  const invoice = await transactionService.updateInvoiceStatus(invoiceId, status)

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.UPDATED,
    data: invoice,
  })
})
