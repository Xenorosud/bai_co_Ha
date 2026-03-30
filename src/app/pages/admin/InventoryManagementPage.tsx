import { useState } from "react";
import { Package, AlertTriangle, TrendingDown, Search } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  lastRestocked: string;
  supplier: string;
}

export function InventoryManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const inventoryItems: InventoryItem[] = [
    { id: 1, name: "Ribeye Steak", category: "Meat", quantity: 45, unit: "lbs", minStock: 20, lastRestocked: "2026-03-28", supplier: "Prime Meats Co." },
    { id: 2, name: "Fresh Pasta", category: "Pasta", quantity: 12, unit: "lbs", minStock: 15, lastRestocked: "2026-03-25", supplier: "Italian Foods Inc." },
    { id: 3, name: "Parmesan Cheese", category: "Dairy", quantity: 8, unit: "lbs", minStock: 5, lastRestocked: "2026-03-29", supplier: "Cheese Masters" },
    { id: 4, name: "Olive Oil", category: "Oils", quantity: 25, unit: "liters", minStock: 10, lastRestocked: "2026-03-27", supplier: "Mediterranean Imports" },
    { id: 5, name: "Tomatoes", category: "Vegetables", quantity: 30, unit: "lbs", minStock: 20, lastRestocked: "2026-03-30", supplier: "Fresh Farm Produce" },
    { id: 6, name: "Lettuce", category: "Vegetables", quantity: 18, unit: "heads", minStock: 25, lastRestocked: "2026-03-29", supplier: "Fresh Farm Produce" },
    { id: 7, name: "Chicken Breast", category: "Meat", quantity: 55, unit: "lbs", minStock: 30, lastRestocked: "2026-03-28", supplier: "Poultry Suppliers" },
    { id: 8, name: "Heavy Cream", category: "Dairy", quantity: 15, unit: "quarts", minStock: 10, lastRestocked: "2026-03-29", supplier: "Dairy Delights" },
    { id: 9, name: "Garlic", category: "Vegetables", quantity: 8, unit: "lbs", minStock: 5, lastRestocked: "2026-03-26", supplier: "Fresh Farm Produce" },
    { id: 10, name: "Red Wine", category: "Beverages", quantity: 24, unit: "bottles", minStock: 12, lastRestocked: "2026-03-27", supplier: "Wine Distributors" },
    { id: 11, name: "Flour", category: "Baking", quantity: 50, unit: "lbs", minStock: 40, lastRestocked: "2026-03-25", supplier: "Baking Supplies Co." },
    { id: 12, name: "Sugar", category: "Baking", quantity: 35, unit: "lbs", minStock: 20, lastRestocked: "2026-03-26", supplier: "Baking Supplies Co." },
    { id: 13, name: "Butter", category: "Dairy", quantity: 20, unit: "lbs", minStock: 15, lastRestocked: "2026-03-29", supplier: "Dairy Delights" },
    { id: 14, name: "Salmon Fillet", category: "Seafood", quantity: 12, unit: "lbs", minStock: 15, lastRestocked: "2026-03-30", supplier: "Ocean Fresh Seafood" },
    { id: 15, name: "Shrimp", category: "Seafood", quantity: 8, unit: "lbs", minStock: 10, lastRestocked: "2026-03-29", supplier: "Ocean Fresh Seafood" },
  ];

  const categories = ["All", ...Array.from(new Set(inventoryItems.map(item => item.category)))];

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock * 0.5) {
      return { status: "Critical", color: "text-red-600 bg-red-50 border-red-200" };
    } else if (item.quantity <= item.minStock) {
      return { status: "Low", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
    }
    return { status: "Good", color: "text-green-600 bg-green-50 border-green-200" };
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minStock);
  const criticalStockItems = inventoryItems.filter(item => item.quantity <= item.minStock * 0.5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-gray-600">View ingredients and stock quantities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Total Items</h3>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{inventoryItems.length}</p>
          <p className="text-sm text-gray-500 mt-1">In inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Low Stock Items</h3>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{lowStockItems.length}</p>
          <p className="text-sm text-gray-500 mt-1">Need restocking soon</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Critical Stock</h3>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{criticalStockItems.length}</p>
          <p className="text-sm text-gray-500 mt-1">Restock immediately</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items, categories, or suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === category
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {criticalStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Critical Stock Alert!</h3>
              <p className="text-sm text-red-800 mb-2">
                The following items are critically low and need immediate restocking:
              </p>
              <div className="flex flex-wrap gap-2">
                {criticalStockItems.map((item) => (
                  <span key={item.id} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Min Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Restocked</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.lastRestocked}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.supplier}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold mb-2 text-blue-900">Inventory Status Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-700"><strong>Good:</strong> Stock above minimum threshold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-700"><strong>Low:</strong> Stock at or below minimum threshold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-700"><strong>Critical:</strong> Stock at 50% or below minimum</span>
          </div>
        </div>
      </div>
    </div>
  );
}
