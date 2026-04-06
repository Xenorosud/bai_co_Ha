/**
 * File Controller - Employees Controller
 * Xử lý request quản lý nhân viên
 */

import { Request, Response } from 'express'
import employeeService from '../services/employees.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES } from '../utils/constants'

/**
 * POST /api/employees
 * Tạo nhân viên mới
 */
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { userId, name, phone, hireDate } = req.body

  if (!userId || !name || !phone || !hireDate) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  const employee = await employeeService.createEmployee({
    userId,
    name,
    phone,
    hireDate: new Date(hireDate),
  })

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: employee,
  })
})

/**
 * GET /api/employees/:id
 * Lấy chi tiết nhân viên
 */
export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }

  const employee = await employeeService.getEmployeeById(id)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin nhân viên thành công',
    data: employee,
  })
})

/**
 * GET /api/employees
 * Lấy tất cả nhân viên (phân trang, lọc theo trạng thái)
 */
export const getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const statusParam = req.query.status as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await employeeService.getAllEmployees(page, limit, statusParam)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách nhân viên thành công',
    data: result.employees,
    meta: result.pagination,
  })
})

/**
 * PUT /api/employees/:id
 * Cập nhật thông tin nhân viên
 */
export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const { name, phone, status } = req.body

  const employee = await employeeService.updateEmployee(id, {
    name,
    phone,
    status,
  })

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.UPDATED,
    data: employee,
  })
})

/**
 * DELETE /api/employees/:id
 * Xóa nhân viên
 */
export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }

  const result = await employeeService.deleteEmployee(id)

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.DELETED,
    data: result,
  })
})

/**
 * PUT /api/employees/:id/permissions
 * Cập nhật quyền nhân viên
 */
export const updatePermissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const { permissions } = req.body

  if (!permissions || typeof permissions !== 'object') {
    throw new ApiError(400, 'INVALID_PERMISSIONS', 'Quyền phải là một object')
  }

  const employee = await employeeService.updatePermissions(id, permissions)

  res.status(200).json({
    status: 'OK',
    message: 'Cập nhật quyền thành công',
    data: employee,
  })
})

/**
 * GET /api/employees/status/:status
 * Lấy nhân viên theo trạng thái
 */
export const getEmployeesByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params as { status: string }
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await employeeService.getEmployeesByStatus(status, page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách nhân viên theo trạng thái thành công',
    data: result.employees,
    meta: result.pagination,
  })
})

/**
 * GET /api/employees/role/:role
 * Lấy nhân viên theo vai trò
 */
export const getEmployeesByRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.params as { role: string }
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await employeeService.getEmployeesByRole(role, page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách nhân viên theo vai trò thành công',
    data: result.employees,
    meta: result.pagination,
  })
})

/**
 * PATCH /api/employees/:id/toggle-status
 * Kích hoạt/Vô hiệu hóa nhân viên
 */
export const toggleEmployeeStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }

  const employee = await employeeService.toggleEmployeeStatus(id)

  res.status(200).json({
    status: 'OK',
    message: 'Cập nhật trạng thái nhân viên thành công',
    data: employee,
  })
})
