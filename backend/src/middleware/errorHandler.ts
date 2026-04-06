/**
 * File Middleware - Error Handling
 * Xử lý lỗi toàn cầu cho ứng dụng
 */

import { Request, Response, NextFunction } from 'express'

/**
 * Custom Error Class - Lớp lỗi tùy chỉnh
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Global Error Handler Middleware - Xử lý lỗi toàn cầu
 * Phải được gọi cuối cùng trong app setup
 *
 * Ví dụ:
 * app.use('/', routes)
 * app.use(errorHandler) // Phải ở cuối
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err)

  // Nếu là ApiError tùy chỉnh
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'ERROR',
      code: err.code,
      message: err.message,
      timestamp: new Date().toISOString(),
      details: err.details,
    })
  }

  // Xử lý lỗi Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any

    // P2002: Unique constraint failed
    if (prismaErr.code === 'P2002') {
      const field = prismaErr.meta?.target?.[0] || 'field'
      return res.status(409).json({
        status: 'ERROR',
        code: 'UNIQUE_CONSTRAINT_FAILED',
        message: `${field} đã tồn tại`,
        field,
        timestamp: new Date().toISOString(),
      })
    }

    // P2025: Record not found
    if (prismaErr.code === 'P2025') {
      return res.status(404).json({
        status: 'ERROR',
        code: 'RECORD_NOT_FOUND',
        message: 'Không tìm thấy bản ghi',
        timestamp: new Date().toISOString(),
      })
    }

    // Lỗi Prisma khác
    return res.status(400).json({
      status: 'ERROR',
      code: prismaErr.code,
      message: 'Lỗi cơ sở dữ liệu',
      timestamp: new Date().toISOString(),
    })
  }

  // Xử lý lỗi Validation (từ Zod)
  if (err.name === 'ZodError') {
    const zodErr = err as any
    return res.status(400).json({
      status: 'ERROR',
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu không hợp lệ',
      errors: zodErr.errors?.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message,
      })) || [],
      timestamp: new Date().toISOString(),
    })
  }

  // Lỗi Generic
  return res.status(500).json({
    status: 'ERROR',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'Lỗi máy chủ nội bộ'
      : err.message,
    timestamp: new Date().toISOString(),
  })
}

/**
 * 404 Not Found Handler - Xử lý khi không tìm thấy route
 * Phải được gọi sau khi định nghĩa tất cả routes
 *
 * Ví dụ:
 * app.use('/', routes)
 * app.use(notFoundHandler)
 * app.use(errorHandler)
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(
    404,
    'NOT_FOUND',
    `Route không tìm thấy: ${req.method} ${req.path}`
  )
  next(error)
}

/**
 * Async Error Wrapper - Bao bọc async handler để catch lỗi
 * Sử dụng để wrapper async endpoint handlers
 *
 * Ví dụ:
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await prisma.user.findMany()
 *   res.json(users)
 * }))
 */
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
