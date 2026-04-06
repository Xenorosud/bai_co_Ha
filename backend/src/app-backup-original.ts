/**
 * Restaurant Management System Backend
 * PostgreSQL + Prisma + Express.js - BACKUP VERSION
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Restaurant Management API Server đang chạy',
    database: 'PostgreSQL + Prisma',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// DISHES API - QUẢN LÝ MÓN ĂN
// ============================================

// GET All Dishes
app.get('/api/dishes', async (req: Request, res: Response) => {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        dishType: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'OK',
      message: 'Lấy danh sách món ăn thành công',
      data: dishes,
      meta: {
        page: 1,
        limit: 100,
        total: dishes.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách món ăn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ... (rest of the endpoints remain the same)

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🍽️  Restaurant Management API         ║
║  🗄️  PostgreSQL + Prisma ORM          ║
╚════════════════════════════════════════╝

🚀 Server: http://localhost:${PORT}
📊 Environment: ${process.env.NODE_ENV || 'development'}
🔄 CORS: ${CORS_ORIGIN}
💾 Database: PostgreSQL (restora)

✅ All endpoints connected to real database!
  `);
});

export default app;