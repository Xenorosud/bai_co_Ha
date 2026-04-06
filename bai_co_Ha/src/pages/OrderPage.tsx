/**
 * Order Page - Fetch orders from API
 */

import React, { useState, useEffect } from "react";
import { ordersAPI } from "../services/api";

interface Order {
  id: number;
  orderId: string;
  tableId?: number;
  customerId?: string;
  employeeId: string;
  orderStatus: string;
  subtotal: number;
  tax: number;
  total: number;
  deliveryType: string;
  deliveryAddress?: string;
  orderDate: string;
  orderTime: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // ============================================
  // Fetch orders
  // ============================================

  const fetchOrders = async (page: number, status?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersAPI.getAll(page, 10, status);
      setOrders(response.data.data);
      setPagination(response.data.meta);
      setCurrentPage(page);
    } catch (err: any) {
      const message = err.response?.data?.message || "Lỗi khi tải đơn hàng";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Load on mount & when filter changes
  // ============================================

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  // ============================================
  // Handle status change
  // ============================================

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  // ============================================
  // Handle update order status
  // ============================================

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      await fetchOrders(currentPage, statusFilter);
    } catch (err: any) {
      alert("Cập nhật thất bại: " + (err.response?.data?.message || "Lỗi"));
    }
  };

  // ============================================
  // Get status badge color
  // ============================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Quản lý Đơn hàng
          </h1>
          <p className="text-gray-600">Danh sách tất cả các đơn hàng</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4 flex gap-4 flex-wrap">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Lọc theo trạng thái:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Bị hủy</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
          </div>
        )}

        {/* Orders Table */}
        {!isLoading && orders.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Bàn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.tableId ? `Bàn ${order.tableId}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.deliveryType === "DINE_IN" && "🍽️ Dùng tại chỗ"}
                      {order.deliveryType === "DELIVERY" && "🚚 Giao hàng"}
                      {order.deliveryType === "TAKEOUT" && "📦 Mang đi"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                      >
                        {order.orderStatus === "PENDING" && "Chờ xử lý"}
                        {order.orderStatus === "PROCESSING" && "Đang xử lý"}
                        {order.orderStatus === "COMPLETED" && "Hoàn thành"}
                        {order.orderStatus === "CANCELLED" && "Bị hủy"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {order.orderStatus === "PENDING" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, "PROCESSING")
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Xử lý
                        </button>
                      )}
                      {order.orderStatus === "PROCESSING" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, "COMPLETED")
                          }
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Không có đơn hàng</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => fetchOrders(currentPage - 1, statusFilter)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              ← Trước
            </button>
            <span className="px-4 py-2">
              Trang {currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchOrders(currentPage + 1, statusFilter)}
              disabled={!pagination.hasMore}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
