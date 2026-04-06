/**
 * StatusBadge Component - Consistent status display
 */

import React from "react";
import { Badge } from "./ui/badge";

export interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  statusConfig?: Record<
    string,
    { variant: string; label?: string; color?: string }
  >;
}

// Default status mappings cho các entities
export const ORDER_STATUS_CONFIG = {
  PENDING: {
    variant: "secondary",
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
  },
  PROCESSING: {
    variant: "default",
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-800",
  },
  COMPLETED: {
    variant: "default",
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    variant: "destructive",
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
  },
};

export const RESERVATION_STATUS_CONFIG = {
  PENDING: {
    variant: "secondary",
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-800",
  },
  CONFIRMED: {
    variant: "default",
    label: "Đã xác nhận",
    color: "bg-green-100 text-green-800",
  },
  SEATED: {
    variant: "default",
    label: "Đã vào bàn",
    color: "bg-blue-100 text-blue-800",
  },
  COMPLETED: {
    variant: "default",
    label: "Hoàn thành",
    color: "bg-gray-100 text-gray-800",
  },
  CANCELLED: {
    variant: "destructive",
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
  },
  NO_SHOW: {
    variant: "destructive",
    label: "Không đến",
    color: "bg-orange-100 text-orange-800",
  },
};

export const TABLE_STATUS_CONFIG = {
  EMPTY: {
    variant: "secondary",
    label: "Trống",
    color: "bg-gray-100 text-gray-800",
  },
  OCCUPIED: {
    variant: "default",
    label: "Có khách",
    color: "bg-red-100 text-red-800",
  },
  RESERVED: {
    variant: "default",
    label: "Đã đặt",
    color: "bg-yellow-100 text-yellow-800",
  },
  CLEANING: {
    variant: "secondary",
    label: "Dọn dẹp",
    color: "bg-blue-100 text-blue-800",
  },
};

export const EMPLOYEE_STATUS_CONFIG = {
  ACTIVE: {
    variant: "default",
    label: "Hoạt động",
    color: "bg-green-100 text-green-800",
  },
  INACTIVE: {
    variant: "destructive",
    label: "Tạm ngưng",
    color: "bg-red-100 text-red-800",
  },
};

export const INVENTORY_STATUS_CONFIG = {
  GOOD: {
    variant: "default",
    label: "Đủ",
    color: "bg-green-100 text-green-800",
  },
  LOW: {
    variant: "secondary",
    label: "Sắp hết",
    color: "bg-yellow-100 text-yellow-800",
  },
  CRITICAL: {
    variant: "destructive",
    label: "Hết hàng",
    color: "bg-red-100 text-red-800",
  },
};

export const TRANSACTION_STATUS_CONFIG = {
  PENDING: {
    variant: "secondary",
    label: "Chờ thanh toán",
    color: "bg-yellow-100 text-yellow-800",
  },
  COMPLETED: {
    variant: "default",
    label: "Đã thanh toán",
    color: "bg-green-100 text-green-800",
  },
  FAILED: {
    variant: "destructive",
    label: "Thất bại",
    color: "bg-red-100 text-red-800",
  },
  REFUNDED: {
    variant: "secondary",
    label: "Hoàn tiền",
    color: "bg-blue-100 text-blue-800",
  },
};

export function StatusBadge({
  status,
  variant,
  statusConfig,
}: StatusBadgeProps) {
  if (!status) return null;

  const config = statusConfig?.[status.toUpperCase()];
  const label = config?.label || status;
  const badgeVariant = variant || (config?.variant as any) || "secondary";

  if (config?.color) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {label}
      </span>
    );
  }

  return <Badge variant={badgeVariant as any}>{label}</Badge>;
}

// Helper components cho specific entities
export const OrderStatusBadge = ({ status }: { status: string }) => (
  <StatusBadge status={status} statusConfig={ORDER_STATUS_CONFIG} />
);

export const ReservationStatusBadge = ({ status }: { status: string }) => (
  <StatusBadge status={status} statusConfig={RESERVATION_STATUS_CONFIG} />
);

export const TableStatusBadge = ({ status }: { status: string }) => (
  <StatusBadge status={status} statusConfig={TABLE_STATUS_CONFIG} />
);

export const EmployeeStatusBadge = ({ status }: { status: string }) => (
  <StatusBadge status={status} statusConfig={EMPLOYEE_STATUS_CONFIG} />
);

export const InventoryStatusBadge = ({ status }: { status: string }) => (
  <StatusBadge status={status} statusConfig={INVENTORY_STATUS_CONFIG} />
);

export const TransactionStatusBadge = ({ status }: { status: string }) => (
  <StatusBadge status={status} statusConfig={TRANSACTION_STATUS_CONFIG} />
);
