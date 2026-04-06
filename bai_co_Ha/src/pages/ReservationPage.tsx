/**
 * Reservation Page - Fetch reservations from API
 */

import React, { useState, useEffect } from "react";
import { reservationsAPI } from "../services/api";

interface Reservation {
  id: number;
  tableId?: number;
  customerName: string;
  phone: string;
  email: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialRequests?: string;
  higherTable: boolean;
  status: string;
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

export const ReservationPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // ============================================
  // Fetch reservations
  // ============================================

  const fetchReservations = async (page: number, status?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reservationsAPI.getAll(page, 10, status);
      setReservations(response.data.data);
      setPagination(response.data.meta);
      setCurrentPage(page);
    } catch (err: any) {
      const message = err.response?.data?.message || "Lỗi khi tải đặt bàn";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Load on mount & when filter changes
  // ============================================

  useEffect(() => {
    fetchReservations(1, statusFilter);
  }, [statusFilter]);

  // ============================================
  // Handle status change
  // ============================================

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  // ============================================
  // Handle approve reservation
  // ============================================

  const handleApprove = async (reservationId: number) => {
    try {
      await reservationsAPI.approve(reservationId);
      await fetchReservations(currentPage, statusFilter);
    } catch (err: any) {
      alert("Phê duyệt thất bại: " + (err.response?.data?.message || "Lỗi"));
    }
  };

  // ============================================
  // Handle deny reservation
  // ============================================

  const handleDeny = async (reservationId: number) => {
    if (!window.confirm("Bạn chắc chắn muốn từ chối đặt bàn này?")) return;

    try {
      await reservationsAPI.deny(reservationId);
      await fetchReservations(currentPage, statusFilter);
    } catch (err: any) {
      alert("Từ chối thất bại: " + (err.response?.data?.message || "Lỗi"));
    }
  };

  // ============================================
  // Handle complete reservation
  // ============================================

  const handleComplete = async (reservationId: number) => {
    try {
      await reservationsAPI.complete(reservationId);
      await fetchReservations(currentPage, statusFilter);
    } catch (err: any) {
      alert("Hoàn thành thất bại: " + (err.response?.data?.message || "Lỗi"));
    }
  };

  // ============================================
  // Get status badge color
  // ============================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "DENIED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
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
            📅 Quản lý Đặt bàn
          </h1>
          <p className="text-gray-600">Danh sách tất cả các đặt bàn</p>
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
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="DENIED">Từ chối</option>
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
            <p className="mt-4 text-gray-600">Đang tải đặt bàn...</p>
          </div>
        )}

        {/* Reservations Table */}
        {!isLoading && reservations.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày / Giờ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Số khách
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
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {res.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {res.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(res.reservationDate).toLocaleDateString(
                        "vi-VN",
                      )}{" "}
                      {res.reservationTime.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      👥 {res.guestCount} người
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(res.status)}`}
                      >
                        {res.status === "PENDING" && "Chờ duyệt"}
                        {res.status === "APPROVED" && "Đã duyệt"}
                        {res.status === "DENIED" && "Từ chối"}
                        {res.status === "COMPLETED" && "Hoàn thành"}
                        {res.status === "CANCELLED" && "Bị hủy"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {res.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(res.id)}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            ✓ Duyệt
                          </button>
                          <button
                            onClick={() => handleDeny(res.id)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            ✗ Từ chối
                          </button>
                        </>
                      )}
                      {res.status === "APPROVED" && (
                        <button
                          onClick={() => handleComplete(res.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          ✓ Hoàn thành
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
        {!isLoading && reservations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Không có đặt bàn</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => fetchReservations(currentPage - 1, statusFilter)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              ← Trước
            </button>
            <span className="px-4 py-2">
              Trang {currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchReservations(currentPage + 1, statusFilter)}
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
