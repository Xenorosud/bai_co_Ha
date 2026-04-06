# ⚡ QUICK SETUP GUIDE - RESTORA

> **Hướng dẫn setup nhanh cho team members**

## 🚀 **SETUP 5 PHÚT**

### **1️⃣ Prerequisites**

```bash
# Cài đặt Node.js v18+ và PostgreSQL v13+
node --version  # >= v18.0.0
psql --version  # >= v13.0.0
```

### **2️⃣ Database Setup**

```bash
# Tạo database
psql -U postgres
CREATE DATABASE restora;
\q
```

### **3️⃣ Backend Setup**

```bash
cd backend
npm install
cp .env.example .env

# Sửa file .env: thay YOUR_PASSWORD bằng postgres password
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/restora"

npx prisma migrate dev
npm run dev
```

### **4️⃣ Frontend Setup (Terminal mới)**

```bash
cd bai_co_Ha
npm install
npm run dev
```

### **5️⃣ Access App**

- **Frontend:** http://localhost:5184 (or port shown)
- **Backend API:** http://localhost:3001

---

## 🔧 **QUICK FIX CORS ERROR**

**Nếu frontend chạy port khác (VD: 5185):**

1. Sửa `backend/.env`:
   ```
   CORS_ORIGIN="http://localhost:5185"
   ```
2. Restart backend: Ctrl+C → `npm run dev`

---

## ✅ **VERIFICATION**

**Backend OK:** Thấy message với ✅ và database connected
**Frontend OK:** Website load được trang admin
**CRUD OK:** Có thể thêm/sửa/xóa món ăn

---

## 🆘 **EMERGENCY FIXES**

**Database error:**

```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
```

**Port conflict:**

```bash
# Windows kill port 3001
netstat -ano | findstr :3001
taskkill /F /PID <ID>

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

**Fresh restart:**

```bash
# Kill all Node processes
# Restart both servers
```

---

## 📋 **CURRENT STATUS**

- ✅ **CRUD Operations:** Working (no auth required)
- ✅ **Database:** PostgreSQL + Prisma + Seed data
- ✅ **Frontend:** React + Admin dashboard
- 🚧 **Authentication:** In development
- 🚧 **Real-time features:** Coming soon

---

**💡 Tip:** Giữ 2 terminals mở - 1 cho backend, 1 cho frontend
