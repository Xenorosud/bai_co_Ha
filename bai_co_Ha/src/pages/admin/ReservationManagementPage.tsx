/**
 * ReservationManagementPage - Quản lý Đặt bàn với Approval Workflow
 */

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Calendar,
  Users,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { DataTable, Column } from "../../app/components/DataTable";
import { FormModal } from "../../app/components/Modal";
import { useConfirmDialog } from "../../app/components/ConfirmDialog";
import { ReservationStatusBadge } from "../../app/components/StatusBadge";
import { reservationsAPI, tablesAPI } from "../../services/api";
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

interface Reservation {
  id: number;
  tableId?: number;
  tableNumber?: string;
  customerName: string;
  phone: string;
  email: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialRequests?: string;
  higherTable: boolean;
  status: string;
  submittedAt: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  location: string;
  status: string;
}

const RESERVATION_STATUSES = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SEATED", label: "Đã vào bàn" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "NO_SHOW", label: "Không đến" },
];

export function ReservationManagementPage() {
  // States
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
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
  const [dateFilter, setDateFilter] = useState<string>("");
  const [guestCountFilter, setGuestCountFilter] = useState<string>("all");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [viewingReservation, setViewingReservation] =
    useState<Reservation | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<string>("");

  // Stats
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    completedReservations: 0,
    todayReservations: 0,
  });

  // Confirm dialog
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // ============================================
  // API Functions
  // ============================================

  const fetchReservations = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await reservationsAPI.getAll(
        page,
        10,
        statusFilter !== "all" ? statusFilter : undefined,
      );
      const data = response.data?.data || [];
      const meta = response.data?.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false,
      };

      // Filter locally
      let filteredData = data;
      if (dateFilter) {
        filteredData = data.filter(
          (reservation: Reservation) =>
            reservation.reservationDate === dateFilter,
        );
      }
      if (guestCountFilter !== "all") {
        const guestCount = parseInt(guestCountFilter);
        filteredData = filteredData.filter(
          (reservation: Reservation) => reservation.guestCount === guestCount,
        );
      }
      if (search) {
        filteredData = filteredData.filter(
          (reservation: Reservation) =>
            reservation.customerName
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            reservation.phone.includes(search) ||
            reservation.email.toLowerCase().includes(search.toLowerCase()),
        );
      }

      setReservations(filteredData);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / meta.limit),
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching reservations:", error);
      toast.error("Lỗi khi tải danh sách đặt bàn");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await reservationsAPI.getAll(1, 1000);
      const allReservations = response.data?.data || [];
      const today = new Date().toISOString().split("T")[0];

      setStats({
        totalReservations: allReservations.length,
        pendingReservations: allReservations.filter(
          (r: Reservation) => r.status === "PENDING",
        ).length,
        confirmedReservations: allReservations.filter(
          (r: Reservation) => r.status === "CONFIRMED",
        ).length,
        completedReservations: allReservations.filter(
          (r: Reservation) => r.status === "COMPLETED",
        ).length,
        todayReservations: allReservations.filter(
          (r: Reservation) => r.reservationDate === today,
        ).length,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchAvailableTables = async (
    guestCount: number,
    date: string,
    time: string,
  ) => {
    try {
      const response = await tablesAPI.findForGuests(guestCount);
      setAvailableTables(response.data?.data || []);
    } catch (error: any) {
      console.error("Error fetching available tables:", error);
      setAvailableTables([]);
    }
  };

  const handleApprove = async (reservation: Reservation, tableId?: number) => {
    showConfirm({
      title: "Xác nhận đặt bàn",
      message: `Bạn có chắc chắn muốn xác nhận đặt bàn cho khách hàng "${reservation.customerName}"?`,
      onConfirm: async () => {
        try {
          await reservationsAPI.approve(reservation.id, tableId);
          toast.success("Xác nhận đặt bàn thành công!");
          fetchReservations(pagination.page);
          fetchStats();
          setShowApprovalModal(false);
          setViewingReservation(null);
        } catch (error: any) {
          console.error("Error approving reservation:", error);
          toast.error(
            error.response?.data?.message || "Lỗi khi xác nhận đặt bàn",
          );
        }
      },
    });
  };

  const handleDeny = async (reservation: Reservation) => {
    showConfirm({
      title: "Từ chối đặt bàn",
      message: `Bạn có chắc chắn muốn từ chối đặt bàn cho khách hàng "${reservation.customerName}"?`,
      variant: "warning",
      onConfirm: async () => {
        try {
          await reservationsAPI.deny(reservation.id);
          toast.success("Từ chối đặt bàn thành công!");
          fetchReservations(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error denying reservation:", error);
          toast.error(
            error.response?.data?.message || "Lỗi khi từ chối đặt bàn",
          );
        }
      },
    });
  };

  const handleComplete = async (reservation: Reservation) => {
    showConfirm({
      title: "Hoàn thành đặt bàn",
      message: `Khách hàng "${reservation.customerName}" đã hoàn thành bữa ăn?`,
      variant: "success",
      onConfirm: async () => {
        try {
          await reservationsAPI.complete(reservation.id);
          toast.success("Đánh dấu hoàn thành thành công!");
          fetchReservations(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error completing reservation:", error);
          toast.error(
            error.response?.data?.message || "Lỗi khi hoàn thành đặt bàn",
          );
        }
      },
    });
  };

  const handleCancel = async (reservation: Reservation) => {
    showConfirm({
      title: "Hủy đặt bàn",
      message: `Bạn có chắc chắn muốn hủy đặt bàn "${reservation.customerName}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await reservationsAPI.cancel(reservation.id);
          toast.success("Hủy đặt bàn thành công!");
          fetchReservations(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error cancelling reservation:", error);
          toast.error(error.response?.data?.message || "Lỗi khi hủy đặt bàn");
        }
      },
    });
  };

  const handleViewReservation = (reservation: Reservation) => {
    setViewingReservation(reservation);
    setShowDetailModal(true);
  };

  const handleShowApprovalModal = async (reservation: Reservation) => {
    setViewingReservation(reservation);
    await fetchAvailableTables(
      reservation.guestCount,
      reservation.reservationDate,
      reservation.reservationTime,
    );
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = () => {
    if (!viewingReservation) return;

    const tableId = selectedTableId ? parseInt(selectedTableId) : undefined;
    handleApprove(viewingReservation, tableId);
  };

  // ============================================
  // Table Configuration
  // ============================================

  const columns: Column<Reservation>[] = [
    {
      key: "customerName",
      header: "Khách hàng",
      sortable: true,
      searchable: true,
      render: (customerName: string, reservation: Reservation) => (
        <div>
          <div className="font-semibold">{customerName}</div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="w-3 h-3 mr-1" />
            {reservation.phone}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="w-3 h-3 mr-1" />
            {reservation.email}
          </div>
        </div>
      ),
    },
    {
      key: "reservationDate",
      header: "Ngày & Giờ",
      sortable: true,
      render: (date: string, reservation: Reservation) => (
        <div>
          <div className="flex items-center font-medium">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {new Date(date).toLocaleDateString("vi-VN")}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            {reservation.reservationTime}
          </div>
        </div>
      ),
    },
    {
      key: "guestCount",
      header: "Số khách",
      sortable: true,
      render: (guestCount: number, reservation: Reservation) => (
        <div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">{guestCount} người</span>
          </div>
          {reservation.higherTable && (
            <div className="text-xs text-blue-600 mt-1">Yêu cầu bàn cao</div>
          )}
        </div>
      ),
    },
    {
      key: "tableNumber",
      header: "Bàn",
      render: (tableNumber: string) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{tableNumber ? `Bàn ${tableNumber}` : "Chưa chọn"}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (status: string) => <ReservationStatusBadge status={status} />,
    },
    {
      key: "specialRequests",
      header: "Ghi chú",
      render: (specialRequests: string) => (
        <div className="max-w-xs">
          {specialRequests ? (
            <div
              className="text-sm text-gray-600 truncate"
              title={specialRequests}
            >
              {specialRequests}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Không có</span>
          )}
        </div>
      ),
    },
    {
      key: "submittedAt",
      header: "Đặt lúc",
      sortable: true,
      render: (submittedAt: string) => (
        <div className="text-sm text-gray-500">
          {new Date(submittedAt).toLocaleString("vi-VN")}
        </div>
      ),
    },
  ];

  // Custom actions for DataTable
  const customActions = (reservation: Reservation) => [
    {
      label: "Xem chi tiết",
      icon: Eye,
      onClick: () => handleViewReservation(reservation),
      className: "text-blue-600 hover:text-blue-800",
    },
    ...(reservation.status === "PENDING"
      ? [
          {
            label: "Xác nhận",
            icon: CheckCircle,
            onClick: () => handleShowApprovalModal(reservation),
            className: "text-green-600 hover:text-green-800",
          },
          {
            label: "Từ chối",
            icon: XCircle,
            onClick: () => handleDeny(reservation),
            className: "text-red-600 hover:text-red-800",
          },
        ]
      : []),
    ...(reservation.status === "CONFIRMED"
      ? [
          {
            label: "Hoàn thành",
            onClick: () => handleComplete(reservation),
            className: "text-green-600 hover:text-green-800",
          },
        ]
      : []),
    ...(["PENDING", "CONFIRMED"].includes(reservation.status)
      ? [
          {
            label: "Hủy bỏ",
            onClick: () => handleCancel(reservation),
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
          {RESERVATION_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
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

      <Select value={guestCountFilter} onValueChange={setGuestCountFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Số khách" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="1">1 người</SelectItem>
          <SelectItem value="2">2 người</SelectItem>
          <SelectItem value="4">4 người</SelectItem>
          <SelectItem value="6">6 người</SelectItem>
          <SelectItem value="8">8+ người</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    fetchReservations();
    fetchStats();
  }, [statusFilter, dateFilter, guestCountFilter]);

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đặt bàn</h1>
          <p className="text-gray-600 mt-1">
            Xử lý yêu cầu đặt bàn và phân bàn
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đặt bàn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalReservations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsLoading ? "..." : stats.pendingReservations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : stats.confirmedReservations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statsLoading ? "..." : stats.completedReservations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statsLoading ? "..." : stats.todayReservations}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={reservations}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchReservations(page)}
        onSearch={(search) => fetchReservations(1, search)}
        onEdit={(reservation) => handleViewReservation(reservation)}
        customActions={customActions}
        filters={renderFilters()}
        searchPlaceholder="Tìm kiếm khách hàng, SĐT, email..."
        emptyMessage="Chưa có đặt bàn nào"
      />

      {/* Reservation Detail Modal */}
      <FormModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Chi tiết đặt bàn - ${viewingReservation?.customerName}`}
        onSubmit={() => setShowDetailModal(false)}
        submitText="Đóng"
        size="lg"
      >
        {viewingReservation && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên khách hàng</Label>
                <div className="font-semibold">
                  {viewingReservation.customerName}
                </div>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <div className="mt-1">
                  <ReservationStatusBadge status={viewingReservation.status} />
                </div>
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <div>{viewingReservation.phone}</div>
              </div>
              <div>
                <Label>Email</Label>
                <div>{viewingReservation.email}</div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày đặt</Label>
                <div>
                  {new Date(
                    viewingReservation.reservationDate,
                  ).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div>
                <Label>Giờ đặt</Label>
                <div>{viewingReservation.reservationTime}</div>
              </div>
              <div>
                <Label>Số khách</Label>
                <div>{viewingReservation.guestCount} người</div>
              </div>
              {viewingReservation.tableNumber && (
                <div>
                  <Label>Bàn được chọn</Label>
                  <div>Bàn {viewingReservation.tableNumber}</div>
                </div>
              )}
            </div>

            {/* Special Requests */}
            {viewingReservation.specialRequests && (
              <div>
                <Label>Yêu cầu đặc biệt</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  {viewingReservation.specialRequests}
                </div>
              </div>
            )}

            {/* Higher Table Request */}
            {viewingReservation.higherTable && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="text-blue-700 font-medium">Yêu cầu bàn cao</div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <Label>Thời gian đặt</Label>
                <div>
                  {new Date(viewingReservation.submittedAt).toLocaleString(
                    "vi-VN",
                  )}
                </div>
              </div>
              {viewingReservation.approvedAt && (
                <div>
                  <Label>Thời gian duyệt</Label>
                  <div>
                    {new Date(viewingReservation.approvedAt).toLocaleString(
                      "vi-VN",
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </FormModal>

      {/* Table Approval Modal */}
      <FormModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Xác nhận đặt bàn & Chọn bàn"
        onSubmit={handleApprovalSubmit}
        submitText="Xác nhận"
        size="md"
      >
        {viewingReservation && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-900">
                {viewingReservation.customerName}
              </div>
              <div className="text-blue-700">
                {viewingReservation.guestCount} khách •{" "}
                {new Date(
                  viewingReservation.reservationDate,
                ).toLocaleDateString("vi-VN")}{" "}
                • {viewingReservation.reservationTime}
              </div>
            </div>

            <div>
              <Label htmlFor="tableSelect">Chọn bàn (tuỳ chọn)</Label>
              <Select
                value={selectedTableId}
                onValueChange={setSelectedTableId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bàn hoặc để trống" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không chọn bàn cụ thể</SelectItem>
                  {availableTables.map((table) => (
                    <SelectItem key={table.id} value={table.id.toString()}>
                      Bàn {table.tableNumber} ({table.capacity} chỗ) -{" "}
                      {table.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {availableTables.length === 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                Không tìm thấy bàn phù hợp. Bạn vẫn có thể xác nhận và sắp xếp
                bàn sau.
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
