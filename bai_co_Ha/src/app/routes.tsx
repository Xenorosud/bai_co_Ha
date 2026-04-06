import React from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AdminLayoutWithAuth } from "./components/AdminLayout";
import { HomePage } from "../pages/HomePage";
import { MenuPage } from "../pages/MenuPage";
import { ReservationPage as CustomerReservationPage } from "../pages/ReservationPage";
import { OrderPage as CustomerOrderPage } from "../pages/OrderPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { FoodManagementPage } from "../pages/admin/FoodManagementPage";
import { OrderManagementPage } from "../pages/admin/OrderManagementPage";
import { TableManagementPage } from "../pages/admin/TableManagementPage";
import { ReservationManagementPage } from "../pages/admin/ReservationManagementPage";
import { WorkersManagementPage } from "../pages/admin/WorkersManagementPage";
import { PaymentManagementPage } from "../pages/admin/PaymentManagementPage";
import { InventoryManagementPage } from "../pages/admin/InventoryManagementPage";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: () => (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    Component: () => (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "menu", Component: MenuPage },
      { path: "reservation", Component: CustomerReservationPage },
      { path: "order", Component: CustomerOrderPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLoginPage,
  },
  {
    path: "/admin",
    Component: AdminLayoutWithAuth,
    children: [
      { index: true, Component: DashboardPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "food-management", Component: FoodManagementPage },
      { path: "order-management", Component: OrderManagementPage },
      { path: "table-management", Component: TableManagementPage },
      { path: "reservation-management", Component: ReservationManagementPage },
      { path: "workers-management", Component: WorkersManagementPage },
      { path: "payment-management", Component: PaymentManagementPage },
      { path: "inventory-management", Component: InventoryManagementPage },
    ],
  },
]);
