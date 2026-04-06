/**
 * PaymentManagementPage - Quản lý Thanh toán với Transaction & Invoice Management
 */

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  CreditCard,
  FileText,
  DollarSign,
  Calendar,
  Eye,
  Download,
  RefreshCcw,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { DataTable, Column } from "../../app/components/DataTable";
import { FormModal } from "../../app/components/Modal";
import { useConfirmDialog } from "../../app/components/ConfirmDialog";
import { TransactionStatusBadge } from "../../app/components/StatusBadge";
import { transactionsAPI } from "../../services/api";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../app/components/ui/tabs";

interface Transaction {
  id: number;
  transactionId: string;
  invoiceId: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  transactionStatus: string;
  processedBy: string;
  employeeName?: string;
  transactionDate: string;
  transactionTime: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
  invoice?: Invoice;
  order?: {
    id: number;
    orderId: string;
    customerName?: string;
  };
}

interface Invoice {
  id: number;
  invoiceId: string;
  orderId: number;
  customerName: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: string;
  invoiceDate: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    orderId: string;
    orderItems?: Array<{
      dishName: string;
      quantity: number;
      unitPrice: number;
    }>;
  };
}

const PAYMENT_METHODS = [
  { value: "cash", label: "Tiền mặt" },
  { value: "credit_card", label: "Thẻ tín dụng" },
  { value: "debit_card", label: "Thẻ ghi nợ" },
  { value: "online", label: "Thanh toán trực tuyến" },
];

const TRANSACTION_STATUSES = [
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "PENDING", label: "Đang xử lý" },
  { value: "FAILED", label: "Thất bại" },
  { value: "REFUNDED", label: "Hoàn tiền" },
];

const INVOICE_STATUSES = [
  { value: "PAID", label: "Đã thanh toán" },
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "OVERDUE", label: "Quá hạn" },
];

export function PaymentManagementPage() {
  // States
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [viewingItem, setViewingItem] = useState<Transaction | Invoice | null>(
    null,
  );
  const [refundAmount, setRefundAmount] = useState<string>("");

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    completedTransactions: 0,
    refundedAmount: 0,
    todayRevenue: 0,
    avgTransactionValue: 0,
  });

  // Confirm dialog
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // ============================================
  // API Functions
  // ============================================

  const fetchTransactions = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll(
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
      if (methodFilter !== "all") {
        filteredData = data.filter(
          (transaction: Transaction) =>
            transaction.paymentMethod === methodFilter,
        );
      }
      if (dateFilter) {
        filteredData = filteredData.filter(
          (transaction: Transaction) =>
            transaction.transactionDate === dateFilter,
        );
      }
      if (search) {
        filteredData = filteredData.filter(
          (transaction: Transaction) =>
            transaction.transactionId
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            transaction.order?.customerName
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            transaction.order?.orderId
              .toLowerCase()
              .includes(search.toLowerCase()),
        );
      }

      setTransactions(filteredData);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / meta.limit),
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      toast.error("Lỗi khi tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAllInvoices(
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
          (invoice: Invoice) => invoice.invoiceDate === dateFilter,
        );
      }
      if (search) {
        filteredData = filteredData.filter(
          (invoice: Invoice) =>
            invoice.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
            invoice.customerName.toLowerCase().includes(search.toLowerCase()) ||
            invoice.order?.orderId.toLowerCase().includes(search.toLowerCase()),
        );
      }

      setInvoices(filteredData);
      setPagination({
        page: meta.page,
        limit: meta.limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / meta.limit),
        hasMore: meta.hasMore,
      });
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
      toast.error("Lỗi khi tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const [transactionResponse, invoiceResponse] = await Promise.all([
        transactionsAPI.getAll(1, 1000),
        transactionsAPI.getAllInvoices(1, 1000),
      ]);

      const allTransactions = transactionResponse.data?.data || [];
      const allInvoices = invoiceResponse.data?.data || [];
      const today = new Date().toISOString().split("T")[0];

      const completedTransactions = allTransactions.filter(
        (t: Transaction) => t.transactionStatus === "COMPLETED",
      );

      const totalRevenue = completedTransactions.reduce(
        (sum: number, t: Transaction) => sum + t.amount,
        0,
      );

      const todayRevenue = completedTransactions
        .filter((t: Transaction) => t.transactionDate === today)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      setStats({
        totalRevenue,
        pendingPayments: allTransactions
          .filter((t: Transaction) => t.transactionStatus === "PENDING")
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        completedTransactions: completedTransactions.length,
        refundedAmount: allTransactions
          .filter((t: Transaction) => t.transactionStatus === "REFUNDED")
          .reduce(
            (sum: number, t: Transaction) => sum + (t.refundAmount || 0),
            0,
          ),
        todayRevenue,
        avgTransactionValue:
          completedTransactions.length > 0
            ? totalRevenue / completedTransactions.length
            : 0,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRefund = async (transaction: Transaction) => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error("Vui lòng nhập số tiền hoàn trả hợp lệ");
      return;
    }

    const amount = parseFloat(refundAmount);
    if (amount > transaction.amount) {
      toast.error("Số tiền hoàn trả không thể lớn hơn số tiền giao dịch");
      return;
    }

    showConfirm({
      title: "Xác nhận hoàn tiền",
      message: `Bạn có chắc chắn muốn hoàn tiền ${amount.toLocaleString("vi-VN")}đ cho giao dịch "${transaction.transactionId}"?`,
      onConfirm: async () => {
        try {
          await transactionsAPI.refund(transaction.id, amount);
          toast.success("Hoàn tiền thành công!");
          setShowRefundModal(false);
          setRefundAmount("");
          fetchTransactions(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error processing refund:", error);
          toast.error(error.response?.data?.message || "Lỗi khi hoàn tiền");
        }
      },
    });
  };

  const handleViewDetail = (item: Transaction | Invoice) => {
    setViewingItem(item);
    setShowDetailModal(true);
  };

  const handleShowRefundModal = (transaction: Transaction) => {
    if (transaction.transactionStatus !== "COMPLETED") {
      toast.error("Chỉ có thể hoàn tiền cho giao dịch đã hoàn thành");
      return;
    }
    setViewingItem(transaction);
    setRefundAmount(transaction.amount.toString());
    setShowRefundModal(true);
  };

  const handleUpdateInvoiceStatus = async (
    invoice: Invoice,
    status: string,
  ) => {
    showConfirm({
      title: "Cập nhật trạng thái hóa đơn",
      message: `Bạn có chắc chắn muốn thay đổi trạng thái hóa đơn "${invoice.invoiceId}" sang "${INVOICE_STATUSES.find((s) => s.value === status)?.label}"?`,
      onConfirm: async () => {
        try {
          await transactionsAPI.updateInvoiceStatus(invoice.id, status);
          toast.success("Cập nhật trạng thái thành công!");
          fetchInvoices(pagination.page);
          fetchStats();
        } catch (error: any) {
          console.error("Error updating invoice status:", error);
          toast.error(
            error.response?.data?.message || "Lỗi khi cập nhật trạng thái",
          );
        }
      },
    });
  };

  // ============================================
  // Table Configuration - Transactions
  // ============================================

  const transactionColumns: Column<Transaction>[] = [
    {
      key: "transactionId",
      header: "Mã GD",
      sortable: true,
      searchable: true,
      render: (transactionId: string, transaction: Transaction) => (
        <div>
          <div className="font-semibold text-blue-600">{transactionId}</div>
          <div className="text-sm text-gray-500">
            {transaction.order?.orderId}
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Số tiền",
      sortable: true,
      render: (amount: number, transaction: Transaction) => (
        <div>
          <div className="font-semibold text-green-600">
            {amount.toLocaleString("vi-VN")}đ
          </div>
          {transaction.refundAmount && transaction.refundAmount > 0 && (
            <div className="text-sm text-red-500">
              Hoàn: -{transaction.refundAmount.toLocaleString("vi-VN")}đ
            </div>
          )}
        </div>
      ),
    },
    {
      key: "paymentMethod",
      header: "Phương thức",
      render: (method: string) => (
        <div className="flex items-center">
          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {PAYMENT_METHODS.find((m) => m.value === method)?.label || method}
          </span>
        </div>
      ),
    },
    {
      key: "transactionStatus",
      header: "Trạng thái",
      render: (status: string) => <TransactionStatusBadge status={status} />,
    },
    {
      key: "order",
      header: "Khách hàng",
      render: (order: any) => (
        <div>
          <div className="font-medium">
            {order?.customerName || "Khách hàng"}
          </div>
        </div>
      ),
    },
    {
      key: "employeeName",
      header: "Nhân viên",
      render: (employeeName: string) => (
        <span className="text-sm">{employeeName || "N/A"}</span>
      ),
    },
    {
      key: "transactionDate",
      header: "Ngày GD",
      sortable: true,
      render: (date: string, transaction: Transaction) => (
        <div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(date).toLocaleDateString("vi-VN")}
          </div>
          <div className="text-sm text-gray-500">
            {transaction.transactionTime}
          </div>
        </div>
      ),
    },
  ];

  // Transaction actions
  const transactionActions = (transaction: Transaction) => [
    {
      label: "Xem chi tiết",
      icon: Eye,
      onClick: () => handleViewDetail(transaction),
      className: "text-blue-600 hover:text-blue-800",
    },
    ...(transaction.transactionStatus === "COMPLETED"
      ? [
          {
            label: "Hoàn tiền",
            icon: RefreshCcw,
            onClick: () => handleShowRefundModal(transaction),
            className: "text-orange-600 hover:text-orange-800",
          },
        ]
      : []),
  ];

  // ============================================
  // Table Configuration - Invoices
  // ============================================

  const invoiceColumns: Column<Invoice>[] = [
    {
      key: "invoiceId",
      header: "Mã HĐ",
      sortable: true,
      searchable: true,
      render: (invoiceId: string, invoice: Invoice) => (
        <div>
          <div className="font-semibold text-purple-600">{invoiceId}</div>
          <div className="text-sm text-gray-500">{invoice.order?.orderId}</div>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Khách hàng",
      sortable: true,
      searchable: true,
      render: (customerName: string) => (
        <div className="font-medium">{customerName}</div>
      ),
    },
    {
      key: "total",
      header: "Tổng tiền",
      sortable: true,
      render: (total: number, invoice: Invoice) => (
        <div>
          <div className="font-semibold text-green-600">
            {total.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-xs text-gray-500">
            Thuế: {invoice.tax.toLocaleString("vi-VN")}đ
          </div>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Trạng thái",
      render: (status: string, invoice: Invoice) => (
        <div className="flex items-center space-x-2">
          <TransactionStatusBadge status={status} />
          <Select
            value={status}
            onValueChange={(newStatus) =>
              handleUpdateInvoiceStatus(invoice, newStatus)
            }
          >
            <SelectTrigger className="w-auto h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INVOICE_STATUSES.map((s) => (
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
      key: "invoiceDate",
      header: "Ngày tạo",
      sortable: true,
      render: (date: string, invoice: Invoice) => (
        <div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(date).toLocaleDateString("vi-VN")}
          </div>
          {invoice.dueDate && (
            <div className="text-sm text-gray-500">
              Hạn: {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>
      ),
    },
  ];

  // Invoice actions
  const invoiceActions = (invoice: Invoice) => [
    {
      label: "Xem chi tiết",
      icon: Eye,
      onClick: () => handleViewDetail(invoice),
      className: "text-blue-600 hover:text-blue-800",
    },
    {
      label: "Tải xuống",
      icon: Download,
      onClick: () => toast.info("Tính năng tải xuống đang phát triển"),
      className: "text-gray-600 hover:text-gray-800",
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
          {(activeTab === "transactions"
            ? TRANSACTION_STATUSES
            : INVOICE_STATUSES
          ).map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeTab === "transactions" && (
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Phương thức" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phương thức</SelectItem>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

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
    if (activeTab === "transactions") {
      fetchTransactions();
    } else {
      fetchInvoices();
    }
    fetchStats();
  }, [activeTab, statusFilter, methodFilter, dateFilter]);

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý thanh toán</h1>
          <p className="text-gray-600 mt-1">Theo dõi giao dịch và hóa đơn</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading
                ? "..."
                : `${stats.totalRevenue.toLocaleString("vi-VN")}đ`}
            </div>
            <p className="text-xs text-muted-foreground">
              TB:{" "}
              {statsLoading
                ? "..."
                : `${stats.avgTransactionValue.toLocaleString("vi-VN")}đ/GD`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chờ thanh toán
            </CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsLoading
                ? "..."
                : `${stats.pendingPayments.toLocaleString("vi-VN")}đ`}
            </div>
            <p className="text-xs text-muted-foreground">
              Hoàn tiền:{" "}
              {statsLoading
                ? "..."
                : `${stats.refundedAmount.toLocaleString("vi-VN")}đ`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statsLoading
                ? "..."
                : `${stats.todayRevenue.toLocaleString("vi-VN")}đ`}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "..." : stats.completedTransactions} giao dịch
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="transactions"
            className="flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Giao dịch</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center space-x-2">
            <Receipt className="w-4 h-4" />
            <span>Hóa đơn</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <DataTable
            data={transactions}
            columns={transactionColumns}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchTransactions(page)}
            onSearch={(search) => fetchTransactions(1, search)}
            customActions={transactionActions}
            filters={renderFilters()}
            searchPlaceholder="Tìm kiếm giao dịch..."
            emptyMessage="Chưa có giao dịch nào"
          />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <DataTable
            data={invoices}
            columns={invoiceColumns}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchInvoices(page)}
            onSearch={(search) => fetchInvoices(1, search)}
            customActions={invoiceActions}
            filters={renderFilters()}
            searchPlaceholder="Tìm kiếm hóa đơn..."
            emptyMessage="Chưa có hóa đơn nào"
          />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <FormModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Chi tiết ${activeTab === "transactions" ? "giao dịch" : "hóa đơn"}`}
        onSubmit={() => setShowDetailModal(false)}
        submitText="Đóng"
        size="lg"
      >
        {viewingItem && (
          <div className="space-y-4">
            {"transactionId" in viewingItem ? (
              // Transaction details
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mã giao dịch</Label>
                    <div className="font-semibold text-blue-600">
                      {viewingItem.transactionId}
                    </div>
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1">
                      <TransactionStatusBadge
                        status={viewingItem.transactionStatus}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Số tiền</Label>
                    <div className="font-semibold text-green-600">
                      {viewingItem.amount.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                  <div>
                    <Label>Phương thức</Label>
                    <div>
                      {
                        PAYMENT_METHODS.find(
                          (m) => m.value === viewingItem.paymentMethod,
                        )?.label
                      }
                    </div>
                  </div>
                  <div>
                    <Label>Khách hàng</Label>
                    <div>{viewingItem.order?.customerName || "Khách hàng"}</div>
                  </div>
                  <div>
                    <Label>Nhân viên xử lý</Label>
                    <div>{viewingItem.employeeName || "N/A"}</div>
                  </div>
                </div>
                {viewingItem.refundAmount && viewingItem.refundAmount > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <Label>Số tiền đã hoàn</Label>
                    <div className="font-semibold text-red-600">
                      {viewingItem.refundAmount.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Invoice details
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mã hóa đơn</Label>
                    <div className="font-semibold text-purple-600">
                      {viewingItem.invoiceId}
                    </div>
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1">
                      <TransactionStatusBadge
                        status={viewingItem.paymentStatus}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Khách hàng</Label>
                    <div className="font-semibold">
                      {viewingItem.customerName}
                    </div>
                  </div>
                  <div>
                    <Label>Ngày tạo</Label>
                    <div>
                      {new Date(viewingItem.invoiceDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                {viewingItem.order?.orderItems && (
                  <div>
                    <Label>Danh sách món</Label>
                    <div className="mt-2 border rounded-lg">
                      <div className="max-h-40 overflow-y-auto">
                        {viewingItem.order.orderItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 border-b last:border-b-0"
                          >
                            <div>{item.dishName}</div>
                            <div className="text-right">
                              {item.quantity}x{" "}
                              {item.unitPrice.toLocaleString("vi-VN")}đ
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Invoice Total */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        {viewingItem.subtotal.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế:</span>
                      <span>{viewingItem.tax.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-green-600">
                        {viewingItem.total.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Refund Modal */}
      <FormModal
        isOpen={showRefundModal}
        onClose={() => {
          setShowRefundModal(false);
          setRefundAmount("");
        }}
        title="Hoàn tiền"
        onSubmit={() =>
          viewingItem &&
          "transactionId" in viewingItem &&
          handleRefund(viewingItem)
        }
        submitText="Xác nhận hoàn tiền"
        size="md"
      >
        {viewingItem && "transactionId" in viewingItem && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-900">
                Giao dịch: {viewingItem.transactionId}
              </div>
              <div className="text-blue-700">
                Số tiền gốc: {viewingItem.amount.toLocaleString("vi-VN")}đ
              </div>
            </div>

            <div>
              <Label htmlFor="refundAmount">Số tiền hoàn trả *</Label>
              <Input
                id="refundAmount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Nhập số tiền hoàn trả"
                max={viewingItem.amount}
                min="0"
                step="1000"
              />
            </div>

            <div className="text-sm text-gray-600">
              * Số tiền hoàn trả không được vượt quá số tiền giao dịch gốc
            </div>
          </div>
        )}
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
