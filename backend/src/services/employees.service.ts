/**
 * Employees Service - Mock service
 */

import { prisma } from '../utils/database';
import { ApiError } from '../middleware/errorHandler';

export async function getAllEmployees(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        skip,
        take: limit,
        include: { user: true },
        orderBy: { name: 'asc' },
      }),
      prisma.employee.count(),
    ]);

    return {
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in getAllEmployees:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

export async function getEmployeeById(id: string) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function createEmployee(data: any) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function updateEmployee(id: string, data: any) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function deleteEmployee(id: string) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}
