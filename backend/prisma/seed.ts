/**
 * File Seed Data - Hạt giống cơ sở dữ liệu
 * Chạy: npx ts-node prisma/seed.ts
 * Hoặc: npm run prisma:seed
 *
 * File này tạo dữ liệu mẫu cho các bảng chính trong hệ thống
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu hạt giống cơ sở dữ liệu...')

  try {
    // ============================================
    // 1. TẠO LOẠI MÓN ĂN (DISH TYPES)
    // ============================================
    console.log('📝 Tạo loại món ăn...')
    const dishTypes = await Promise.all([
      prisma.dishType.create({
        data: {
          name: 'Khai vị',
          description: 'Các món khai vị ngon miệng để bắt đầu bữa ăn',
        },
      }),
      prisma.dishType.create({
        data: {
          name: 'Món chính',
          description: 'Các món chính đặc sắc của nhà hàng',
        },
      }),
      prisma.dishType.create({
        data: {
          name: 'Tráng miệng',
          description: 'Các món tráng miệng ngọt để kết thúc bữa ăn',
        },
      }),
      prisma.dishType.create({
        data: {
          name: 'Thức uống',
          description: 'Các loại nước uống tươi mát',
        },
      }),
    ])
    console.log(`✅ Tạo ${dishTypes.length} loại món ăn`)

    // ============================================
    // 2. TẠO MÓN ĂN (DISHES)
    // ============================================
    console.log('🍽️ Tạo các món ăn...')
    const dishes = await Promise.all([
      // Khai vị
      prisma.dish.create({
        data: {
          name: 'Gỏi cuốn tôm thịt',
          description: 'Gỏi cuốn tươi ngon với tôm và thịt heo, ăn kèm tương chấm',
          price: 45000,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
          typeId: dishTypes[0].id, // Khai vị
          availability: true,
        },
      }),
      prisma.dish.create({
        data: {
          name: 'Chả cá Lã Vọng',
          description: 'Chả cá truyền thống Hà Nội với bánh tráng và rau thơm',
          price: 120000,
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500',
          typeId: dishTypes[0].id,
          availability: true,
        },
      }),
      // Món chính
      prisma.dish.create({
        data: {
          name: 'Phở Bò Tái',
          description: 'Phở bò truyền thống với thịt bò tái tươi ngon',
          price: 85000,
          image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500',
          typeId: dishTypes[1].id, // Món chính
          availability: true,
        },
      }),
      prisma.dish.create({
        data: {
          name: 'Bún bò Huế',
          description: 'Bún bò Huế cay nồng đặc trưng miền Trung',
          price: 75000,
          image: 'https://images.unsplash.com/photo-1569714807459-5d7ad0e2f3?w=500',
          typeId: dishTypes[1].id,
          availability: true,
        },
      }),
      prisma.dish.create({
        data: {
          name: 'Cơm tấm sườn nướng',
          description: 'Cơm tấm với sườn nướng thơm lừng, ăn kèm nước mắm pha',
          price: 65000,
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500',
          typeId: dishTypes[1].id,
          availability: true,
        },
      }),
      // Tráng miệng
      prisma.dish.create({
        data: {
          name: 'Chè đậu xanh',
          description: 'Chè đậu xanh mát lạnh, thêm thạch và nước cốt dừa',
          price: 25000,
          image: 'https://images.unsplash.com/photo-1563379091339-03246963d117?w=500',
          typeId: dishTypes[2].id, // Tráng miệng
          availability: true,
        },
      }),
      prisma.dish.create({
        data: {
          name: 'Bánh flan caramen',
          description: 'Bánh flan mềm mịn với lớp caramen đậm đà',
          price: 30000,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
          typeId: dishTypes[2].id,
          availability: true,
        },
      }),
      // Thức uống
      prisma.dish.create({
        data: {
          name: 'Cà phê sữa đá',
          description: 'Cà phê phin truyền thống với sữa đặc, uống đá',
          price: 35000,
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500',
          typeId: dishTypes[3].id, // Thức uống
          availability: true,
        },
      }),
      prisma.dish.create({
        data: {
          name: 'Trà chanh mật ong',
          description: 'Trà xanh tươi mát với chanh tươi và mật ong',
          price: 28000,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500',
          typeId: dishTypes[3].id,
          availability: true,
        },
      }),
    ])
    console.log(`✅ Tạo ${dishes.length} món ăn`)

    // ============================================
    // 3. TẠO NHÀ CUNG CẤP (SUPPLIERS)
    // ============================================
    console.log('🏢 Tạo nhà cung cấp...')
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: {
          name: 'Công ty Thực phẩm Sạch Việt Nam',
          phone: '0901234567',
          email: 'info@thucphamsach.vn',
          address: '123 Đường Nguyễn Trãi',
          city: 'Hà Nội',
          state: 'Hà Nội',
          zipCode: '10000',
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'Trang trại Rau Sạch Đà Lạt',
          phone: '0912345678',
          email: 'contact@rausachdalat.vn',
          address: '456 Đường Trần Hưng Đạo',
          city: 'Đà Lạt',
          state: 'Lâm Đồng',
          zipCode: '73000',
        },
      }),
    ])
    console.log(`✅ Tạo ${suppliers.length} nhà cung cấp`)

    // ============================================
    // 4. TẠO KHOÁ (INVENTORY ITEMS)
    // ============================================
    console.log('📦 Tạo các mục kho...')
    const inventoryItems = await Promise.all([
      prisma.inventoryItem.create({
        data: {
          name: 'Thịt bò Úc',
          category: 'MEAT',
          quantity: 50,
          unit: 'kg',
          minStock: 20,
          supplierId: suppliers[0].id,
          lastRestocked: new Date(),
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Bánh phở tươi',
          category: 'PASTA',
          quantity: 100,
          unit: 'kg',
          minStock: 30,
          supplierId: suppliers[0].id,
          lastRestocked: new Date(),
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Rau xà lách tươi',
          category: 'VEGETABLES',
          quantity: 15,
          unit: 'kg',
          minStock: 20, // Set this to show LOW stock
          supplierId: suppliers[1].id,
          lastRestocked: new Date(),
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Tôm sú tươi',
          category: 'SEAFOOD',
          quantity: 25,
          unit: 'kg',
          minStock: 10,
          supplierId: suppliers[0].id,
          lastRestocked: new Date(),
        },
      }),
    ])
    console.log(`✅ Tạo ${inventoryItems.length} mục kho`)

    // ============================================
    // 5. TẠO BẢNG (TABLES)
    // ============================================
    console.log('🪑 Tạo các bàn...')
    const tables = await Promise.all([
      prisma.table.create({ data: { number: 1, capacity: 2, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 2, capacity: 2, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 3, capacity: 4, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 4, capacity: 4, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 5, capacity: 6, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 6, capacity: 6, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 7, capacity: 8, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 8, capacity: 8, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 9, capacity: 10, status: 'EMPTY' } }),
      prisma.table.create({ data: { number: 10, capacity: 10, status: 'EMPTY' } }),
    ])
    console.log(`✅ Tạo ${tables.length} bàn`)

    // ============================================
    // 6. TẠO NGƯỜI DÙNG & NHÂN VIÊN (USERS & EMPLOYEES)
    // ============================================
    console.log('👤 Tạo người dùng và nhân viên...')

    // Admin user
    const adminPassword = await bcrypt.hash('123456', 10)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@restora.com',
        passwordHash: adminPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    })

    const adminEmployee = await prisma.employee.create({
      data: {
        userId: adminUser.id,
        name: 'Quản trị viên hệ thống',
        phone: '0901111111',
        hireDate: new Date('2024-01-01'),
        permissions: {
          dishes: true,
          orders: true,
          tables: true,
          reservations: true,
          inventory: true,
          employees: true,
          payments: true,
          reports: true
        },
        status: 'ACTIVE',
      },
    })

    // Manager user
    const managerPassword = await bcrypt.hash('123456', 10)
    const managerUser = await prisma.user.create({
      data: {
        email: 'manager@restora.com',
        passwordHash: managerPassword,
        role: 'MANAGER',
        status: 'ACTIVE',
      },
    })

    const managerEmployee = await prisma.employee.create({
      data: {
        userId: managerUser.id,
        name: 'Nguyễn Văn Quản Lý',
        phone: '0902222222',
        hireDate: new Date('2024-02-01'),
        permissions: {
          dishes: true,
          orders: true,
          tables: true,
          reservations: true,
          inventory: true,
          employees: false,
          payments: true,
          reports: true
        },
        status: 'ACTIVE',
      },
    })

    // Server user 1
    const serverPassword = await bcrypt.hash('123456', 10)
    const serverUser1 = await prisma.user.create({
      data: {
        email: 'server1@restora.com',
        passwordHash: serverPassword,
        role: 'SERVER',
        status: 'ACTIVE',
      },
    })

    const serverEmployee1 = await prisma.employee.create({
      data: {
        userId: serverUser1.id,
        name: 'Trần Thị Phục Vụ',
        phone: '0903333333',
        hireDate: new Date('2024-03-01'),
        permissions: {
          dishes: false,
          orders: true,
          tables: true,
          reservations: true,
          inventory: false,
          employees: false,
          payments: false,
          reports: false
        },
        status: 'ACTIVE',
      },
    })

    // Customer user (khách hàng có tài khoản)
    const customerPassword = await bcrypt.hash('123456', 10)
    const customerUser = await prisma.user.create({
      data: {
        email: 'customer@restora.com',
        passwordHash: customerPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
    })

    console.log(`✅ Tạo 5 người dùng (1 admin, 1 manager, 1 server, 1 khách hàng)`)

    // ============================================
    // HOÀN THÀNH
    // ============================================
    console.log(`
╔════════════════════════════════════════╗
║  ✅ Hạt giống cơ sở dữ liệu hoàn thành ║
╚════════════════════════════════════════╝

📊 Dữ liệu đã tạo:
  - ${dishTypes.length} loại món ăn
  - ${dishes.length} món ăn
  - ${suppliers.length} nhà cung cấp
  - ${inventoryItems.length} mục kho
  - ${tables.length} bàn
  - 5 người dùng (Admin, Manager, Server, Customer)

🔑 Thông tin đăng nhập:
  Admin:    admin@restora.com / 123456
  Manager:  manager@restora.com / 123456
  Server:   server1@restora.com / 123456
  Customer: customer@restora.com / 123456
    `)
  } catch (error) {
    console.error('❌ Lỗi khi hạt giống cơ sở dữ liệu:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
