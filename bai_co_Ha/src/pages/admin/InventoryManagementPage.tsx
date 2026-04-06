/**
 * InventoryManagementPage - Complete CRUD for Inventory với Stock Management
 */

import React, { useState, useEffect } from "react";
import { validateName, validateNumber, validateRequired } from "../../utils/validation";
import { toast } from "sonner";
import {
  Plus,
  Package,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  Filter,
} from "lucide-react";
import { DataTable, Column } from "../../app/components/DataTable";
import { FormModal } from "../../app/components/Modal";
import { useConfirmDialog } from "../../app/components/ConfirmDialog";
import { InventoryStatusBadge } from "../../app/components/StatusBadge";
import { inventoryAPI } from "../../services/api";
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
import { Badge } from "../../app/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card";

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  minStock: number;
  category: string;
  price: number;
  supplierId: number;
  supplier: Supplier;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  description: string;
  quantity: string;
  unit: string;
  minStock: string;
  category: string;
  price: string;
  supplierId: string;
}

interface RestockFormData {
  quantity: string;
}

const CATEGORIES = [
  "INGREDIENTS",
  "BEVERAGES",
  "UTENSILS",
  "CLEANING",
  "OTHERS",
];

const UNITS = ["kg", "g", "liter", "ml", "pieces", "bottles", "packs", "boxes"];

export function InventoryManagementPage() {
  // States
  const [items, setItems] = useState<InventoryItem[]>([]);
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
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [restockingItem, setRestockingItem] = useState<InventoryItem | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    quantity: "",
    unit: "kg",
    minStock: "",
    category: "INGREDIENTS",
    price: "",
    supplierId: "1",
  });

  const [restockData, setRestockData] = useState<RestockFormData>({
    quantity: "",
  });

  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    criticalStockCount: 0,
    totalValue: 0,
  });

  // Confirm dialogs
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // ============================================
  // API Functions
  // ============================================

  const fetchItems = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const filters: any = {};

      if (categoryFilter !== "all") {
        filters.category = categoryFilter;
      }

      const response = await inventoryAPI.getAll(page, 10, search, filters);
      const data = response.data?.data || [];
      const meta = response.data?.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false,
      };

      // Filter by status locally for now
      let filteredData = data;
      if (statusFilter === "low") {
        filteredData = data.filter(
          (item: InventoryItem) => item.status === "LOW",
        );
      } else if (statusFilter === "critical") {
        filteredData = data.filter(
          (item: InventoryItem) => item.status === "CRITICAL",
        );
      }

      setItems(filteredData);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: statusFilter === "all" ? meta.total : filteredData.length,
        totalPages: Math.ceil(filteredData.length / meta.limit),
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      toast.error("Lỗi khi tải danh sách inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      // Fetch parallel requests
      const [allResponse, lowResponse, criticalResponse] = await Promise.all([
        inventoryAPI.getAll(1, 1000),
        inventoryAPI.getLowStock(),
        inventoryAPI.getCriticalStock(),
      ]);

      const allItems = allResponse.data?.data || [];
      const lowItems = lowResponse.data?.data || [];
      const criticalItems = criticalResponse.data?.data || [];

      setStats({
        totalItems: allItems.length,
        lowStockCount: lowItems.length,
        criticalStockCount: criticalItems.length,
        totalValue: allItems.reduce(
          (sum: number, item: InventoryItem) =>
            sum + item.quantity * item.price,
          0,
        ),
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateItem = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        minStock: parseInt(formData.minStock),
        category: formData.category,
        price: parseFloat(formData.price),
        supplierId: parseInt(formData.supplierId),
      };

      await inventoryAPI.create(payload);
      toast.success("Thêm item thành công!");
      setShowModal(false);
      resetForm();
      fetchItems(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error creating item:", error);
      toast.error(error.response?.data?.message || "Lỗi khi thêm item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        minStock: parseInt(formData.minStock),
        category: formData.category,
        price: parseFloat(formData.price),
        supplierId: parseInt(formData.supplierId),
      };

      await inventoryAPI.update(editingItem.id, payload);
      toast.success("Cập nhật item thành công!");
      setShowModal(false);
      resetForm();
      fetchItems(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error updating item:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestock = async () => {
    if (!restockingItem) return;

    try {
      setIsSubmitting(true);
      const quantity = parseInt(restockData.quantity);

      await inventoryAPI.restock(restockingItem.id, quantity);
      toast.success(`Nhập kho thành công ${quantity} ${restockingItem.unit}!`);
      setShowRestockModal(false);
      setRestockData({ quantity: "" });
      setRestockingItem(null);
      fetchItems(pagination.page);
      fetchStats();
    } catch (error: any) {
      console.error("Error restocking:", error);
      toast.error(error.response?.data?.message || "Lỗi khi nhập kho");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    showConfirm({
      title: "Xóa sản phẩm",
      message: `Bạn có chắc chắn muốn xóa "${item.name}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await inventoryAPI.delete(item.id);
          toast.success("Xóa item thành công!");
          fetchItems(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error deleting item:", error);
          toast.error(error.response?.data?.message || "Lỗi khi xóa item");
        }
      },
    });
  };

  // ============================================
  // Form Functions
  // ============================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      quantity: "",
      unit: "kg",
      minStock: "",
      category: "INGREDIENTS",
      price: "",
      supplierId: "1",
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minStock: item.minStock.toString(),
      category: item.category,
      price: item.price.toString(),
      supplierId: item.supplierId.toString(),
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const handleRestockAction = (item: InventoryItem) => {
    setRestockingItem(item);
    setRestockData({ quantity: "" });
    setShowRestockModal(true);
  };

  const handleSubmit = () => {
    // Validate name
    const nameValidation = validateName(formData.name, "Tên sản phẩm");
    if (!nameValidation.isValid) {
      toast.error(nameValidation.message);
      return;
    }

    // Validate quantity
    const quantityValidation = validateNumber(
      formData.quantity,
      0,
      999999,
      "Số lượng"
    );
    if (!quantityValidation.isValid) {
      toast.error(quantityValidation.message);
      return;
    }

    // Validate minStock
    const minStockValidation = validateNumber(
      formData.minStock,
      0,
      999999,
      "Tồn kho tối thiểu"
    );
    if (!minStockValidation.isValid) {
      toast.error(minStockValidation.message);
      return;
    }

    // Validate price
    const priceValidation = validateNumber(
      formData.price,
      0,
      99999999.99,
      "Giá"
    );
    if (!priceValidation.isValid) {
      toast.error(priceValidation.message);
      return;
    }

    // Business validation: minStock should not be greater than quantity
    const quantity = parseInt(formData.quantity);
    const minStock = parseInt(formData.minStock);

    if (minStock > quantity) {
      toast.error("Tồn kho tối thiểu không được lớn hơn số lượng hiện tại");
      return;
    }

    // Validate required fields
    const supplierValidation = validateRequired(formData.supplierId, "Nhà cung cấp");
    if (!supplierValidation.isValid) {
      toast.error(supplierValidation.message);
      return;
    }

    const unitValidation = validateRequired(formData.unit, "Đơn vị");
    if (!unitValidation.isValid) {
      toast.error(unitValidation.message);
      return;
    }

    if (editingItem) {
      handleUpdateItem();
    } else {
      handleCreateItem();
    }
  };

  const handleRestockSubmit = () => {
    const quantityValidation = validateNumber(
      restockData.quantity,
      1,
      999999,
      "Số lượng nhập"
    );
    if (!quantityValidation.isValid) {
      toast.error(quantityValidation.message);
      return;
    }

    handleRestock();
  };

  // ============================================
  // Table Configuration
  // ============================================

  const columns: Column<InventoryItem>[] = [
    {
      key: "name",
      header: "Tên sản phẩm",
      sortable: true,
      searchable: true,
    },
    {
      key: "category",
      header: "Danh mục",
      render: (category: string) => <Badge variant="outline">{category}</Badge>,
    },
    {
      key: "quantity",
      header: "Số lượng",
      sortable: true,
      render: (quantity: number, item: InventoryItem) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">
            {quantity} {item.unit}
          </span>
          {quantity <= item.minStock && (
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          )}
        </div>
      ),
    },
    {
      key: "minStock",
      header: "Tối thiểu",
      render: (minStock: number, item: InventoryItem) => (
        <span className="text-gray-600">
          {minStock} {item.unit}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (status: string) => <InventoryStatusBadge status={status} />,
    },
    {
      key: "price",
      header: "Đơn giá",
      sortable: true,
      render: (price: number) => (
        <span className="font-semibold text-green-600">
          {price?.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      key: "supplier",
      header: "Nhà cung cấp",
      render: (supplier: Supplier) => supplier?.name || "N/A",
    },
  ];

  // Custom actions for each row
  const renderActions = (item: InventoryItem) => (
    <div className="flex items-center space-x-2">
      {item.status !== "GOOD" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRestockAction(item)}
          className="text-blue-600"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Nhập kho
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
        Sửa
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleDeleteItem(item)}
      >
        Xóa
      </Button>
    </div>
  );

  // Filter component
  const renderFilters = () => (
    <div className="flex items-center space-x-2">
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="low">Sắp hết</SelectItem>
          <SelectItem value="critical">Hết hàng</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, [categoryFilter, statusFilter]);

  // ============================================
  // Render
  // ============================================

  const modalTitle = editingItem ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý kho</h1>
          <p className="text-gray-600 mt-1">Theo dõi tình trạng hàng tồn kho</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statsLoading ? "..." : stats.lowStockCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsLoading ? "..." : stats.criticalStockCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading
                ? "..."
                : `${stats.totalValue.toLocaleString("vi-VN")} VNĐ`}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchItems(page)}
        onSearch={(search) => fetchItems(1, search)}
        onAdd={handleAdd}
        actions={renderActions}
        filters={renderFilters()}
        searchPlaceholder="Tìm kiếm sản phẩm..."
        emptyMessage="Chưa có sản phẩm nào"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Thịt bò Úc"
              />
            </div>

            <div>
              <Label htmlFor="category">Danh mục *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="quantity">Số lượng *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder="100"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="unit">Đơn vị *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) =>
                    setFormData({ ...formData, unit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="minStock">Tồn kho tối thiểu *</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({ ...formData, minStock: e.target.value })
                }
                placeholder="10"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="price">Đơn giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="50000"
                min="0"
                step="1000"
              />
            </div>

            <div>
              <Label htmlFor="supplierId">Nhà cung cấp *</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) =>
                  setFormData({ ...formData, supplierId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ABC Food Supply</SelectItem>
                  <SelectItem value="2">Fresh Ingredients Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả sản phẩm..."
              />
            </div>
          </div>
        </div>
      </FormModal>

      {/* Restock Modal */}
      <FormModal
        isOpen={showRestockModal}
        onClose={() => setShowRestockModal(false)}
        title={`Nhập kho - ${restockingItem?.name}`}
        onSubmit={handleRestockSubmit}
        isSubmitting={isSubmitting}
        submitText="Nhập kho"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              <strong>Tên:</strong> {restockingItem?.name}
            </p>
            <p>
              <strong>Tồn kho hiện tại:</strong> {restockingItem?.quantity}{" "}
              {restockingItem?.unit}
            </p>
            <p>
              <strong>Tối thiểu:</strong> {restockingItem?.minStock}{" "}
              {restockingItem?.unit}
            </p>
          </div>

          <div>
            <Label htmlFor="restockQuantity">Số lượng nhập thêm *</Label>
            <Input
              id="restockQuantity"
              type="number"
              value={restockData.quantity}
              onChange={(e) => setRestockData({ quantity: e.target.value })}
              placeholder="Nhập số lượng cần thêm..."
              min="1"
              autoFocus
            />
          </div>

          {restockData.quantity && restockingItem && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p>
                <strong>Tồn kho sau nhập:</strong>{" "}
                {restockingItem.quantity +
                  parseInt(restockData.quantity || "0")}{" "}
                {restockingItem.unit}
              </p>
            </div>
          )}
        </div>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
