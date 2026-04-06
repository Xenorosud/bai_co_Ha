# 🚀 HƯỚNG DẪN SETUP RESTORA - Restaurant Management System

> **Hướng dẫn chi tiết để setup và chạy hệ thống quản lý nhà hàng**

## 📋 **MỤC LỤC**

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt PostgreSQL Database](#cài-đặt-postgresql-database)
3. [Setup Backend](#setup-backend)
4. [Setup Frontend](#setup-frontend)
5. [Chạy ứng dụng](#chạy-ứng-dụng)
6. [Sử dụng hệ thống](#sử-dụng-hệ-thống)
7. [Troubleshooting](#troubleshooting)
8. [Thông tin kỹ thuật](#thông-tin-kỹ-thuật)

---

## 🔧 **YÊU CẦU HỆ THỐNG**

### **Phần mềm cần thiết:**

- **Node.js v18+**: [Download tại đây](https://nodejs.org/)
- **PostgreSQL v13+**: [Download tại đây](https://www.postgresql.org/download/)
- **Git**: [Download tại đây](https://git-scm.com/)
- **Code Editor**: VS Code (khuyên dùng)

### **Kiểm tra version:**

```bash
node --version    # Phải >= v18.0.0
npm --version     # Phải >= 8.0.0
psql --version    # Phải >= v13.0.0
```

---

## 🗄️ **CÀI ĐẶT POSTGRESQL DATABASE**

### **Bước 1: Cài đặt PostgreSQL**

1. Download PostgreSQL từ [trang chính thức](https://www.postgresql.org/download/)
2. Cài đặt với password cho user `postgres`
3. Mặc định port: `5432`

### **Bước 2: Tạo Database**

```bash
# Mở terminal/command prompt
psql -U postgres

# Trong psql terminal:
CREATE DATABASE restora;
\q
```

### **Bước 3: Kiểm tra kết nối**

```bash
# Test kết nối database
psql -U postgres -d restora
```

**✅ Nếu thành công:** Bạn sẽ thấy prompt `restora=#`

---

## ⚙️ **SETUP BACKEND**

### **Bước 1: Vào thư mục backend**

```bash
cd backend
```

### **Bước 2: Cài đặt dependencies**

```bash
npm install
```

### **Bước 3: Tạo file .env**

```bash
# Tạo file .env từ template
cp .env.example .env
```

### **Bước 4: Cấu hình .env**

Mở file `backend/.env` và sửa các thông số:

```bash
# Database Connection - Kết nối cơ sở dữ liệu
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/restora"

# JWT Secrets - Khóa bí mật JWT
JWT_SECRET="your-super-secret-jwt-key-2024-restora-system"
JWT_ACCESS_SECRET="restora-access-token-secret-2024-secure-key"
JWT_REFRESH_SECRET="restora-refresh-token-secret-2024-secure-key"

# Node Environment - Môi trường Node
NODE_ENV="development"

# Server Port - Cổng máy chủ
PORT=3001

# CORS Origin - Nguồn gốc CORS cho frontend
CORS_ORIGIN="http://localhost:5184"
```

**⚠️ LƯU Ý:** Thay `YOUR_PASSWORD` bằng password PostgreSQL của bạn

### **Bước 5: Setup Database Schema**

```bash
# Chạy Prisma migrations
npx prisma migrate dev

# Seed dữ liệu mẫu
npx prisma db seed
```

### **Bước 6: Kiểm tra Backend**

```bash
# Chạy development server
npm run dev
```

**✅ Nếu thành công:** Bạn sẽ thấy:

```
🚀 Server: http://localhost:3001
📊 Environment: development
🔄 CORS: http://localhost:5184
💾 Database: PostgreSQL (restora)
✅ All endpoints connected to real database!
```

---

## 🌐 **SETUP FRONTEND**

### **Bước 1: Mở terminal mới**

Giữ backend server đang chạy, mở terminal/command prompt mới

### **Bước 2: Vào thư mục frontend**

```bash
cd bai_co_Ha
```

### **Bước 3: Cài đặt dependencies**

```bash
npm install
```

### **Bước 4: Chạy Frontend**

```bash
npm run dev
```

**✅ Nếu thành công:** Bạn sẽ thấy:

```
VITE v6.3.5 ready in XXXms
➜ Local: http://localhost:5184/
```

**⚠️ LƯU Ý:** Port có thể khác (5184, 5185, etc.) tùy vào port nào đang trống

---

## 🎯 **CHẠY ỨNG DỤNG**

### **Bước 1: Đảm bảo cả 2 servers đang chạy**

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd bai_co_Ha
npm run dev
```

### **Bước 2: Truy cập ứng dụng**

- **🌐 Frontend:** http://localhost:5184 (hoặc port hiển thị)
- **🔧 API Backend:** http://localhost:3001
- **📊 Database Admin:** `npx prisma studio` (optional)

### **Bước 3: Kiểm tra CORS**

**⚠️ QUAN TRỌNG:** Nếu frontend chạy trên port khác 5184:

1. Ghi nhớ port frontend (VD: 5185)
2. Sửa file `backend/.env`:
   ```
   CORS_ORIGIN="http://localhost:5185"
   ```
3. Restart backend server (Ctrl+C rồi `npm run dev`)

---

## 🎨 **SỬ DỤNG HỆ THỐNG**

### **Trang chủ:**

- **URL:** http://localhost:5184
- **Tính năng:** Menu, About, Contact, Đặt bàn

### **Admin Panel:**

- **URL:** http://localhost:5184/admin
- **Tính năng:**
  - Dashboard với thống kê
  - Quản lý món ăn (CRUD)
  - Quản lý đơn hàng
  - Quản lý bàn
  - Quản lý đặt bàn
  - Quản lý nhân viên
  - Quản lý kho
  - Quản lý thanh toán

### **Các thao tác có thể:**

- ✅ **Thêm món ăn mới**
- ✅ **Sửa thông tin món ăn**
- ✅ **Xóa món ăn**
- ✅ **Quản lý tồn kho**
- ✅ **Theo dõi đơn hàng**
- ✅ **Quản lý bàn**

---

## 🔧 **TROUBLESHOOTING**

### **❌ Backend không chạy được**

**Lỗi:** `Error: connect ECONNREFUSED ::1:5432`

```bash
# Giải pháp: Kiểm tra PostgreSQL đang chạy
# Windows:
services.msc → Tìm PostgreSQL → Start

# Mac:
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

**Lỗi:** `Error: P1001: Can't reach database server`

```bash
# Giải pháp: Kiểm tra DATABASE_URL trong .env
# Đảm bảo username/password/port đúng
```

### **❌ Frontend không load được data**

**Lỗi:** `CORS policy: Access to XMLHttpRequest blocked`

```bash
# Giải pháp: Kiểm tra CORS_ORIGIN trong backend/.env
# Phải khớp với port của frontend

# VD: Frontend chạy port 5185
# Backend .env phải có: CORS_ORIGIN="http://localhost:5185"
```

**Lỗi:** `API Error 401 Unauthorized`

```bash
# Giải pháp: Authentication tạm thời đã được disable
# Nếu gặp lỗi này, liên hệ dev team
```

### **❌ Database lỗi**

**Lỗi:** `relation "dish" does not exist`

```bash
# Giải pháp: Chạy lại migration
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
npx prisma db seed
```

### **❌ Port bị chiếm**

**Lỗi:** `EADDRINUSE: address already in use :::3001`

```bash
# Windows: Kill process đang dùng port
netstat -ano | findstr :3001
taskkill /F /PID <PID_NUMBER>

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

---

## 📊 **THÔNG TIN KỸ THUẬT**

### **Cấu trúc Project:**

```
restora/
├── 📂 backend/              # Node.js + Express API
│   ├── src/app.ts          # Main server file
│   ├── prisma/schema.prisma # Database schema
│   └── .env                # Environment config
├── 📂 bai_co_Ha/           # React Frontend
│   ├── src/pages/          # React pages
│   └── src/services/       # API calls
└── 📂 docs/                # Documentation
```

### **Tech Stack:**

- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Shadcn/ui
- **Database:** PostgreSQL với Prisma ORM
- **Authentication:** JWT (đang trong giai đoạn phát triển)

### **API Endpoints chính:**

```bash
GET    /api/dishes          # Lấy danh sách món ăn
POST   /api/dishes          # Thêm món ăn mới
PUT    /api/dishes/:id      # Sửa món ăn
DELETE /api/dishes/:id      # Xóa món ăn

GET    /api/orders          # Lấy danh sách đơn hàng
GET    /api/tables          # Lấy danh sách bàn
GET    /api/inventory       # Lấy danh sách tồn kho
GET    /api/employees       # Lấy danh sách nhân viên
```

### **Database Schema:**

- **Users:** Thông tin người dùng và authentication
- **Employees:** Quản lý nhân viên với phân quyền
- **Dishes:** Món ăn với categories và pricing
- **Tables:** Bàn ăn với trạng thái và sức chứa
- **Orders:** Đơn hàng với chi tiết items
- **Inventory:** Quản lý tồn kho nguyên liệu
- **Reservations:** Đặt bàn trước

---

## 📝 **GHI CHÚ QUAN TRỌNG**

### **⚠️ Authentication Status:**

- Hiện tại authentication đã được **tạm thời disable** để test CRUD operations
- Tất cả admin functions đều có thể truy cập trực tiếp
- Sẽ implement đầy đủ JWT authentication trong phase tiếp theo

### **🔮 Tính năng đang phát triển:**

- Real-time authentication system
- Order status tracking
- Kitchen display interface
- Advanced reporting dashboard

### **👥 Team Development:**

- Backend API: Hoàn thành cơ bản ✅
- Frontend UI: Hoàn thành cơ bản ✅
- Database: Setup và seed data ✅
- Authentication: Đang phát triển 🚧

---

## 📞 **HỖ TRỢ**

Nếu gặp vấn đề, hãy kiểm tra:

1. **✅ Cả backend và frontend đều chạy**
2. **✅ PostgreSQL service đang hoạt động**
3. **✅ CORS_ORIGIN khớp với frontend port**
4. **✅ Database đã được migrate và seed**
5. **✅ Không có port conflicts**

**Logs quan trọng:**

- Backend logs: Terminal chạy `npm run dev` ở folder backend
- Frontend logs: Browser Developer Tools (F12) → Console
- Database logs: Prisma Studio hoặc pgAdmin

---

**🎯 Chúc bạn setup thành công! Nếu cần hỗ trợ thêm, hãy liên hệ team dev.**

**Made with ❤️ by RESTORA Team**
