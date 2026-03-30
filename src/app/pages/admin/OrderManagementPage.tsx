import { useState } from "react";
import { Search, Eye } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: "Processing" | "Completed" | "Paid" | "Cancelled";
  date: string;
  time: string;
}

export function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-001", customer: "John Doe", items: "Ribeye Steak, Wine", total: 58, status: "Processing", date: "2026-03-30", time: "12:30 PM" },
    { id: "ORD-002", customer: "Sarah Smith", items: "Pasta Carbonara", total: 28, status: "Completed", date: "2026-03-30", time: "11:45 AM" },
    { id: "ORD-003", customer: "Mike Johnson", items: "Gourmet Platter, Cocktail", total: 48, status: "Processing", date: "2026-03-30", time: "01:15 PM" },
    { id: "ORD-004", customer: "Emily Brown", items: "Caesar Salad, Lemonade", total: 22, status: "Paid", date: "2026-03-30", time: "10:30 AM" },
    { id: "ORD-005", customer: "David Lee", items: "Chocolate Cake, Coffee", total: 18, status: "Completed", date: "2026-03-30", time: "02:00 PM" },
    { id: "ORD-006", customer: "Anna White", items: "Steak, Pasta", total: 70, status: "Cancelled", date: "2026-03-30", time: "12:00 PM" },
    { id: "ORD-007", customer: "Tom Wilson", items: "Burger, Fries", total: 25, status: "Processing", date: "2026-03-30", time: "01:45 PM" },
    { id: "ORD-008", customer: "Lisa Garcia", items: "Sushi Platter", total: 45, status: "Paid", date: "2026-03-30", time: "11:00 AM" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Paid":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: orders.length,
    Processing: orders.filter(o => o.status === "Processing").length,
    Completed: orders.filter(o => o.status === "Completed").length,
    Paid: orders.filter(o => o.status === "Paid").length,
    Cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">View and manage all orders</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders by ID, customer, or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{order.items}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{order.date}</div>
                    <div className="text-xs text-gray-500">{order.time}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-amber-600">${order.total}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} cursor-pointer`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Paid">Paid</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-2xl font-bold text-yellow-700">{statusCounts.Processing}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-700">{statusCounts.Completed}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Paid</p>
            <p className="text-2xl font-bold text-blue-700">{statusCounts.Paid}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-700">{statusCounts.Cancelled}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
