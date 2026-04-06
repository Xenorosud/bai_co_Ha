# 👨‍💻 TEAM MEMBER QUICK ONBOARDING - RESTORA

> **Để bạn có thể setup và làm việc với project ngay lập tức**

## 🎯 **TÓM TẮT PROJECT**

**RESTORA** là hệ thống quản lý nhà hàng hoàn chỉnh với:

- ✅ **Backend API** (Node.js + Express + PostgreSQL + Prisma)
- ✅ **Frontend UI** (React + TypeScript + Tailwind CSS)
- ✅ **Admin Dashboard** với tất cả tính năng CRUD
- ✅ **Real Database** với sample data sẵn có
- 🚧 **Authentication** (đang phát triển)

---

## 🚀 **SETUP SIÊU NHANH (5 phút)**

### **Step 1: Prerequisites**

```bash
# Cần cài sẵn:
node --version  # >= v18.0.0
psql --version  # >= v13.0.0 (PostgreSQL)
```

### **Step 2: Database**

```bash
# Tạo database PostgreSQL
psql -U postgres
CREATE DATABASE restora;
\q
```

### **Step 3: Backend (Terminal 1)**

```bash
cd backend
npm install
cp .env.example .env

# ⚠️ QUAN TRỌNG: Sửa file .env
# Thay YOUR_PASSWORD bằng PostgreSQL password của bạn
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/restora"

npx prisma migrate dev  # Setup database schema
npm run dev            # Start server :3001
```

### **Step 4: Frontend (Terminal 2)**

```bash
cd bai_co_Ha
npm install
npm run dev    # Start on :5184 (or available port)
```

### **Step 5: Access & Test**

- **Frontend:** http://localhost:5184 (check terminal for actual port)
- **Admin:** http://localhost:5184/admin
- **Test CRUD:** Try adding/editing/deleting dishes

---

## 🔧 **COMMON ISSUE: CORS ERROR**

**Nếu thấy CORS error trong browser:**

1. Check frontend port (VD: 5185)
2. Update **backend/.env**:
   ```
   CORS_ORIGIN="http://localhost:5185"
   ```
3. Restart backend: Ctrl+C → `npm run dev`

---

## 📂 **PROJECT STRUCTURE**

```
restora/
├── 📂 backend/           # Node.js API + Database
│   ├── src/app.ts       # Main server (1300+ lines)
│   ├── prisma/          # Database schema & migrations
│   └── .env             # Config (YOU NEED TO UPDATE)
│
├── 📂 bai_co_Ha/        # React Frontend
│   ├── src/pages/       # All React pages
│   └── src/services/    # API client
│
└── 📂 docs/             # Setup guides (4 files mình vừa tạo)
```

---

## 🎨 **FEATURES READY TO USE**

### **✅ Admin Dashboard (Hoàn thành):**

- Dashboard statistics
- Food Management (CRUD dishes)
- Order Management
- Table Management
- Workers Management
- Inventory Management
- Payment Management

### **🚧 Đang phát triển:**

- JWT Authentication system
- Order status tracking
- Kitchen display interface

---

## 📋 **CURRENT STATUS**

**🔒 Authentication:** Tạm thời **DISABLED** để test CRUD
**📊 Database:** PostgreSQL với sample data sẵn có
**🎯 CRUD Operations:** Hoạt động 100% (thêm/sửa/xóa)
**🌐 API:** 30+ endpoints available
**💾 Data:** Real database, không còn mock data

---

## 📖 **DOCUMENTATION FILES**

Mình đã tạo 4 files hướng dẫn chi tiết:

1. **[QUICK_SETUP.md](./QUICK_SETUP.md)** - Setup nhanh trong 5 phút
2. **[HUONG_DAN_SETUP.md](./HUONG_DAN_SETUP.md)** - Hướng dẫn đầy đủ từng bước
3. **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Checklist để verify setup
4. **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Cấu trúc và tình trạng project

---

## 🆘 **EMERGENCY FIXES**

**Database lỗi:**

```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
```

**Port conflict:**

```bash
# Kill port 3001
netstat -ano | findstr :3001
taskkill /F /PID <ID>
```

**Fresh start:**

```bash
# Kill all Node processes → restart both servers
```

---

## 🎯 **VERIFICATION CHECKLIST**

✅ Backend shows: "🚀 Server: http://localhost:3001"
✅ Frontend shows: "➜ Local: http://localhost:XXXX/"
✅ Admin dashboard loads with real data
✅ Can add/edit/delete dishes successfully
✅ No CORS errors in browser console
✅ Toast notifications appear on actions

---

## 💡 **DEV TIPS**

- **Keep 2 terminals open:** Backend + Frontend
- **Hot reload:** Changes reflect immediately
- **Database GUI:** `npx prisma studio` (optional)
- **API testing:** All endpoints work via curl/Postman
- **Debugging:** F12 → Console cho frontend logs

---

## 📞 **SUPPORT**

**Files to check if issues:**

- Backend logs: Terminal running backend
- Frontend logs: Browser DevTools (F12)
- Config: Backend `.env` file

**Team contact:** Share error logs nếu cần help

---

**📈 Progress: ~70% complete | 🎯 Production ready: 3-4 tuần**

**🚀 Happy coding! Codebase sạch, documented đầy đủ, ready to collaborate!** ✨
