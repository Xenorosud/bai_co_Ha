# ✅ SETUP VERIFICATION CHECKLIST

> **Checklist để kiểm tra setup thành công**

## 🔍 **PRE-SETUP CHECKLIST**

### **System Requirements:**

- [ ] Node.js v18+ đã cài đặt (`node --version`)
- [ ] PostgreSQL v13+ đã cài đặt (`psql --version`)
- [ ] Git đã cài đặt (`git --version`)
- [ ] Code Editor (VS Code khuyên dùng)

### **Database Prerequisites:**

- [ ] PostgreSQL service đang chạy
- [ ] Database `restora` đã tạo
- [ ] User `postgres` có quyền truy cập
- [ ] Test connection thành công (`psql -U postgres -d restora`)

---

## 🗄️ **BACKEND VERIFICATION**

### **Installation & Config:**

- [ ] `cd backend` thành công
- [ ] `npm install` hoàn thành không lỗi
- [ ] File `.env` tồn tại và cấu hình đúng
- [ ] `DATABASE_URL` có password PostgreSQL chính xác
- [ ] `CORS_ORIGIN` khớp với frontend port

### **Database Setup:**

- [ ] `npx prisma migrate dev` thành công
- [ ] `npx prisma db seed` chạy không lỗi
- [ ] Database có 13 tables
- [ ] Sample data được insert

### **Server Status:**

- [ ] `npm run dev` khởi động thành công
- [ ] Thấy message: "🚀 Server: http://localhost:3001"
- [ ] Thấy: "✅ All endpoints connected to real database!"
- [ ] Không có error messages trong console

### **API Testing:**

```bash
# Test health endpoint
curl http://localhost:3001/api/health
```

- [ ] Response: `{"status":"OK","message":"Restaurant Management API Server đang chạy"}`

```bash
# Test dishes endpoint
curl http://localhost:3001/api/dishes
```

- [ ] Response có array dishes với sample data
- [ ] Status: "OK", message: "Lấy danh sách món ăn thành công"

---

## 🌐 **FRONTEND VERIFICATION**

### **Installation:**

- [ ] `cd bai_co_Ha` thành công
- [ ] `npm install` hoàn thành không lỗi
- [ ] Dependencies installed successfully

### **Server Status:**

- [ ] `npm run dev` khởi động thành công
- [ ] Thấy: "VITE v6.3.5 ready in XXXms"
- [ ] Thấy: "➜ Local: http://localhost:XXXX/"
- [ ] Port number được hiển thị (5184, 5185, etc.)

### **Website Access:**

- [ ] Truy cập frontend URL thành công
- [ ] Homepage load được
- [ ] Navigation menu hiển thị
- [ ] Không có console errors (F12 → Console)

---

## 🔄 **INTEGRATION VERIFICATION**

### **CORS Check:**

- [ ] Frontend port matches `CORS_ORIGIN` trong backend `.env`
- [ ] Nếu không khớp → Update backend `.env` và restart

### **API Integration:**

- [ ] Truy cập admin dashboard: `http://localhost:XXXX/admin`
- [ ] Dashboard loads successfully
- [ ] Stats cards hiển thị numbers (không phải 0 hoặc loading)
- [ ] Menu "Quản lý thực phẩm" accessible

### **CRUD Operations:**

**Food Management Page:**

- [ ] Danh sách món ăn hiển thị
- [ ] Click "Thêm món ăn" mở modal
- [ ] Form validation hoạt động
- [ ] Thêm món ăn mới thành công
- [ ] Toast notification xuất hiện
- [ ] Sửa món ăn existing thành công
- [ ] Xóa món ăn thành công

---

## 🎯 **FUNCTIONALITY CHECKLIST**

### **Admin Dashboard:**

- [ ] Revenue cards hiển thị
- [ ] Order stats hiển thị
- [ ] Top dishes section có data
- [ ] Low stock alerts (nếu có)

### **Food Management:**

- [ ] ✅ Xem danh sách món ăn
- [ ] ✅ Thêm món ăn mới
- [ ] ✅ Sửa món ăn existing
- [ ] ✅ Xóa món ăn
- [ ] ✅ Search functionality
- [ ] ✅ Pagination

### **Other Management Pages:**

- [ ] Order Management accessible
- [ ] Table Management accessible
- [ ] Reservation Management accessible
- [ ] Workers Management accessible
- [ ] Inventory Management accessible
- [ ] Payment Management accessible

---

## 🚨 **COMMON ISSUES & QUICK FIXES**

### **❌ Backend Issues:**

**"Error: connect ECONNREFUSED"**

- [ ] PostgreSQL service running?
- [ ] DATABASE_URL correct trong .env?
- [ ] Password matches PostgreSQL setup?

**"Port 3001 already in use"**

```bash
# Windows:
netstat -ano | findstr :3001
taskkill /F /PID <ID>

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### **❌ Frontend Issues:**

**"CORS policy blocked"**

- [ ] Check frontend port hiển thị
- [ ] Update CORS_ORIGIN trong backend/.env
- [ ] Restart backend server

**"Network Error" hoặc "API Error"**

- [ ] Backend server đang chạy?
- [ ] API endpoints accessible qua curl?
- [ ] Backend logs có errors?

### **❌ Database Issues:**

**"relation does not exist"**

```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
npx prisma db seed
```

**"Cannot seed database"**

- [ ] Database empty trước khi seed?
- [ ] Migration completed successfully?
- [ ] PostgreSQL user có write permissions?

---

## 🎉 **SUCCESS CRITERIA**

### **✅ Setup thành công khi:**

1. **Backend server** running trên port 3001 ✅
2. **Frontend server** running (port bất kỳ) ✅
3. **Database** connected với sample data ✅
4. **Admin dashboard** load với real statistics ✅
5. **CRUD operations** hoạt động (add/edit/delete dishes) ✅
6. **No CORS errors** trong browser console ✅
7. **Toast notifications** xuất hiện khi thực hiện actions ✅

### **🚀 Ready to develop khi:**

- [ ] Có thể code và thấy changes instantly (HMR)
- [ ] Database changes reflect immediately trong UI
- [ ] API endpoints work như expected
- [ ] Team members có thể collaborate

---

## 📞 **GET HELP**

**Nếu checklist fails:**

1. **Check logs:**
   - Backend: Terminal running `npm run dev`
   - Frontend: Browser DevTools (F12) → Console
   - Database: `npx prisma studio`

2. **Common commands:**

   ```bash
   # Reset everything
   cd backend && npx prisma migrate reset --force
   cd backend && npx prisma migrate dev
   cd backend && npx prisma db seed

   # Restart servers
   # Kill processes và run npm run dev again
   ```

3. **Team communication:**
   - Share error messages
   - Share system info (OS, Node version, etc.)
   - Share logs/screenshots

4. **Last resort:**
   ```bash
   # Fresh clone và setup lại
   git clone <repo>
   # Follow setup guide từ đầu
   ```

---

**🎯 Khi tất cả checkboxes được tick → Setup successful!** ✅
