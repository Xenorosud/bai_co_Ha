/**
 * Tables Service - Xử lý logic nghiệp vụ cho bàn
 */

import { prisma } from '../utils/database';
import { ApiError } from '../middleware/errorHandler';

/**
 * Lấy tất cả bàn có phân trang
 */
export async function getAllTables(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [tables, total] = await Promise.all([
      prisma.table.findMany({
        skip,
        take: limit,
        orderBy: { tableNumber: 'asc' },
      }),
      prisma.table.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      tables,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    };
  } catch (error) {
    console.error('Error in getAllTables:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

/**
 * Lấy bàn theo ID
 */
export async function getTableById(id: number) {
  try {
    const table = await prisma.table.findUnique({
      where: { id },
    });

    if (!table) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bàn');
    }

    return table;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error in getTableById:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

/**
 * Tạo bàn mới
 */
export async function createTable(data: {
  tableNumber: string;
  capacity: number;
  location?: string;
}) {
  try {
    const table = await prisma.table.create({
      data: {
        tableNumber: data.tableNumber,
        capacity: data.capacity,
        location: data.location || '',
        status: 'EMPTY',
      },
    });

    return table;
  } catch (error) {
    console.error('Error in createTable:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi tạo bàn');
  }
}

/**
 * Cập nhật bàn
 */
export async function updateTable(id: number, data: any) {
  try {
    const existingTable = await prisma.table.findUnique({ where: { id } });
    if (!existingTable) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bàn');
    }

    const table = await prisma.table.update({
      where: { id },
      data,
    });

    return table;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error in updateTable:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi cập nhật bàn');
  }
}

/**
 * Xóa bàn
 */
export async function deleteTable(id: number) {
  try {
    const existingTable = await prisma.table.findUnique({ where: { id } });
    if (!existingTable) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy bàn');
    }

    await prisma.table.delete({ where: { id } });
    return { id, message: 'Bàn đã được xóa' };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error in deleteTable:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi xóa bàn');
  }
}
