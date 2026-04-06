# 🍽️ Hệ thống Quản lý Nhà hàng RESTORA

## 📋 **Giới thiệu**

Hệ thống quản lý nhà hàng RESTORA là một ứng dụng web full-stack được xây dựng để quản lý toàn bộ hoạt động của nhà hàng, bao gồm:

- 🍴 Quản lý thực đơn và món ăn
- 👥 Quản lý nhân viên và phân quyền
- 🪑 Quản lý bàn ăn và đặt chỗ
- 📦 Quản lý kho hàng và nguyên liệu
- 💰 Quản lý thanh toán và giao dịch
- 📊 Báo cáo doanh thu và thống kê

## 🏗️ **Cấu trúc dự án**

```
d:/coha/
├── backend/                 # Server API (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── app.ts          # Main server file với tất cả API endpoints
│   │   ├── utils/
│   │   │   └── auth.ts     # JWT authentication utilities
│   │   └── middleware/
│   │       └── auth.ts     # Authentication middleware
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── .env               # Environment variables
│   └── package.json
├── bai_co_Ha/              # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── pages/          # Trang chính
│   │   ├── app/components/ # Reusable components
│   │   ├── services/       # API services
│   │   └── utils/          # Validation utilities
│   └── package.json
└── README.md              # File này
```

## 🚀 **Cài đặt và chạy hệ thống**

### **Yêu cầu hệ thống:**

- Node.js (v18 trở lên)
- PostgreSQL (v13 trở lên)
- npm hoặc yarn

### **Bước 1: Cài đặt Backend**

```bash
cd backend
npm install

# Tạo database PostgreSQL
createdb restora

# Cấu hình .env
cp .env.example .env
# Chỉnh sửa DATABASE_URL trong .env

# Chạy migrations
npx prisma migrate dev
npx prisma generate

# Start server
npm run dev
```

### **Bước 2: Cài đặt Frontend**

```bash
cd bai_co_Ha
npm install

# Start development server
npm run dev
```

### **Bước 3: Truy cập ứng dụng**

- **Frontend:** http://localhost:5183
- **Backend API:** http://localhost:3001
- **Admin Login:** Sử dụng email/password của nhân viên có quyền Admin

## 👤 **Hướng dẫn sử dụng**

### **🔐 Đăng nhập hệ thống**

1. Vào trang chủ: http://localhost:5183
2. Click "Đăng nhập" hoặc truy cập trực tiếp `/admin/login`
3. Nhập email/password của nhân viên
4. Hệ thống sẽ chuyển đến dashboard dựa trên quyền hạn

### **📊 Dashboard chính**

Sau khi đăng nhập, bạn sẽ thấy dashboard với:

- 📈 Thống kê tổng quan (doanh thu, đơn hàng, khách hàng)
- 🔥 Top món ăn bán chạy
- 📋 Đơn hàng gần đây
- ⚠️ Thông báo tồn kho thấp

### **🍽️ Quản lý món ăn**

**Đường dẫn:** `/admin/food-management`

**Chức năng:**

- ✅ Thêm món ăn mới
- ✅ Chỉnh sửa thông tin món ăn
- ✅ Xóa món ăn
- ✅ Tìm kiếm món ăn theo tên
- ✅ Phân loại theo danh mục

**Hướng dẫn thêm món ăn:**

1. Click nút "Thêm món ăn"
2. Điền thông tin:
   - Tên món ăn (bắt buộc)
   - Danh mục (bắt buộc)
   - Giá tiền (tối đa 99,999,999 VND)
   - URL hình ảnh
   - Mô tả món ăn
3. Click "Lưu" để hoàn tất

### **👥 Quản lý nhân viên**

**Đường dẫn:** `/admin/workers-management`

**Chức năng:**

- ✅ Thêm nhân viên mới với phân quyền
- ✅ Cập nhật thông tin nhân viên
- ✅ Kích hoạt/vô hiệu hóa tài khoản
- ✅ Quản lý phân quyền chi tiết

**Vai trò nhân viên:**

- **Administrator:** Toàn quyền, quản lý tất cả
- **Manager:** Quản lý vận hành, báo cáo
- **Server:** Phục vụ bàn, nhận đơn hàng

**Hướng dẫn thêm nhân viên:**

1. Click "Thêm nhân viên"
2. Điền thông tin cơ bản:
   - Họ tên (bắt buộc)
   - Email (bắt buộc, duy nhất)
   - Số điện thoại (format VN: 0xxxxxxxxx)
   - Ngày nhận việc (không được trong tương lai)
   - Vai trò
3. Cấu hình phân quyền cho từng module
4. Click "Lưu"

### **🪑 Quản lý bàn ăn**

**Đường dẫn:** `/admin/table-management`

**Chức năng:**

- ✅ Thêm/xóa/sửa bàn ăn
- ✅ Theo dõi trạng thái bàn (Trống/Có khách/Đã đặt)
- ✅ Quản lý sức chứa bàn

**Trạng thái bàn:**

- 🟢 **EMPTY:** Bàn trống, sẵn sàng
- 🔴 **OCCUPIED:** Có khách đang ngồi
- 🟡 **RESERVED:** Đã được đặt trước
- 🔧 **MAINTENANCE:** Đang bảo trì

### **📋 Quản lý đặt bàn**

**Đường dẫn:** `/admin/reservation-management`

**Chức năng:**

- ✅ Xem danh sách đặt bàn
- ✅ Tìm kiếm theo tên khách hàng/SĐT
- ✅ Lọc theo trạng thái và ngày
- ✅ Xác nhận/hủy đặt bàn

### **📦 Quản lý kho**

**Đường dẫn:** `/admin/inventory-management`

**Chức năng:**

- ✅ Quản lý nguyên liệu và đồ dùng
- ✅ Theo dõi tồn kho và cảnh báo hết hàng
- ✅ Nhập hàng (restock)
- ✅ Phân loại theo danh mục

**Danh mục kho:**

- 🥩 **MEAT:** Thịt các loại
- 🐟 **SEAFOOD:** Hải sản
- 🥬 **VEGETABLES:** Rau xanh
- 🌾 **GRAINS:** Ngũ cốc
- 🥛 **DAIRY:** Sữa và chế phẩm
- 🍯 **CONDIMENTS:** Gia vị, nước sốt
- 🧻 **SUPPLIES:** Đồ dùng nhà bếp

### **💰 Quản lý thanh toán**

**Đường dẫn:** `/admin/payment-management`

**Chức năng:**

- ✅ Xem lịch sử giao dịch
- ✅ Theo dõi doanh thu theo ngày/tháng
- ✅ Quản lý các phương thức thanh toán
- ✅ In hóa đơn và receipt

**Phương thức thanh toán:**

- 💵 **CASH:** Tiền mặt
- 💳 **CARD:** Thẻ tín dụng/ghi nợ
- 📱 **DIGITAL:** Ví điện tử (Momo, ZaloPay...)
- 🏦 **TRANSFER:** Chuyển khoản

### **📊 Báo cáo và thống kê**

- **Doanh thu theo ngày/tháng/năm**
- **Món ăn bán chạy nhất**
- **Hiệu suất nhân viên**
- **Tình hình tồn kho**
- **Phân tích khách hàng**

## ⚙️ **Tính năng nâng cao**

### **🔐 Hệ thống bảo mật**

- ✅ JWT Authentication với access/refresh tokens
- ✅ Password hashing với bcrypt
- ✅ Role-based access control
- ✅ Permission-based authorization
- ✅ Input validation và sanitization

### **✅ Form validation**

- ✅ Email format validation
- ✅ Vietnamese phone number validation
- ✅ Duplicate prevention (email, phone, table numbers)
- ✅ Business rules enforcement
- ✅ Real-time error messages

### **📱 Mobile responsive**

- ✅ Responsive design cho mobile/tablet
- ✅ Touch-friendly UI components
- ✅ Mobile-optimized navigation

## 🔧 **Troubleshooting**

### **Lỗi thường gặp:**

**1. CORS Error:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:** Check CORS_ORIGIN trong backend/.env phải match với frontend port

**2. Database Connection Error:**

```
Can't connect to PostgreSQL database
```

**Giải pháp:**

- Kiểm tra PostgreSQL server đã chạy
- Xác nhận DATABASE_URL trong .env đúng format
- Chạy `npx prisma db push` để sync schema

**3. JWT Token Error:**

```
Access token expired / Invalid token
```

**Giải pháp:** Refresh trang hoặc đăng nhập lại

**4. Validation Errors:**

- **Email đã tồn tại:** Sử dụng email khác
- **Giá quá lớn:** Giới hạn tối đa 99,999,999 VND
- **Số bàn trùng:** Mỗi bàn phải có số duy nhất

### **Các port mặc định:**

- **Frontend:** 5183
- **Backend API:** 3001
- **PostgreSQL:** 5432

### **Reset hệ thống:**

```bash
# Reset database
cd backend
npx prisma migrate reset

# Clear browser cache và localStorage
# Restart cả frontend và backend
```

## 📞 **Hỗ trợ kỹ thuật**

Nếu gặp vấn đề, hãy check:

1. **Console errors** (F12 → Console tab)
2. **Network requests** (F12 → Network tab)
3. **Backend logs** trong terminal
4. **Database connection** qua Prisma Studio: `npx prisma studio`

---

## 🎯 **Kế hoạch phát triển tiếp theo**

### **Phase 1 đã hoàn thành:**

- ✅ Complete CRUD operations
- ✅ Form validation system
- ✅ PostgreSQL integration
- ✅ Responsive UI

### **Phase 2 sắp tới:**

- 🔐 Real authentication system
- 📊 Order status tracking
- 🍽️ Kitchen display
- 📈 Advanced reporting

**Hệ thống hiện tại đã sẵn sàng sử dụng cho quản lý nhà hàng cơ bản!** 🚀
