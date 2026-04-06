# 🍽️ RESTORA - Restaurant Management System

> Hệ thống quản lý nhà hàng full-stack với React, Node.js và PostgreSQL

## 📸 **Screenshot**

![Dashboard](https://via.placeholder.com/800x400?text=RESTORA+Dashboard)

## ⚡ **Quick Start**

### **1. Setup Backend**

```bash
cd backend
npm install
createdb restora
npx prisma migrate dev
npm run dev  # Server runs on :3001
```

### **2. Setup Frontend**

```bash
cd bai_co_Ha
npm install
npm run dev  # App runs on :5183
```

### **3. Access Application**

- 🌐 **App:** http://localhost:5183
- 🔧 **API:** http://localhost:3001
- 👤 **Admin:** Create employee with Admin role

## 🎯 **Core Features**

| Module                  | Features                              | Status      |
| ----------------------- | ------------------------------------- | ----------- |
| 🍴 **Food Management**  | CRUD món ăn, categories, pricing      | ✅ Complete |
| 👥 **Staff Management** | Employee CRUD, roles, permissions     | ✅ Complete |
| 🪑 **Table Management** | Table status, capacity management     | ✅ Complete |
| 📋 **Reservations**     | Booking system, customer management   | ✅ Complete |
| 📦 **Inventory**        | Stock tracking, restock alerts        | ✅ Complete |
| 💰 **Payments**         | Transaction history, multiple methods | ✅ Complete |
| 📊 **Dashboard**        | Analytics, reports, insights          | ✅ Complete |

## 🏗️ **Tech Stack**

**Frontend:**

- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS + Shadcn/ui
- 📱 Responsive Design
- ✅ Form Validation

**Backend:**

- 🚀 Node.js + Express
- 🗄️ PostgreSQL + Prisma ORM
- 🔐 JWT Authentication
- ✅ Input Validation

## 📁 **Project Structure**

```
restora/
├── 📂 backend/          # API Server
│   ├── src/app.ts       # Main server + all endpoints
│   ├── utils/auth.ts    # JWT utilities
│   └── middleware/      # Auth middleware
├── 📂 bai_co_Ha/        # React Frontend
│   ├── src/pages/       # App pages
│   ├── src/services/    # API calls
│   └── src/utils/       # Validation utils
└── 📂 docs/             # Documentation
```

## 🎨 **UI Preview**

### **Dashboard**

- 📊 Revenue & order statistics
- 🔥 Top selling dishes
- ⚠️ Low stock alerts
- 📈 Business insights

### **Management Pages**

- **Food:** Add/edit dishes with categories & pricing
- **Staff:** Employee management with role-based permissions
- **Tables:** Table status tracking & capacity management
- **Inventory:** Stock levels with restock notifications
- **Reservations:** Customer booking system
- **Payments:** Transaction history & payment methods

## 🔐 **Security Features**

- 🔑 JWT-based authentication
- 🛡️ Role-based access control (RBAC)
- ✅ Input validation & sanitization
- 🔒 Password hashing with bcrypt
- 🚫 SQL injection prevention via Prisma

## 📱 **Screenshots**

| Desktop                                                           | Mobile                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| ![Desktop](https://via.placeholder.com/400x250?text=Desktop+View) | ![Mobile](https://via.placeholder.com/200x300?text=Mobile+View) |

## 🚀 **Getting Started**

> 📖 **Chi tiết:** Xem [HUONG_DAN_SU_DUNG.md](./HUONG_DAN_SU_DUNG.md) để có hướng dẫn đầy đủ

### **Prerequisites**

- Node.js v18+
- PostgreSQL v13+
- npm/yarn

### **Environment Setup**

```bash
# Backend .env
DATABASE_URL="postgresql://user:password@localhost:5432/restora"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:5183"
```

## 📊 **Database Schema**

```sql
-- Core entities
Users (authentication)
Employees (staff management)
Dishes (menu items)
Tables (restaurant tables)
Orders (customer orders)
Inventory (stock management)
Transactions (payments)
Reservations (bookings)
```

## 🎯 **Roadmap**

### **Phase 1 - Completed ✅**

- [x] Complete CRUD operations
- [x] Form validation system
- [x] PostgreSQL integration
- [x] Responsive UI design

### **Phase 2 - In Progress 🚧**

- [ ] Real-time authentication
- [ ] Kitchen display system
- [ ] Order status tracking
- [ ] Advanced reporting

### **Phase 3 - Planned 📋**

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Multi-location support
- [ ] Advanced analytics

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**RESTORA Team**

- 🌐 Website: [restora.dev](https://restora.dev)
- 📧 Email: contact@restora.dev
- 💬 Support: [GitHub Issues](https://github.com/restora/issues)

---

**⭐ Star this repo if you find it helpful!**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.x-blue.svg)
