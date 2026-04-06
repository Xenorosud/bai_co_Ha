/**
 * FoodManagementPage - Complete CRUD for Dishes với API
 */

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload, Tag, DollarSign } from "lucide-react";
import { DataTable, Column } from "../../app/components/DataTable";
import { FormModal } from "../../app/components/Modal";
import { useConfirmDialog } from "../../app/components/ConfirmDialog";
import { LoadingSpinner } from "../../app/components/LoadingSpinner";
import { dishesAPI } from "../../services/api";
import { Button } from "../../app/components/ui/button";
import { Input } from "../../app/components/ui/input";
import { Label } from "../../app/components/ui/label";
import { Textarea } from "../../app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select";
import { Badge } from "../../app/components/ui/badge";

interface DishType {
  id: number;
  name: string;
  description: string;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  typeId: number;
  type: DishType;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  image: string;
  typeId: string;
}

export function FoodManagementPage() {
  // States
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishTypes, setDishTypes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    image: "",
    typeId: "",
  });

  // Confirm dialog
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // ============================================
  // API Functions
  // ============================================

  const fetchDishes = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await dishesAPI.getAll(page, 10, search);
      const data = response.data?.data || [];
      const meta = response.data?.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false,
      };

      setDishes(data);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        totalPages: meta.totalPages,
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching dishes:", error);
      toast.error("Lỗi khi tải danh sách món ăn");
    } finally {
      setLoading(false);
    }
  };

  const fetchDishTypes = async () => {
    try {
      // Mock dish types for now - backend sẽ implement sau
      setDishTypes([
        { id: 1, name: "Khai vị", description: "Món khai vị" },
        { id: 2, name: "Món chính", description: "Món chính" },
        { id: 3, name: "Tráng miệng", description: "Món tráng miệng" },
        { id: 4, name: "Đồ uống", description: "Nước uống" },
      ]);
    } catch (error: any) {
      console.error("Error fetching dish types:", error);
      toast.error("Lỗi khi tải danh mục món ăn");
    }
  };

  const handleCreateDish = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim() || "https://via.placeholder.com/300x200",
        typeId: parseInt(formData.typeId),
        availability: true
      };

      await dishesAPI.create(payload);
      toast.success("Thêm món ăn thành công!");
      setShowModal(false);
      resetForm();
      fetchDishes(pagination.page);
    } catch (error: any) {
      console.error("Error creating dish:", error);
      toast.error(error.response?.data?.message || "Lỗi khi thêm món ăn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDish = async () => {
    if (!editingDish) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim(),
        typeId: parseInt(formData.typeId),
        availability: true
      };

      await dishesAPI.update(editingDish.id, payload);
      toast.success("Cập nhật món ăn thành công!");
      setShowModal(false);
      resetForm();
      fetchDishes(pagination.page);
    } catch (error: any) {
      console.error("Error updating dish:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật món ăn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDish = async (dish: Dish) => {
    showConfirm({
      title: "Xóa món ăn",
      message: `Bạn có chắc chắn muốn xóa "${dish.name}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await dishesAPI.delete(dish.id);
          toast.success("Xóa món ăn thành công!");
          fetchDishes(pagination.page);
        } catch (error: any) {
          console.error("Error deleting dish:", error);
          toast.error(error.response?.data?.message || "Lỗi khi xóa món ăn");
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
      price: "",
      image: "",
      typeId: "",
    });
    setEditingDish(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (dish: Dish) => {
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      image: dish.image,
      typeId: dish.typeId.toString(),
    });
    setEditingDish(dish);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.price || !formData.typeId) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Giá món ăn phải là số dương");
      return;
    }

    if (price >= 100000000) {
      toast.error("Giá món ăn không được vượt quá 99,999,999.99 VND");
      return;
    }

    if (editingDish) {
      handleUpdateDish();
    } else {
      handleCreateDish();
    }
  };

  // ============================================
  // Table Configuration
  // ============================================

  const columns: Column<Dish>[] = [
    {
      key: "image",
      header: "Hình ảnh",
      width: "100px",
      render: (image: string, dish: Dish) => (
        <img
          src={image || "https://via.placeholder.com/60x40"}
          alt={dish.name}
          className="w-15 h-10 object-cover rounded"
        />
      ),
    },
    {
      key: "name",
      header: "Tên món",
      sortable: true,
      searchable: true,
    },
    {
      key: "type",
      header: "Danh mục",
      render: (type: DishType) => (
        <Badge variant="secondary">{type?.name || "Chưa phân loại"}</Badge>
      ),
    },
    {
      key: "description",
      header: "Mô tả",
      render: (description: string) => (
        <div className="max-w-xs truncate" title={description}>
          {description}
        </div>
      ),
    },
    {
      key: "price",
      header: "Giá",
      sortable: true,
      render: (price: number) => (
        <div className="flex items-center text-green-600 font-semibold">
          <DollarSign className="w-4 h-4 mr-1" />
          {price?.toLocaleString("vi-VN")}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
  ];

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    fetchDishes();
    fetchDishTypes();
  }, []);

  // ============================================
  // Render
  // ============================================

  const modalTitle = editingDish ? "Chỉnh sửa món ăn" : "Thêm món ăn mới";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý món ăn</h1>
          <p className="text-gray-600 mt-1">Quản lý thực đơn nhà hàng</p>
        </div>
      </div>

      <DataTable
        data={dishes}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchDishes(page)}
        onSearch={(search) => fetchDishes(1, search)}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteDish}
        searchPlaceholder="Tìm kiếm món ăn..."
        emptyMessage="Chưa có món ăn nào"
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
              <Label htmlFor="name">Tên món ăn *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Bò bít tết"
              />
            </div>

            <div>
              <Label htmlFor="typeId">Danh mục *</Label>
              <Select
                value={formData.typeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, typeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {dishTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Giá (VNĐ) * (Tối đa: 99,999,999 VND)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="VD: 250000"
                min="0"
                max="99999999"
                step="1000"
              />
            </div>

            <div>
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Mô tả món ăn</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về món ăn..."
                rows={4}
              />
            </div>

            {/* Preview */}
            {formData.image && (
              <div>
                <Label>Xem trước hình ảnh</Label>
                <div className="mt-2 border rounded-lg p-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x200";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
