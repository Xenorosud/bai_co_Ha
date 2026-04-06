/**
 * OrderManagementPage - Quản lý Đơn hàng với Complete Order Management
 */

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  ShoppingCart,
  DollarSign,
  Clock,
  Eye,
  Users,
  MapPin,
} from "lucide-react";
import { DataTable, Column } from "../../app/components/DataTable";
import { FormModal } from "../../app/components/Modal";
import { useConfirmDialog } from "../../app/components/ConfirmDialog";
import { OrderStatusBadge } from "../../app/components/StatusBadge";
import { ordersAPI } from "../../services/api";
import { Button } from "../../app/components/ui/button";
import { Input } from "../../app/components/ui/input";
import { Label } from "../../app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card";

interface OrderItem {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
}

interface Order {
  id: number;
  orderId: string;
  tableId?: number;
  tableNumber?: string;
  customerId?: string;
  customerName?: string;
  employeeId: string;
  employeeName?: string;
  orderStatus: string;
  subtotal: number;
  tax: number;
  total: number;
  deliveryType: string;
  deliveryAddress?: string;
  orderDate: string;
  orderTime: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

const ORDER_STATUSES = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const DELIVERY_TYPES = [
  { value: "dine_in", label: "Tại chỗ" },
  { value: "delivery", label: "Giao hàng" },
  { value: "takeout", label: "Mang đi" },
];

export function OrderManagementPage() {
  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  });

  // Confirm dialog
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // ============================================
  // API Functions
  // ============================================

  const fetchOrders = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll(
        page,
        10,
        statusFilter !== "all" ? statusFilter : undefined,
      );
      const data = response.data?.data || []; // Safe fallback
      const meta = response.data?.meta || { page: 1, limit: 10, total: 0, totalPages: 0, hasMore: false };

      // Filter locally
      let filteredData = data;
      if (deliveryTypeFilter !== "all") {
        filteredData = data.filter(
          (order: Order) => order.deliveryType === deliveryTypeFilter,
        );
      }
      if (dateFilter) {
        filteredData = filteredData.filter(
          (order: Order) => order.orderDate === dateFilter,
        );
      }
      if (search) {
        filteredData = filteredData.filter(
          (order: Order) =>
            order.orderId.toLowerCase().includes(search.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            order.tableNumber?.includes(search),
        );
      }

      setOrders(filteredData);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / meta.limit),
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Lỗi khi tải danh sách đơn hàng");
      // Ensure orders is always an array
      setOrders([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await ordersAPI.getAll(1, 1000);
      const allOrders = response.data?.data || []; // Safe fallback to empty array

      const totalRevenue = allOrders
        .filter((order: Order) => order.orderStatus === "COMPLETED")
        .reduce((sum: number, order: Order) => sum + order.total, 0);

      setStats({
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter(
          (o: Order) => o.orderStatus === "PENDING",
        ).length,
        processingOrders: allOrders.filter(
          (o: Order) => o.orderStatus === "PROCESSING",
        ).length,
        completedOrders: allOrders.filter(
          (o: Order) => o.orderStatus === "COMPLETED",
        ).length,
        cancelledOrders: allOrders.filter(
          (o: Order) => o.orderStatus === "CANCELLED",
        ).length,
        totalRevenue,
        avgOrderValue:
          allOrders.length > 0 ? totalRevenue / allOrders.length : 0,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      // Set default stats when error occurs
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleStatusUpdate = async (order: Order, newStatus: string) => {
    showConfirm({
      title: "Cập nhật trạng thái đơn hàng",
      message: `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng "${order.orderId}" sang "${ORDER_STATUSES.find((s) => s.value === newStatus)?.label}"?`,
      onConfirm: async () => {
        try {
          await ordersAPI.updateStatus(order.id, newStatus);
          toast.success("Cập nhật trạng thái thành công!");
          fetchOrders(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error updating order status:", error);
          toast.error(
            error.response?.data?.message || "Lỗi khi cập nhật trạng thái",
          );
        }
      },
    });
  };

  const handleCancelOrder = async (order: Order) => {
    showConfirm({
      title: "Hủy đơn hàng",
      message: `Bạn có chắc chắn muốn hủy đơn hàng "${order.orderId}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await ordersAPI.cancel(order.id);
          toast.success("Hủy đơn hàng thành công!");
          fetchOrders(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error cancelling order:", error);
          toast.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
        }
      },
    });
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setShowDetailModal(true);
  };

  // ============================================
  // Table Configuration
  // ============================================

  const columns: Column<Order>[] = [
    {
      key: "orderId",
      header: "Mã đơn hàng",
      sortable: true,
      searchable: true,
      render: (orderId: string, order: Order) => (
        <div>
          <div className="font-semibold text-blue-600">{orderId}</div>
          <div className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Khách hàng",
      render: (customerName: string, order: Order) => (
        <div>
          <div className="font-medium">{customerName || "Khách hàng"}</div>
          {order.tableNumber && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              Bàn {order.tableNumber}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "orderItems",
      header: "Món ăn",
      render: (orderItems: OrderItem[]) => (
        <div className="max-w-xs">
          <div className="text-sm">
            {(orderItems || []).slice(0, 2).map((item, index) => (
              <div key={index} className="truncate">
                {item.quantity}x {item.dishName}
              </div>
            ))}
            {(orderItems || []).length > 2 && (
              <div className="text-gray-500">
                +{(orderItems || []).length - 2} món khác
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "total",
      header: "Tổng tiền",
      sortable: true,
      render: (total: number, order: Order) => (
        <div>
          <div className="font-semibold text-green-600">
            {total.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-xs text-gray-500">
            {DELIVERY_TYPES.find((t) => t.value === order.deliveryType)?.label}
          </div>
        </div>
      ),
    },
    {
      key: "orderStatus",
      header: "Trạng thái",
      render: (status: string, order: Order) => (
        <div className="flex items-center space-x-2">
          <OrderStatusBadge status={status} />
          <Select
            value={status}
            onValueChange={(newStatus) => handleStatusUpdate(order, newStatus)}
            disabled={status === "COMPLETED" || status === "CANCELLED"}
          >
            <SelectTrigger className="w-auto h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      key: "employeeName",
      header: "Nhân viên",
      render: (employeeName: string) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{employeeName || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Cập nhật",
      sortable: true,
      render: (date: string) => (
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(date).toLocaleString("vi-VN")}
        </div>
      ),
    },
  ];

  // Custom actions for DataTable
  const customActions = (order: Order) => [
    {
      label: "Xem chi tiết",
      icon: Eye,
      onClick: () => handleViewOrder(order),
      className: "text-blue-600 hover:text-blue-800",
    },
    ...(order.orderStatus !== "COMPLETED" && order.orderStatus !== "CANCELLED"
      ? [
          {
            label: "Hủy đơn",
            onClick: () => handleCancelOrder(order),
            className: "text-red-600 hover:text-red-800",
          },
        ]
      : []),
  ];

  // Filter component
  const renderFilters = () => (
    <div className="flex items-center space-x-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={deliveryTypeFilter} onValueChange={setDeliveryTypeFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Loại phục vụ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          {DELIVERY_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="w-40"
        placeholder="Chọn ngày"
      />
    </div>
  );

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [statusFilter, deliveryTypeFilter, dateFilter]);

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-1">Theo dõi và xử lý các đơn hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statsLoading
                ? "..."
                : stats.processingOrders + stats.pendingOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : stats.completedOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading
                ? "..."
                : `${stats.totalRevenue.toLocaleString("vi-VN")}đ`}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchOrders(page)}
        onSearch={(search) => fetchOrders(1, search)}
        onEdit={(order) => handleViewOrder(order)}
        customActions={customActions}
        filters={renderFilters()}
        searchPlaceholder="Tìm kiếm đơn hàng..."
        emptyMessage="Chưa có đơn hàng nào"
      />

      {/* Order Detail Modal */}
      <FormModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Chi tiết đơn hàng ${viewingOrder?.orderId}`}
        onSubmit={() => setShowDetailModal(false)}
        submitText="Đóng"
        size="lg"
      >
        {viewingOrder && (
          <div className="space-y-4">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mã đơn hàng</Label>
                <div className="font-semibold text-blue-600">
                  {viewingOrder.orderId}
                </div>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <div className="mt-1">
                  <OrderStatusBadge status={viewingOrder.orderStatus} />
                </div>
              </div>
              <div>
                <Label>Khách hàng</Label>
                <div>{viewingOrder.customerName || "Khách hàng"}</div>
              </div>
              <div>
                <Label>Loại phục vụ</Label>
                <div>
                  {
                    DELIVERY_TYPES.find(
                      (t) => t.value === viewingOrder.deliveryType,
                    )?.label
                  }
                </div>
              </div>
              {viewingOrder.tableNumber && (
                <div>
                  <Label>Bàn</Label>
                  <div>Bàn {viewingOrder.tableNumber}</div>
                </div>
              )}
              <div>
                <Label>Nhân viên xử lý</Label>
                <div>{viewingOrder.employeeName || "N/A"}</div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <Label>Danh sách món</Label>
              <div className="mt-2 border rounded-lg">
                <div className="max-h-60 overflow-y-auto">
                  {(viewingOrder.orderItems || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border-b last:border-b-0"
                    >
                      <div>
                        <div className="font-medium">{item.dishName}</div>
                        {item.specialInstructions && (
                          <div className="text-sm text-gray-600">
                            Ghi chú: {item.specialInstructions}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.quantity}x{" "}
                          {item.unitPrice.toLocaleString("vi-VN")}đ
                        </div>
                        <div className="text-sm text-gray-600">
                          ={" "}
                          {(item.quantity * item.unitPrice).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{viewingOrder.subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế:</span>
                  <span>{viewingOrder.tax.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {viewingOrder.total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {viewingOrder.deliveryAddress && (
              <div>
                <Label>Địa chỉ giao hàng</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  {viewingOrder.deliveryAddress}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <Label>Ngày tạo</Label>
                <div>
                  {new Date(viewingOrder.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
              {viewingOrder.completedAt && (
                <div>
                  <Label>Ngày hoàn thành</Label>
                  <div>
                    {new Date(viewingOrder.completedAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
