/**
 * Restaurant Management System Backend
 * PostgreSQL + Prisma + Express.js - PURE VERSION
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, Role } from '@prisma/client';

// Import auth routes and middleware
import authRoutes from './routes/auth';
import { authenticateToken, requireRole, requirePermission } from './middleware/auth';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Helper function để map role từ frontend sang database
const mapRole = (roleFromFrontend: string): Role => {
  switch (roleFromFrontend) {
    case 'Administrator':
    case 'Admin':
      return 'ADMIN' as Role;
    case 'Manager':
      return 'MANAGER' as Role;
    case 'Server':
    case 'Waiter':
      return 'SERVER' as Role;
    case 'Customer':
      return 'CUSTOMER' as Role;
    default:
      return 'SERVER' as Role; // Default role
  }
};

// Helper function để validate price
const validatePrice = (price: any): number => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    throw new Error('Giá không hợp lệ');
  }
  // Max value for Decimal(10,2) is 99,999,999.99
  if (numPrice >= 100000000) {
    throw new Error('Giá quá lớn (tối đa 99,999,999.99)');
  }
  return numPrice;
};

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
// AUTHENTICATION ROUTES
// ============================================
app.use('/api/auth', authRoutes);

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

// POST Create Dish
app.post('/api/dishes', authenticateToken, requirePermission('dishes'), async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, typeId, availability } = req.body;

    // Check for duplicate dish name in the same category
    const existingDish = await prisma.dish.findFirst({
      where: {
        name: name.trim(),
        typeId: parseInt(typeId)
      }
    });

    if (existingDish) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Tên món ăn đã tồn tại trong danh mục này',
        error: 'DUPLICATE_DISH_NAME'
      });
    }

    // Validate và convert price
    const validPrice = validatePrice(price);

    const newDish = await prisma.dish.create({
      data: {
        name,
        description,
        price: validPrice,
        image,
        typeId: parseInt(typeId),
        availability: availability !== false
      },
      include: {
        dishType: true
      }
    });

    res.status(201).json({
      status: 'OK',
      message: 'Thêm món ăn thành công',
      data: newDish
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi thêm món ăn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT Update Dish
app.put('/api/dishes/:id', authenticateToken, requirePermission('dishes'), async (req: Request, res: Response) => {
  try {
    const dishId = parseInt(req.params.id);
    const { name, description, price, image, typeId, availability } = req.body;

    const updateData: any = {
      name,
      description,
      image,
      availability
    };

    // Only validate price if provided
    if (price !== undefined) {
      updateData.price = validatePrice(price);
    }

    // Only update typeId if provided
    if (typeId !== undefined) {
      updateData.typeId = parseInt(typeId);
    }

    const updatedDish = await prisma.dish.update({
      where: { id: dishId },
      data: updateData,
      include: {
        dishType: true
      }
    });

    res.json({
      status: 'OK',
      message: 'Cập nhật món ăn thành công',
      data: updatedDish
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật món ăn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE Dish
app.delete('/api/dishes/:id', authenticateToken, requirePermission('dishes'), async (req: Request, res: Response) => {
  try {
    const dishId = parseInt(req.params.id);

    await prisma.dish.delete({
      where: { id: dishId }
    });

    res.json({
      status: 'OK',
      message: 'Xóa món ăn thành công'
    });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xóa món ăn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================
// ORDERS API - QUẢN LÝ ĐƠN HÀNG
// ============================================

// GET All Orders
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        table: true,
        customer: true,
        employee: true,
        orderItems: {
          include: {
            dish: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend expectations
    const transformedOrders = orders.map(order => ({
      ...order,
      customerName: order.customer?.email || 'Khách lẻ',
      tableNumber: order.table?.number?.toString() || 'N/A'
    }));

    res.json({
      status: 'OK',
      message: 'Lấy danh sách đơn hàng thành công',
      data: transformedOrders,
      meta: {
        page: 1,
        limit: 100,
        total: orders.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách đơn hàng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST Create Order
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { tableId, customerId, employeeId, orderItems, subtotal, tax, total, deliveryType } = req.body;

    // Generate unique orderId
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderId,
        tableId: tableId ? parseInt(tableId) : null,
        customerId: customerId || null,
        employeeId: employeeId || 'emp_default',
        orderStatus: 'PENDING',
        subtotal: validatePrice(subtotal),
        tax: validatePrice(tax),
        total: validatePrice(total),
        deliveryType: deliveryType || 'DINE_IN',
        orderDate: new Date(),
        orderTime: new Date(),
        orderItems: {
          create: orderItems.map((item: any) => ({
            dishId: parseInt(item.dishId),
            quantity: parseInt(item.quantity),
            unitPrice: validatePrice(item.unitPrice),
            specialInstructions: item.specialInstructions
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            dish: true
          }
        },
        table: true
      }
    });

    res.status(201).json({
      status: 'OK',
      message: 'Tạo đơn hàng thành công',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi tạo đơn hàng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT Update Order
app.put('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const { orderStatus } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
        completedAt: orderStatus === 'COMPLETED' ? new Date() : null
      },
      include: {
        orderItems: {
          include: {
            dish: true
          }
        },
        table: true
      }
    });

    res.json({
      status: 'OK',
      message: 'Cập nhật đơn hàng thành công',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật đơn hàng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE Order
app.delete('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);

    // Delete order items first, then order
    await prisma.orderItem.deleteMany({
      where: { orderId }
    });

    await prisma.order.delete({
      where: { id: orderId }
    });

    res.json({
      status: 'OK',
      message: 'Xóa đơn hàng thành công'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xóa đơn hàng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================
// TABLES API - QUẢN LÝ BÀN
// ============================================

// GET All Tables
app.get('/api/tables', async (req: Request, res: Response) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {
        number: 'asc'
      }
    });

    // Transform data to match frontend expectations
    const transformedTables = tables.map(table => ({
      ...table,
      tableNumber: table.number.toString(),
      location: 'Tầng 1' // Default location since not in schema
    }));

    res.json({
      status: 'OK',
      message: 'Lấy danh sách bàn thành công',
      data: transformedTables,
      meta: {
        page: 1,
        limit: 100,
        total: tables.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST Create Table
app.post('/api/tables', async (req: Request, res: Response) => {
  try {
    const { number, capacity } = req.body;

    // Check for duplicate table number
    const existingTable = await prisma.table.findFirst({
      where: { number: parseInt(number) }
    });

    if (existingTable) {
      return res.status(400).json({
        status: 'ERROR',
        message: `Bàn số ${number} đã tồn tại`,
        error: 'DUPLICATE_TABLE_NUMBER'
      });
    }

    const newTable = await prisma.table.create({
      data: {
        number: parseInt(number),
        capacity: parseInt(capacity),
        status: 'EMPTY'
      }
    });

    res.status(201).json({
      status: 'OK',
      message: 'Thêm bàn thành công',
      data: {
        ...newTable,
        tableNumber: newTable.number.toString(),
        location: 'Tầng 1'
      }
    });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi thêm bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT Update Table
app.put('/api/tables/:id', async (req: Request, res: Response) => {
  try {
    const tableId = parseInt(req.params.id);
    const { number, capacity, status } = req.body;

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: {
        number: number ? parseInt(number) : undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        status
      }
    });

    res.json({
      status: 'OK',
      message: 'Cập nhật bàn thành công',
      data: {
        ...updatedTable,
        tableNumber: updatedTable.number.toString(),
        location: 'Tầng 1'
      }
    });
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE Table
app.delete('/api/tables/:id', async (req: Request, res: Response) => {
  try {
    const tableId = parseInt(req.params.id);

    await prisma.table.delete({
      where: { id: tableId }
    });

    res.json({
      status: 'OK',
      message: 'Xóa bàn thành công'
    });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xóa bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================
// RESERVATIONS API - QUẢN LÝ ĐẶT BÀN
// ============================================

// GET All Reservations
app.get('/api/reservations', async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        table: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'OK',
      message: 'Lấy danh sách đặt bàn thành công',
      data: reservations,
      meta: {
        page: 1,
        limit: 100,
        total: reservations.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách đặt bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST Create Reservation
app.post('/api/reservations', async (req: Request, res: Response) => {
  try {
    const { customerName, phone, email, reservationDate, reservationTime, guestCount, specialRequests } = req.body;

    const newReservation = await prisma.reservation.create({
      data: {
        customerName,
        phone,
        email,
        reservationDate: new Date(reservationDate),
        reservationTime: new Date(`${reservationDate}T${reservationTime}`),
        guestCount: parseInt(guestCount),
        specialRequests: specialRequests || null,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      status: 'OK',
      message: 'Đặt bàn thành công',
      data: newReservation
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi đặt bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT Update Reservation
app.put('/api/reservations/:id', async (req: Request, res: Response) => {
  try {
    const reservationId = parseInt(req.params.id);
    const { status, tableId } = req.body;

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status,
        tableId: tableId ? parseInt(tableId) : null,
        approvedAt: status === 'APPROVED' ? new Date() : null
      },
      include: {
        table: true
      }
    });

    res.json({
      status: 'OK',
      message: 'Cập nhật đặt bàn thành công',
      data: updatedReservation
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật đặt bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE Reservation
app.delete('/api/reservations/:id', async (req: Request, res: Response) => {
  try {
    const reservationId = parseInt(req.params.id);

    await prisma.reservation.delete({
      where: { id: reservationId }
    });

    res.json({
      status: 'OK',
      message: 'Xóa đặt bàn thành công'
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xóa đặt bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================
// INVENTORY API - QUẢN LÝ KHO
// ============================================

// GET All Inventory
app.get('/api/inventory', async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      include: {
        supplier: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend expectations
    const transformedInventory = inventory.map(item => ({
      ...item,
      itemName: item.name,
      currentStock: item.quantity,
      minStock: item.minStock,
      status: parseFloat(item.quantity.toString()) <= parseFloat(item.minStock.toString()) ? 'LOW' : 'GOOD'
    }));

    res.json({
      status: 'OK',
      message: 'Lấy danh sách kho thành công',
      data: transformedInventory,
      meta: {
        page: 1,
        limit: 100,
        total: inventory.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách kho',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST Create Inventory Item
app.post('/api/inventory', async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, unit, minStock, supplierId } = req.body;

    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        quantity: parseFloat(quantity),
        unit,
        minStock: parseFloat(minStock),
        supplierId: supplierId ? parseInt(supplierId) : null,
        lastRestocked: new Date()
      },
      include: {
        supplier: true
      }
    });

    res.status(201).json({
      status: 'OK',
      message: 'Thêm sản phẩm thành công',
      data: {
        ...newItem,
        itemName: newItem.name,
        currentStock: newItem.quantity,
        status: 'GOOD'
      }
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi thêm sản phẩm',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT Update Inventory Item
app.put('/api/inventory/:id', async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);
    const { name, category, quantity, unit, minStock, supplierId } = req.body;

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        name,
        category,
        quantity: quantity ? parseFloat(quantity) : undefined,
        unit,
        minStock: minStock ? parseFloat(minStock) : undefined,
        supplierId: supplierId ? parseInt(supplierId) : null
      },
      include: {
        supplier: true
      }
    });

    res.json({
      status: 'OK',
      message: 'Cập nhật kho thành công',
      data: {
        ...updatedItem,
        itemName: updatedItem.name,
        currentStock: updatedItem.quantity,
        status: parseFloat(updatedItem.quantity.toString()) <= parseFloat(updatedItem.minStock.toString()) ? 'LOW' : 'GOOD'
      }
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật kho',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE Inventory Item
app.delete('/api/inventory/:id', async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);

    await prisma.inventoryItem.delete({
      where: { id: itemId }
    });

    res.json({
      status: 'OK',
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xóa sản phẩm',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================
// EMPLOYEES API - QUẢN LÝ NHÂN VIÊN
// ============================================

// GET All Employees
app.get('/api/employees', async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'OK',
      message: 'Lấy danh sách nhân viên thành công',
      data: employees,
      meta: {
        page: 1,
        limit: 100,
        total: employees.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách nhân viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST Create Employee
app.post('/api/employees', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, role, permissions } = req.body;

    // Check for duplicate email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUserByEmail) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Email đã tồn tại trong hệ thống',
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Check for duplicate phone number
    const existingEmployeeByPhone = await prisma.employee.findFirst({
      where: { phone: phone }
    });

    if (existingEmployeeByPhone) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Số điện thoại đã được sử dụng bởi nhân viên khác',
        error: 'DUPLICATE_PHONE'
      });
    }

    // Direct role mapping để đảm bảo hoạt động
    let finalRole: Role = 'SERVER';
    if (role === 'Administrator' || role === 'Admin') {
      finalRole = 'ADMIN';
    } else if (role === 'Manager') {
      finalRole = 'MANAGER';
    } else if (role === 'Server' || role === 'Waiter') {
      finalRole = 'SERVER';
    } else if (role === 'Customer') {
      finalRole = 'CUSTOMER';
    }

    console.log('Role mapping:', role, '->', finalRole);

    // First create user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: 'default_hash', // Should be properly hashed in production
        role: finalRole
      }
    });

    // Then create employee with proper permissions structure
    const defaultPermissions = permissions || {
      dishes: finalRole === 'ADMIN',
      orders: true,
      tables: true,
      reservations: true,
      inventory: finalRole === 'ADMIN' || finalRole === 'MANAGER',
      employees: finalRole === 'ADMIN',
      payments: finalRole === 'ADMIN' || finalRole === 'MANAGER',
      reports: finalRole === 'ADMIN' || finalRole === 'MANAGER'
    };

    const newEmployee = await prisma.employee.create({
      data: {
        userId: newUser.id,
        name,
        phone,
        hireDate: new Date(),
        permissions: defaultPermissions,
        status: 'ACTIVE'
      },
      include: {
        user: true
      }
    });

    res.status(201).json({
      status: 'OK',
      message: 'Thêm nhân viên thành công',
      data: newEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi thêm nhân viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT Update Employee
app.put('/api/employees/:id', async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id; // Using string ID from schema
    const { name, phone, permissions, status } = req.body;

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        name,
        phone,
        permissions,
        status
      },
      include: {
        user: true
      }
    });

    res.json({
      status: 'OK',
      message: 'Cập nhật nhân viên thành công',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật nhân viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE Employee
app.delete('/api/employees/:id', async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;

    // Get employee to find associated user
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (employee) {
      // Delete employee first (cascade will handle relations)
      await prisma.employee.delete({
        where: { id: employeeId }
      });

      // Delete associated user
      await prisma.user.delete({
        where: { id: employee.userId }
      });
    }

    res.json({
      status: 'OK',
      message: 'Xóa nhân viên thành công'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xóa nhân viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================
// TRANSACTIONS API - QUẢN LÝ GIAO DỊCH
// ============================================

// GET All Transactions
app.get('/api/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        order: true,
        invoice: true,
        employee: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'OK',
      message: 'Lấy danh sách giao dịch thành công',
      data: transactions,
      meta: {
        page: 1,
        limit: 100,
        total: transactions.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách giao dịch',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST Create Transaction
app.post('/api/transactions', async (req: Request, res: Response) => {
  try {
    const { orderId, amount, paymentMethod, processedBy } = req.body;

    const transactionId = `TXN-${Date.now().toString().slice(-5)}`;

    const newTransaction = await prisma.transaction.create({
      data: {
        transactionId,
        orderId: parseInt(orderId),
        amount: validatePrice(amount),
        paymentMethod,
        processedBy: processedBy || 'emp_default',
        transactionStatus: 'COMPLETED',
        transactionDate: new Date(),
        transactionTime: new Date()
      },
      include: {
        order: true,
        employee: true
      }
    });

    res.status(201).json({
      status: 'OK',
      message: 'Tạo giao dịch thành công',
      data: newTransaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi tạo giao dịch',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================
// SPECIAL ENDPOINTS - CÁC API ĐẶC BIỆT
// ============================================

// GET Low Stock Inventory
app.get('/api/inventory/status/low', async (req: Request, res: Response) => {
  try {
    const lowStockItems = await prisma.inventoryItem.findMany({
      where: {
        quantity: {
          lte: prisma.inventoryItem.fields.minStock
        }
      },
      include: {
        supplier: true
      }
    });

    const transformedItems = lowStockItems.map(item => ({
      ...item,
      status: 'LOW'
    }));

    res.json({
      status: 'OK',
      message: 'Lấy danh sách sản phẩm sắp hết hàng thành công',
      data: transformedItems,
      meta: {
        page: 1,
        limit: 100,
        total: transformedItems.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách sản phẩm sắp hết hàng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET Critical Stock Inventory
app.get('/api/inventory/status/critical', async (req: Request, res: Response) => {
  try {
    const criticalStockItems = await prisma.inventoryItem.findMany({
      where: {
        quantity: {
          lte: 5 // Items với quantity <= 5 được coi là critical
        }
      },
      include: {
        supplier: true
      }
    });

    const transformedItems = criticalStockItems.map(item => ({
      ...item,
      status: 'CRITICAL'
    }));

    res.json({
      status: 'OK',
      message: 'Lấy danh sách sản phẩm nguy cấp thành công',
      data: transformedItems,
      meta: {
        page: 1,
        limit: 100,
        total: transformedItems.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching critical stock items:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách sản phẩm nguy cấp',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET Tables for Guests
app.get('/api/tables/for-guests/:guestCount', async (req: Request, res: Response) => {
  try {
    const guestCount = parseInt(req.params.guestCount);

    const availableTables = await prisma.table.findMany({
      where: {
        capacity: {
          gte: guestCount
        },
        status: 'EMPTY'
      },
      orderBy: {
        capacity: 'asc'
      }
    });

    const transformedTables = availableTables.map(table => ({
      ...table,
      tableNumber: table.number.toString(),
      location: 'Tầng 1'
    }));

    res.json({
      status: 'OK',
      message: 'Lấy danh sách bàn phù hợp thành công',
      data: transformedTables,
      meta: {
        page: 1,
        limit: 100,
        total: transformedTables.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching available tables:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách bàn phù hợp',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST Reservation Actions
app.post('/api/reservations/:id/approve', async (req: Request, res: Response) => {
  try {
    const reservationId = parseInt(req.params.id);
    const { tableId } = req.body;

    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'APPROVED',
        tableId: tableId ? parseInt(tableId) : null,
        approvedAt: new Date()
      }
    });

    res.json({
      status: 'OK',
      message: 'Xác nhận đặt bàn thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi xác nhận đặt bàn'
    });
  }
});

app.post('/api/reservations/:id/deny', async (req: Request, res: Response) => {
  try {
    const reservationId = parseInt(req.params.id);

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'DENIED' }
    });

    res.json({
      status: 'OK',
      message: 'Từ chối đặt bàn thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi từ chối đặt bàn'
    });
  }
});

app.post('/api/reservations/:id/complete', async (req: Request, res: Response) => {
  try {
    const reservationId = parseInt(req.params.id);

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'COMPLETED' }
    });

    res.json({
      status: 'OK',
      message: 'Hoàn thành đặt bàn thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi hoàn thành đặt bàn'
    });
  }
});

app.post('/api/reservations/:id/cancel', async (req: Request, res: Response) => {
  try {
    const reservationId = parseInt(req.params.id);

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'CANCELLED' }
    });

    res.json({
      status: 'OK',
      message: 'Hủy đặt bàn thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi hủy đặt bàn'
    });
  }
});

// POST Employee Actions
app.post('/api/employees/:id/toggle-status', async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (employee) {
      const newStatus = employee.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      await prisma.employee.update({
        where: { id: employeeId },
        data: { status: newStatus }
      });
    }

    res.json({
      status: 'OK',
      message: 'Cập nhật trạng thái nhân viên thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi cập nhật trạng thái nhân viên'
    });
  }
});

// GET Invoices (from transactions)
app.get('/api/transactions/invoices', async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                dish: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'OK',
      message: 'Lấy danh sách hóa đơn thành công',
      data: invoices,
      meta: {
        page: 1,
        limit: 100,
        total: invoices.length,
        totalPages: 1,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi khi lấy danh sách hóa đơn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Gracefully close Prisma connection on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Start Server
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
🔧 FIXED: Role mapping và Price validation
  `);
});

export default app;