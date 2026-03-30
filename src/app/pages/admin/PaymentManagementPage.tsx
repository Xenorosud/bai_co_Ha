import { useState } from "react";
import { FileText, CreditCard, Search, Download, Eye } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  time: string;
  customer: string;
  orderId: string;
  amount: number;
  method: "Cash" | "Credit Card" | "Debit Card" | "Online";
  status: "Completed" | "Pending" | "Refunded";
}

interface Invoice {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  items: string[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Paid" | "Unpaid" | "Overdue";
}

export function PaymentManagementPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "transactions">("invoices");
  const [searchQuery, setSearchQuery] = useState("");

  const transactions: Transaction[] = [
    { id: "TXN-001", date: "2026-03-30", time: "12:30 PM", customer: "John Doe", orderId: "ORD-001", amount: 58, method: "Credit Card", status: "Completed" },
    { id: "TXN-002", date: "2026-03-30", time: "11:45 AM", customer: "Sarah Smith", orderId: "ORD-002", amount: 28, method: "Cash", status: "Completed" },
    { id: "TXN-003", date: "2026-03-30", time: "01:15 PM", customer: "Mike Johnson", orderId: "ORD-003", amount: 48, method: "Debit Card", status: "Completed" },
    { id: "TXN-004", date: "2026-03-30", time: "10:30 AM", customer: "Emily Brown", orderId: "ORD-004", amount: 22, method: "Online", status: "Completed" },
    { id: "TXN-005", date: "2026-03-30", time: "02:00 PM", customer: "David Lee", orderId: "ORD-005", amount: 18, method: "Credit Card", status: "Pending" },
    { id: "TXN-006", date: "2026-03-29", time: "07:30 PM", customer: "Lisa Garcia", orderId: "ORD-006", amount: 95, method: "Credit Card", status: "Completed" },
    { id: "TXN-007", date: "2026-03-29", time: "06:15 PM", customer: "Tom Wilson", orderId: "ORD-007", amount: 42, method: "Cash", status: "Completed" },
  ];

  const invoices: Invoice[] = [
    {
      id: "INV-001",
      orderId: "ORD-001",
      customer: "John Doe",
      date: "2026-03-30",
      items: ["Ribeye Steak ($42)", "Red Wine ($16)"],
      subtotal: 58,
      tax: 4.64,
      total: 62.64,
      status: "Paid",
    },
    {
      id: "INV-002",
      orderId: "ORD-002",
      customer: "Sarah Smith",
      date: "2026-03-30",
      items: ["Pasta Carbonara ($28)"],
      subtotal: 28,
      tax: 2.24,
      total: 30.24,
      status: "Paid",
    },
    {
      id: "INV-003",
      orderId: "ORD-003",
      customer: "Mike Johnson",
      date: "2026-03-30",
      items: ["Gourmet Platter ($32)", "Signature Cocktail ($16)"],
      subtotal: 48,
      tax: 3.84,
      total: 51.84,
      status: "Unpaid",
    },
    {
      id: "INV-004",
      orderId: "ORD-004",
      customer: "Emily Brown",
      date: "2026-03-30",
      items: ["Caesar Salad ($16)", "Lemonade ($6)"],
      subtotal: 22,
      tax: 1.76,
      total: 23.76,
      status: "Paid",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Unpaid":
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Overdue":
      case "Refunded":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
        <p className="text-gray-600">View invoices and transaction history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Total Revenue</h3>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Completed transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Pending Payments</h3>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">${pendingPayments.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Transactions Today</h3>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{transactions.filter(t => t.date === "2026-03-30").length}</p>
          <p className="text-sm text-gray-500 mt-1">Total count</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "invoices"
                  ? "border-b-2 border-amber-600 text-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoices
              </div>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "transactions"
                  ? "border-b-2 border-amber-600 text-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Transaction History
              </div>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Invoices Table */}
        {activeTab === "invoices" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Invoice ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{invoice.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{invoice.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-amber-600">${invoice.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No invoices found</p>
              </div>
            )}
          </div>
        )}

        {/* Transactions Table */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{transaction.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{transaction.date}</div>
                      <div className="text-xs text-gray-500">{transaction.time}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-amber-600">${transaction.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.method}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No transactions found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
