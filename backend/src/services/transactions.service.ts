/**
 * Transactions Service - Mock service
 */

import { prisma } from '../utils/database';
import { ApiError } from '../middleware/errorHandler';

export async function getAllTransactions(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        skip,
        take: limit,
        include: { 
          invoice: true,
          order: true,
          processedByEmployee: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count(),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in getAllTransactions:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

export async function getTransactionById(id: number) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function createTransaction(data: any) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}
