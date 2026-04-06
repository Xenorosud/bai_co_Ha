/**
 * TableManagementPage - Complete Table Management với Status Control
 */

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Users, MapPin, Clock, Filter } from "lucide-react";
import { DataTable, Column } from "../../app/components/DataTable";
import { FormModal } from "../../app/components/Modal";
import { useConfirmDialog } from "../../app/components/ConfirmDialog";
import { TableStatusBadge } from "../../app/components/StatusBadge";
import { tablesAPI } from "../../services/api";
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

interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  tableNumber: string;
  capacity: string;
  location: string;
  status: string;
}

const TABLE_STATUSES = [
  { value: "EMPTY", label: "Trống" },
  { value: "OCCUPIED", label: "Có khách" },
  { value: "RESERVED", label: "Đã đặt" },
  { value: "CLEANING", label: "Dọn dẹp" },
];

const LOCATIONS = [
  "Tầng 1",
  "Tầng 2",
  "Tầng 3",
  "Sân thượng",
  "Khu VIP",
  "Ban công",
];

export function TableManagementPage() {
  // States
  const [tables, setTables] = useState<Table[]>([]);
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
  const [locationFilter, setLocationFilter] = useState<string>("all");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    tableNumber: "",
    capacity: "",
    location: "Tầng 1",
    status: "EMPTY",
  });

  // Stats
  const [stats, setStats] = useState({
    totalTables: 0,
    availableTables: 0,
    occupiedTables: 0,
    reservedTables: 0,
  });

  // Confirm dialog
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // ============================================
  // API Functions
  // ============================================

  const fetchTables = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await tablesAPI.getAll(page, 10, search);
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
      if (statusFilter !== "all") {
        filteredData = data.filter(
          (table: Table) => table.status === statusFilter,
        );
      }
      if (locationFilter !== "all") {
        filteredData = filteredData.filter(
          (table: Table) => table.location === locationFilter,
        );
      }

      setTables(filteredData);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / meta.limit),
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching tables:", error);
      toast.error("Lỗi khi tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await tablesAPI.getAll(1, 1000);
      const allTables = response.data?.data || [];

      setStats({
        totalTables: allTables.length,
        availableTables: allTables.filter((t: Table) => t.status === "EMPTY")
          .length,
        occupiedTables: allTables.filter((t: Table) => t.status === "OCCUPIED")
          .length,
        reservedTables: allTables.filter((t: Table) => t.status === "RESERVED")
          .length,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        tableNumber: formData.tableNumber.trim(),
        capacity: parseInt(formData.capacity),
        location: formData.location,
        status: formData.status,
      };

      await tablesAPI.create(payload);
      toast.success("Thêm bàn thành công!");
      setShowModal(false);
      resetForm();
      fetchTables(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error creating table:", error);
      toast.error(error.response?.data?.message || "Lỗi khi thêm bàn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingTable) return;

    try {
      setIsSubmitting(true);
      const payload = {
        tableNumber: formData.tableNumber.trim(),
        capacity: parseInt(formData.capacity),
        location: formData.location,
        status: formData.status,
      };

      await tablesAPI.update(editingTable.id, payload);
      toast.success("Cập nhật bàn thành công!");
      setShowModal(false);
      resetForm();
      fetchTables(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error updating table:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật bàn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (table: Table) => {
    showConfirm({
      title: "Xóa bàn",
      message: `Bạn có chắc chắn muốn xóa bàn "${table.tableNumber}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await tablesAPI.delete(table.id);
          toast.success("Xóa bàn thành công!");
          fetchTables(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error deleting table:", error);
          toast.error(error.response?.data?.message || "Lỗi khi xóa bàn");
        }
      },
    });
  };

  const handleStatusChange = async (table: Table, newStatus: string) => {
    try {
      await tablesAPI.update(table.id, { status: newStatus });
      toast.success(`Cập nhật trạng thái bàn ${table.tableNumber} thành công!`);
      fetchTables(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // ============================================
  // Form Functions
  // ============================================

  const resetForm = () => {
    setFormData({
      tableNumber: "",
      capacity: "",
      location: "Tầng 1",
      status: "EMPTY",
    });
    setEditingTable(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (table: Table) => {
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity.toString(),
      location: table.location,
      status: table.status,
    });
    setEditingTable(table);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.tableNumber.trim() || !formData.capacity) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (
      isNaN(parseInt(formData.capacity)) ||
      parseInt(formData.capacity) <= 0
    ) {
      toast.error("Sức chứa phải là số dương");
      return;
    }

    if (editingTable) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // ============================================
  // Table Configuration
  // ============================================

  const columns: Column<Table>[] = [
    {
      key: "tableNumber",
      header: "Số bàn",
      sortable: true,
      searchable: true,
      render: (tableNumber: string) => (
        <div className="font-semibold text-lg">{tableNumber}</div>
      ),
    },
    {
      key: "capacity",
      header: "Sức chứa",
      sortable: true,
      render: (capacity: number) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          <span>{capacity} người</span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Vị trí",
      render: (location: string) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
          <span>{location}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (status: string, table: Table) => (
        <div className="flex items-center space-x-2">
          <TableStatusBadge status={status} />
          <Select
            value={status}
            onValueChange={(newStatus) => handleStatusChange(table, newStatus)}
          >
            <SelectTrigger className="w-auto h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABLE_STATUSES.map((s) => (
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

  // Filter component
  const renderFilters = () => (
    <div className="flex items-center space-x-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          {TABLE_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={locationFilter} onValueChange={setLocationFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Vị trí" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả vị trí</SelectItem>
          {LOCATIONS.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    fetchTables();
    fetchStats();
  }, [statusFilter, locationFilter]);

  // ============================================
  // Render
  // ============================================

  const modalTitle = editingTable ? "Chỉnh sửa bàn" : "Thêm bàn mới";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý bàn</h1>
          <p className="text-gray-600 mt-1">Quản lý bàn ăn và trạng thái</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số bàn</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalTables}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bàn trống</CardTitle>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {statsLoading ? "..." : stats.availableTables}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có khách</CardTitle>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsLoading ? "..." : stats.occupiedTables}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã đặt</CardTitle>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsLoading ? "..." : stats.reservedTables}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={tables}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchTables(page)}
        onSearch={(search) => fetchTables(1, search)}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={renderFilters()}
        searchPlaceholder="Tìm kiếm số bàn..."
        emptyMessage="Chưa có bàn nào"
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="tableNumber">Số bàn *</Label>
            <Input
              id="tableNumber"
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: e.target.value })
              }
              placeholder="VD: B01, A15, VIP-1"
            />
          </div>

          <div>
            <Label htmlFor="capacity">Sức chứa (người) *</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              placeholder="VD: 4"
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="location">Vị trí *</Label>
            <Select
              value={formData.location}
              onValueChange={(value) =>
                setFormData({ ...formData, location: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vị trí" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Trạng thái *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {TABLE_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
