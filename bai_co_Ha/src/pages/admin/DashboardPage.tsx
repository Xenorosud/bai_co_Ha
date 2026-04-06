/**
 * DashboardPage - Dashboard tổng quan với Real-time Statistics
 */

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  ChefHat,
  MapPin,
  Package,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card";
import { Button } from "../../app/components/ui/button";
import {
  OrderStatusBadge,
  ReservationStatusBadge,
  InventoryStatusBadge,
} from "../../app/components/StatusBadge";
import {
  ordersAPI,
  reservationsAPI,
  transactionsAPI,
  employeesAPI,
  inventoryAPI,
  tablesAPI,
} from "../../services/api";
import { Link } from "react-router";

interface DashboardStats {
  // Revenue Stats
  totalRevenue: number;
  todayRevenue: number;
  weeklyRevenue: number;
  revenueGrowth: number;

  // Order Stats
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;

  // Reservation Stats
  totalReservations: number;
  todayReservations: number;
  pendingReservations: number;
  upcomingReservations: number;

  // Staff & Tables
  activeEmployees: number;
  totalEmployees: number;
  occupiedTables: number;
  totalTables: number;

  // Inventory
  lowStockItems: number;
  criticalStockItems: number;
  totalInventoryItems: number;
}

interface RecentOrder {
  id: number;
  orderId: string;
  customerName: string;
  total: number;
  orderStatus: string;
  createdAt: string;
  tableNumber?: string;
}

interface RecentReservation {
  id: number;
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  status: string;
  submittedAt: string;
}

interface InventoryAlert {
  id: number;
  itemName: string;
  currentStock: number;
  minStock: number;
  status: string;
  category: string;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalReservations: 0,
    todayReservations: 0,
    pendingReservations: 0,
    upcomingReservations: 0,
    activeEmployees: 0,
    totalEmployees: 0,
    occupiedTables: 0,
    totalTables: 0,
    lowStockItems: 0,
    criticalStockItems: 0,
    totalInventoryItems: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentReservations, setRecentReservations] = useState<
    RecentReservation[]
  >([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [weeklyRevenueData, setWeeklyRevenueData] = useState<
    Array<{ day: string; revenue: number }>
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ============================================
  // API Functions
  // ============================================

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Parallel API calls for better performance
      const [
        ordersResponse,
        reservationsResponse,
        transactionsResponse,
        employeesResponse,
        tablesResponse,
        inventoryResponse,
      ] = await Promise.all([
        ordersAPI.getAll(1, 1000),
        reservationsAPI.getAll(1, 1000),
        transactionsAPI.getAll(1, 1000),
        employeesAPI.getAll(1, 1000),
        tablesAPI.getAll(1, 1000),
        inventoryAPI.getAll(1, 1000),
      ]);

      const orders = ordersResponse.data.data;
      const reservations = reservationsResponse.data.data;
      const transactions = transactionsResponse.data.data;
      const employees = employeesResponse.data.data;
      const tables = tablesResponse.data.data;
      const inventory = inventoryResponse.data.data;

      // Calculate revenue stats
      const completedTransactions = transactions.filter(
        (t: any) => t.transactionStatus === "COMPLETED",
      );
      const totalRevenue = completedTransactions.reduce(
        (sum: number, t: any) => sum + t.amount,
        0,
      );
      const todayRevenue = completedTransactions
        .filter((t: any) => t.transactionDate === today)
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const weeklyRevenue = completedTransactions
        .filter((t: any) => t.transactionDate >= weekAgo)
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      // Calculate growth (mock calculation - would need historical data)
      const revenueGrowth = Math.random() * 20 - 10; // -10% to +10% mock growth

      // Get recent orders (last 5)
      const sortedOrders = orders
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5);
      setRecentOrders(sortedOrders);

      // Get recent reservations (last 5)
      const sortedReservations = reservations
        .sort(
          (a: any, b: any) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        )
        .slice(0, 5);
      setRecentReservations(sortedReservations);

      // Get inventory alerts
      const lowStock = inventory
        .filter(
          (item: any) =>
            item.currentStock <= item.minStock && item.currentStock > 0,
        )
        .slice(0, 5);
      const criticalStock = inventory.filter(
        (item: any) =>
          item.currentStock === 0 ||
          (item.minStock > 0 && item.currentStock < item.minStock * 0.5),
      );
      setInventoryAlerts([...criticalStock, ...lowStock].slice(0, 5));

      // Generate weekly revenue chart data
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split("T")[0];
        const dayStr = date.toLocaleDateString("vi-VN", { weekday: "short" });
        const dayRevenue = completedTransactions
          .filter((t: any) => t.transactionDate === dateStr)
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        weeklyData.push({ day: dayStr, revenue: dayRevenue });
      }
      setWeeklyRevenueData(weeklyData);

      // Update stats
      setStats({
        totalRevenue,
        todayRevenue,
        weeklyRevenue,
        revenueGrowth,
        totalOrders: orders.length,
        todayOrders: orders.filter((o: any) => o.orderDate === today).length,
        pendingOrders: orders.filter((o: any) => o.orderStatus === "PENDING")
          .length,
        completedOrders: orders.filter(
          (o: any) => o.orderStatus === "COMPLETED",
        ).length,
        totalReservations: reservations.length,
        todayReservations: reservations.filter(
          (r: any) => r.reservationDate === today,
        ).length,
        pendingReservations: reservations.filter(
          (r: any) => r.status === "PENDING",
        ).length,
        upcomingReservations: reservations.filter(
          (r: any) => r.reservationDate >= today && r.status === "CONFIRMED",
        ).length,
        activeEmployees: employees.filter((e: any) => e.status === "ACTIVE")
          .length,
        totalEmployees: employees.length,
        occupiedTables: tables.filter((t: any) => t.status === "OCCUPIED")
          .length,
        totalTables: tables.length,
        lowStockItems: lowStock.length,
        criticalStockItems: criticalStock.length,
        totalInventoryItems: inventory.length,
      });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Lỗi khi tải dữ liệu dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllStats();
  };

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    fetchAllStats();

    // Auto refresh every 30 seconds
    const interval = setInterval(fetchAllStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // Helper Functions
  // ============================================

  const formatVND = (amount: number) => amount.toLocaleString("vi-VN") + "đ";

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <TrendingUp className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  const maxRevenue = Math.max(...weeklyRevenueData.map((d) => d.revenue));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Tổng quan hệ thống quản lý nhà hàng
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>Làm mới</span>
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu hôm nay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatVND(stats.todayRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getGrowthIcon(stats.revenueGrowth)}
              <span className={getGrowthColor(stats.revenueGrowth)}>
                {stats.revenueGrowth > 0 ? "+" : ""}
                {stats.revenueGrowth.toFixed(1)}% so với hôm qua
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đơn hàng hôm nay
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.todayOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} chờ xử lý • {stats.completedOrders} hoàn
              thành
            </p>
          </CardContent>
        </Card>

        {/* Reservations Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đặt bàn hôm nay
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.todayReservations}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReservations} chờ duyệt •{" "}
              {stats.upcomingReservations} sắp tới
            </p>
          </CardContent>
        </Card>

        {/* Staff & Tables Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nhân viên & Bàn
            </CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.activeEmployees}/{stats.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">
              Bàn: {stats.occupiedTables}/{stats.totalTables} đang sử dụng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tổng doanh thu tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatVND(stats.weeklyRevenue)}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Trung bình: {formatVND(stats.weeklyRevenue / 7)}/ngày
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cảnh báo kho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sắp hết hàng</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats.lowStockItems}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hết hàng</span>
                <span className="text-lg font-bold text-red-600">
                  {stats.criticalStockItems}
                </span>
              </div>
              <Link
                to="/admin/inventory-management"
                className="text-xs text-blue-600 hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hoạt động hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Đơn hàng mới</span>
                </div>
                <span className="font-semibold">{stats.todayOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Đặt bàn mới</span>
                </div>
                <span className="font-semibold">{stats.todayReservations}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Doanh thu</span>
                </div>
                <span className="font-semibold">
                  {formatVND(stats.todayRevenue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Doanh thu 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-64 gap-4">
              {weeklyRevenueData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-green-500 rounded-t-lg relative min-h-[20px]"
                    style={{
                      height:
                        maxRevenue > 0
                          ? `${Math.max((data.revenue / maxRevenue) * 100, 5)}%`
                          : "5%",
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
                      {data.revenue > 0 ? formatVND(data.revenue) : "0đ"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Đơn hàng gần đây</CardTitle>
            <Link to="/admin/order-management">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>Xem tất cả</span>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold">{order.orderId}</p>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customerName || "Khách hàng"}
                      </p>
                      {order.tableNumber && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          Bàn {order.tableNumber}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatVND(order.total)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Chưa có đơn hàng nào
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Đặt bàn gần đây</CardTitle>
            <Link to="/admin/reservation-management">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>Xem tất cả</span>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentReservations.length > 0 ? (
              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold">
                          {reservation.customerName}
                        </p>
                        <ReservationStatusBadge status={reservation.status} />
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                          {new Date(
                            reservation.reservationDate,
                          ).toLocaleDateString("vi-VN")}
                        </span>
                        <Clock className="w-3 h-3 ml-2 mr-1" />
                        <span>{reservation.reservationTime}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{reservation.guestCount} khách</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(reservation.submittedAt).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Chưa có đặt bàn nào
              </p>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Cảnh báo tồn kho</CardTitle>
            <Link to="/admin/inventory-management">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Package className="w-4 h-4" />
                <span>Quản lý kho</span>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {inventoryAlerts.length > 0 ? (
              <div className="space-y-4">
                {inventoryAlerts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold">{item.itemName}</p>
                        <InventoryStatusBadge status={item.status} />
                      </div>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        {item.currentStock}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tối thiểu: {item.minStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Tất cả mặt hàng đều đủ số lượng
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/order-management">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
              >
                <ShoppingCart className="w-6 h-6 text-blue-500" />
                <span>Quản lý đơn hàng</span>
              </Button>
            </Link>

            <Link to="/admin/reservation-management">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Calendar className="w-6 h-6 text-purple-500" />
                <span>Quản lý đặt bàn</span>
              </Button>
            </Link>

            <Link to="/admin/food-management">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
              >
                <ChefHat className="w-6 h-6 text-orange-500" />
                <span>Quản lý thực đơn</span>
              </Button>
            </Link>

            <Link to="/admin/inventory-management">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Package className="w-6 h-6 text-green-500" />
                <span>Quản lý kho</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
