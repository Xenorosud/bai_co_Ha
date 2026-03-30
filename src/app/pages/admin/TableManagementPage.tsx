import { useState } from "react";
import { toast } from "sonner";

interface Table {
  id: number;
  number: number;
  seats: number;
  status: "Empty" | "Being Used" | "Reserved";
}

export function TableManagementPage() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, number: 1, seats: 2, status: "Being Used" },
    { id: 2, number: 2, seats: 4, status: "Being Used" },
    { id: 3, number: 3, seats: 2, status: "Empty" },
    { id: 4, number: 4, seats: 4, status: "Reserved" },
    { id: 5, number: 5, seats: 6, status: "Being Used" },
    { id: 6, number: 6, seats: 2, status: "Empty" },
    { id: 7, number: 7, seats: 4, status: "Being Used" },
    { id: 8, number: 8, seats: 4, status: "Empty" },
    { id: 9, number: 9, seats: 8, status: "Reserved" },
    { id: 10, number: 10, seats: 2, status: "Being Used" },
    { id: 11, number: 11, seats: 4, status: "Empty" },
    { id: 12, number: 12, seats: 6, status: "Being Used" },
    { id: 13, number: 13, seats: 2, status: "Empty" },
    { id: 14, number: 14, seats: 4, status: "Empty" },
    { id: 15, number: 15, seats: 4, status: "Reserved" },
    { id: 16, number: 16, seats: 2, status: "Being Used" },
    { id: 17, number: 17, seats: 6, status: "Empty" },
    { id: 18, number: 18, seats: 4, status: "Being Used" },
    { id: 19, number: 19, seats: 2, status: "Empty" },
    { id: 20, number: 20, seats: 8, status: "Being Used" },
  ]);

  const handleStatusChange = (id: number, newStatus: Table["status"]) => {
    setTables(tables.map(table => 
      table.id === id ? { ...table, status: newStatus } : table
    ));
    toast.success(`Table ${tables.find(t => t.id === id)?.number} status updated to ${newStatus}`);
  };

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "Empty":
        return "bg-green-500 border-green-600";
      case "Being Used":
        return "bg-red-500 border-red-600";
      case "Reserved":
        return "bg-yellow-500 border-yellow-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  const getStatusTextColor = (status: Table["status"]) => {
    switch (status) {
      case "Empty":
        return "text-green-700";
      case "Being Used":
        return "text-red-700";
      case "Reserved":
        return "text-yellow-700";
      default:
        return "text-gray-700";
    }
  };

  const statusCounts = {
    Empty: tables.filter(t => t.status === "Empty").length,
    "Being Used": tables.filter(t => t.status === "Being Used").length,
    Reserved: tables.filter(t => t.status === "Reserved").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Table Management</h1>
        <p className="text-gray-600">View and manage table statuses</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Empty Tables</p>
              <p className="text-3xl font-bold text-green-600">{statusCounts.Empty}</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-green-500 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Being Used</p>
              <p className="text-3xl font-bold text-red-600">{statusCounts["Being Used"]}</p>
            </div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-red-500 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Reserved</p>
              <p className="text-3xl font-bold text-yellow-600">{statusCounts.Reserved}</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-yellow-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Layout */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Table Layout</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tables.map((table) => (
            <div
              key={table.id}
              className="flex flex-col items-center"
            >
              <div
                className={`w-full aspect-square ${getStatusColor(table.status)} border-4 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
              >
                <span className="text-3xl font-bold">#{table.number}</span>
                <span className="text-sm mt-1">{table.seats} seats</span>
              </div>
              <div className="mt-3 w-full">
                <select
                  value={table.status}
                  onChange={(e) => handleStatusChange(table.id, e.target.value as Table["status"])}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${getStatusTextColor(table.status)} bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500`}
                >
                  <option value="Empty">Empty</option>
                  <option value="Being Used">Being Used</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold mb-3">Status Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
              <span className="text-sm text-gray-700">Empty - Available for walk-ins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 border-2 border-red-600 rounded"></div>
              <span className="text-sm text-gray-700">Being Used - Currently occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
              <span className="text-sm text-gray-700">Reserved - Booked in advance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Quick Tips</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Click on any table to view details or change status</li>
          <li>• Use the dropdown to quickly update table status</li>
          <li>• Reserved tables are linked to confirmed reservations</li>
          <li>• Empty tables can be assigned to walk-in customers</li>
        </ul>
      </div>
    </div>
  );
}
