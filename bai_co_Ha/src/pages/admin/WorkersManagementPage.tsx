/**
 * WorkersManagementPage - Quản lý Nhân viên với Complete CRUD Operations
 */

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { validateEmail, validatePhone, validateName, validateRequired, validateDate } from "../../utils/validation";
import { Plus, Users, UserCheck, UserX, Calendar, Shield, Mail, Phone, Clock } from "lucide-react";
import { DataTable, Column } from "../../app/components/DataTable";
import { FormModal } from "../../app/components/Modal";
import { useConfirmDialog } from "../../app/components/ConfirmDialog";
import { EmployeeStatusBadge } from "../../app/components/StatusBadge";
import { employeesAPI } from "../../services/api";
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
import { Checkbox } from "../../app/components/ui/checkbox";

interface Employee {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: {
    dashboard: boolean;
    foodManagement: boolean;
    orderManagement: boolean;
    tableManagement: boolean;
    reservationManagement: boolean;
    paymentManagement: boolean;
    inventoryManagement: boolean;
    workersManagement: boolean;
  };
  status: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  hireDate: string;
  permissions: {
    dashboard: boolean;
    foodManagement: boolean;
    orderManagement: boolean;
    tableManagement: boolean;
    reservationManagement: boolean;
    paymentManagement: boolean;
    inventoryManagement: boolean;
    workersManagement: boolean;
  };
}

const EMPLOYEE_ROLES = [
  "Administrator",
  "Manager",
  "Server",
  "Chef",
  "Cashier",
  "Host"
];

const PERMISSION_LABELS = {
  dashboard: "Truy cập Dashboard",
  foodManagement: "Quản lý Thực phẩm",
  orderManagement: "Quản lý Đơn hàng",
  tableManagement: "Quản lý Bàn",
  reservationManagement: "Quản lý Đặt bàn",
  paymentManagement: "Quản lý Thanh toán",
  inventoryManagement: "Quản lý Kho",
  workersManagement: "Quản lý Nhân viên (Admin)",
};

export function WorkersManagementPage() {
  // States
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    role: "Server",
    hireDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    permissions: {
      dashboard: true,
      foodManagement: false,
      orderManagement: false,
      tableManagement: false,
      reservationManagement: false,
      paymentManagement: false,
      inventoryManagement: false,
      workersManagement: false,
    },
  });

  // Stats
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    adminCount: 0,
  });

  // Confirm dialog
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // ============================================
  // API Functions
  // ============================================

  const fetchEmployees = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await employeesAPI.getAll(page, 10, statusFilter !== "all" ? statusFilter : undefined);
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
      if (roleFilter !== "all") {
        filteredData = data.filter(
          (employee: Employee) => employee.role.toLowerCase() === roleFilter.toLowerCase()
        );
      }
      if (search) {
        filteredData = filteredData.filter(
          (employee: Employee) =>
            employee.name.toLowerCase().includes(search.toLowerCase()) ||
            employee.email.toLowerCase().includes(search.toLowerCase()) ||
            employee.role.toLowerCase().includes(search.toLowerCase())
        );
      }

      setEmployees(filteredData);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / meta.limit),
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast.error("Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await employeesAPI.getAll(1, 1000);
      const allEmployees = response.data?.data || [];

      setStats({
        totalEmployees: allEmployees.length,
        activeEmployees: allEmployees.filter((e: Employee) => e.status === "ACTIVE").length,
        inactiveEmployees: allEmployees.filter((e: Employee) => e.status === "INACTIVE").length,
        adminCount: allEmployees.filter((e: Employee) => e.role === "Administrator").length,
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
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        hireDate: formData.hireDate,
        permissions: formData.permissions,
      };

      await employeesAPI.create(payload);
      toast.success("Thêm nhân viên thành công!");
      setShowModal(false);
      resetForm();
      fetchEmployees(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast.error(error.response?.data?.message || "Lỗi khi thêm nhân viên");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingEmployee) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        hireDate: formData.hireDate,
        permissions: formData.permissions,
      };

      await employeesAPI.update(editingEmployee.id, payload);
      toast.success("Cập nhật nhân viên thành công!");
      setShowModal(false);
      resetForm();
      fetchEmployees(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật nhân viên");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    showConfirm({
      title: "Xóa nhân viên",
      message: `Bạn có chắc chắn muốn xóa nhân viên "${employee.name}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await employeesAPI.delete(employee.id);
          toast.success("Xóa nhân viên thành công!");
          fetchEmployees(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error deleting employee:", error);
          toast.error(error.response?.data?.message || "Lỗi khi xóa nhân viên");
        }
      },
    });
  };

  const handleStatusToggle = async (employee: Employee) => {
    try {
      await employeesAPI.toggleStatus(employee.id);
      const newStatus = employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      toast.success(`${newStatus === "ACTIVE" ? "Kích hoạt" : "Vô hiệu hóa"} nhân viên thành công!`);
      fetchEmployees(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast.error("Lỗi khi cập nhật trạng thái nhân viên");
    }
  };

  // ============================================
  // Form Functions
  // ============================================

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Server",
      hireDate: new Date().toISOString().split('T')[0],
      permissions: {
        dashboard: true,
        foodManagement: false,
        orderManagement: false,
        tableManagement: false,
        reservationManagement: false,
        paymentManagement: false,
        inventoryManagement: false,
        workersManagement: false,
      },
    });
    setEditingEmployee(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
      permissions: { ...employee.permissions },
    });
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleSubmit = () => {
    // Validate all fields
    const nameValidation = validateName(formData.name, "Họ tên");
    if (!nameValidation.isValid) {
      toast.error(nameValidation.message);
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.message);
      return;
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.message);
      return;
    }

    // Validate hire date
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 50); // Not older than 50 years

    const hireDateValidation = validateDate(
      formData.hireDate,
      oneYearAgo, // Min date: 50 years ago
      today, // Max date: today
      "Ngày nhận việc"
    );
    if (!hireDateValidation.isValid) {
      toast.error(hireDateValidation.message);
      return;
    }

    const roleValidation = validateRequired(formData.role, "Vai trò");
    if (!roleValidation.isValid) {
      toast.error(roleValidation.message);
      return;
    }

    // Additional business validations
    if (formData.email.toLowerCase().includes('admin') && formData.role !== 'Admin') {
      toast.error("Email chứa 'admin' chỉ được sử dụng cho vai trò Administrator");
      return;
    }

    if (editingEmployee) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const togglePermission = (permission: keyof Employee["permissions"]) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission],
      },
    });
  };

  // ============================================
  // Table Configuration
  // ============================================

  const columns: Column<Employee>[] = [
    {
      key: "name",
      header: "Nhân viên",
      sortable: true,
      searchable: true,
      render: (name: string, employee: Employee) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
            {name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-sm text-gray-500">{employee.role}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Liên hệ",
      render: (email: string, employee: Employee) => (
        <div>
          <div className="flex items-center mb-1">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm">{email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600">{employee.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (status: string, employee: Employee) => (
        <div className="flex items-center space-x-2">
          <EmployeeStatusBadge status={status} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusToggle(employee)}
            className="text-xs"
          >
            {status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"}
          </Button>
        </div>
      ),
    },
    {
      key: "permissions",
      header: "Quyền",
      render: (permissions: Employee["permissions"]) => {
        const activePermissions = Object.entries(permissions)
          .filter(([_, value]) => value)
          .length;
        return (
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">
              {activePermissions}/{Object.keys(permissions).length} quyền
            </span>
          </div>
        );
      },
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
          <SelectItem value="ACTIVE">Hoạt động</SelectItem>
          <SelectItem value="INACTIVE">Tạm ngưng</SelectItem>
        </SelectContent>
      </Select>

      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả vai trò</SelectItem>
          {EMPLOYEE_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
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
    fetchEmployees();
    fetchStats();
  }, [statusFilter, roleFilter]);

  // ============================================
  // Render
  // ============================================

  const modalTitle = editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
          <p className="text-gray-600 mt-1">Quản lý nhân viên và phân quyền</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalEmployees}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : stats.activeEmployees}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm ngưng</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsLoading ? "..." : stats.inactiveEmployees}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statsLoading ? "..." : stats.adminCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={employees}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchEmployees(page)}
        onSearch={(search) => fetchEmployees(1, search)}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={renderFilters()}
        searchPlaceholder="Tìm kiếm nhân viên..."
        emptyMessage="Chưa có nhân viên nào"
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold mb-4">Thông tin cơ bản</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div>
                <Label htmlFor="role">Vai trò *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="VD: nhanvien@restora.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="VD: 0123456789"
                />
              </div>

              <div>
                <Label htmlFor="hireDate">Ngày nhận việc *</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  max={new Date().toISOString().split('T')[0]} // Cannot select future dates
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h4 className="font-semibold mb-4">Phân quyền</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-3">
                  <Checkbox
                    id={key}
                    checked={formData.permissions[key as keyof typeof formData.permissions]}
                    onCheckedChange={() =>
                      togglePermission(key as keyof Employee["permissions"])
                    }
                  />
                  <Label htmlFor={key} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}