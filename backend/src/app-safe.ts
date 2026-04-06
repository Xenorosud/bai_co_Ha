/**
 * Restaurant Management System Backend - Safe Version
 * PostgreSQL + Prisma với Mock Data Fallback
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Mock Data - Fallback khi Prisma không available
const mockDishes = [
  {
    id: 1,
    name: "Phở Bò Tái",
    description: "Phở bò tái truyền thống với nước dùng thanh ngọt",
    price: 65.0,
    image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12",
    typeId: 1,
    availability: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    dishType: { id: 1, name: "Món chính" }
  },
  {
    id: 2,
    name: "Bánh Mì Thịt Nướng",
    description: "Bánh mì với thịt nướng thơm lừng, rau sống tươi ngon",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    typeId: 2,
    availability: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    dishType: { id: 2, name: "Khai vị" }
  }
];

const mockOrders = [];
const mockTables = [
  {
    id: 1,
    number: "1",
    capacity: 4,
    location: "Tầng 1",
    status: "EMPTY",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  }
];

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5180';

// Initialize Prisma Client - với error handling
let prisma: any = null;
let isPrismaConnected = false;

async function initializePrisma() {
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    await prisma.$connect();
    isPrismaConnected = true;
    console.log('✅ PostgreSQL connected via Prisma');
  } catch (error) {
    console.log('❌ Prisma unavailable, using mock data:', error?.message);
    isPrismaConnected = false;
  }
}

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
    database: isPrismaConnected ? 'PostgreSQL + Prisma' : 'Mock Data Fallback',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// DISHES API - QUẢN LÝ MÓN ĂN
// ============================================

// GET All Dishes
app.get('/api/dishes', async (req: Request, res: Response) => {
  try {
    let dishes;

    if (isPrismaConnected && prisma) {
      dishes = await prisma.dish.findMany({
        include: {
          dishType: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      dishes = mockDishes;
    }

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
  } catch (error: any) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách món ăn',
      error: error.message
    });
  }
});

// POST Create Dish
app.post('/api/dishes', async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, typeId, availability } = req.body;

    let newDish;

    if (isPrismaConnected && prisma) {
      newDish = await prisma.dish.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          image,
          typeId: parseInt(typeId),
          availability: availability || true
        },
        include: {
          dishType: true
        }
      });
    } else {
      // Mock creation
      newDish = {
        id: mockDishes.length + 1,
        name, description,
        price: parseFloat(price),
        image, typeId: parseInt(typeId),
        availability: availability || true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dishType: { id: parseInt(typeId), name: "Mặc định" }
      };
      mockDishes.push(newDish);
    }

    res.json({
      status: 'OK',
      message: 'Thêm món ăn thành công',
      data: newDish
    });
  } catch (error: any) {
    console.error('Error creating dish:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi thêm món ăn',
      error: error.message
    });
  }
});

// PUT Update Dish
app.put('/api/dishes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, typeId, availability } = req.body;

    let updatedDish;

    if (isPrismaConnected && prisma) {
      updatedDish = await prisma.dish.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          image,
          typeId: parseInt(typeId),
          availability
        },
        include: {
          dishType: true
        }
      });
    } else {
      // Mock update
      const index = mockDishes.findIndex(d => d.id === parseInt(id));
      if (index !== -1) {
        mockDishes[index] = {
          ...mockDishes[index],
          name, description,
          price: parseFloat(price),
          image, typeId: parseInt(typeId),
          availability,
          updatedAt: new Date().toISOString()
        };
        updatedDish = mockDishes[index];
      } else {
        throw new Error('Dish not found');
      }
    }

    res.json({
      status: 'OK',
      message: 'Cập nhật món ăn thành công',
      data: updatedDish
    });
  } catch (error: any) {
    console.error('Error updating dish:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật món ăn',
      error: error.message
    });
  }
});

// DELETE Dish
app.delete('/api/dishes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isPrismaConnected && prisma) {
      await prisma.dish.delete({
        where: { id: parseInt(id) }
      });
    } else {
      // Mock delete
      const index = mockDishes.findIndex(d => d.id === parseInt(id));
      if (index !== -1) {
        mockDishes.splice(index, 1);
      }
    }

    res.json({
      status: 'OK',
      message: 'Xóa món ăn thành công'
    });
  } catch (error: any) {
    console.error('Error deleting dish:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xóa món ăn',
      error: error.message
    });
  }
});

// ============================================
// TABLES API - QUẢN LÝ BÀN
// ============================================

app.get('/api/tables', async (req: Request, res: Response) => {
  try {
    let tables;

    if (isPrismaConnected && prisma) {
      tables = await prisma.table.findMany({
        orderBy: { number: 'asc' }
      });
    } else {
      tables = mockTables;
    }

    res.json({
      status: 'OK',
      message: 'Lấy danh sách bàn thành công',
      data: tables,
      meta: {
        page: 1,
        limit: 100,
        total: tables.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error: any) {
    console.error('Error fetching tables:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách bàn',
      error: error.message
    });
  }
});

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  await initializePrisma();

  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên port ${PORT}`);
    console.log(`🌐 CORS: ${CORS_ORIGIN}`);
    console.log(`💾 Database: ${isPrismaConnected ? 'PostgreSQL' : 'Mock Data'}`);
  });
}

startServer().catch(console.error);

export default app;