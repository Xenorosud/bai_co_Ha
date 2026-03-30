import { DollarSign, ShoppingBag, Grid3x3, TrendingUp, Users } from "lucide-react";

export function DashboardPage() {
  const stats = [
    {
      title: "Today's Income",
      value: "$3,450",
      change: "+12.5%",
      icon: <DollarSign className="w-8 h-8" />,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "45",
      change: "+8.2%",
      icon: <ShoppingBag className="w-8 h-8" />,
      color: "bg-blue-500",
    },
    {
      title: "Tables in Use",
      value: "12/20",
      change: "60%",
      icon: <Grid3x3 className="w-8 h-8" />,
      color: "bg-amber-500",
    },
    {
      title: "Active Staff",
      value: "8",
      change: "Online",
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-500",
    },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Doe", items: "Ribeye Steak, Wine", total: "$58", status: "Processing" },
    { id: "#ORD-002", customer: "Sarah Smith", items: "Pasta Carbonara", total: "$28", status: "Completed" },
    { id: "#ORD-003", customer: "Mike Johnson", items: "Gourmet Platter, Cocktail", total: "$48", status: "Processing" },
    { id: "#ORD-004", customer: "Emily Brown", items: "Caesar Salad, Lemonade", total: "$22", status: "Paid" },
    { id: "#ORD-005", customer: "David Lee", items: "Chocolate Cake", total: "$14", status: "Completed" },
  ];

  const incomeData = [
    { day: "Mon", income: 2800 },
    { day: "Tue", income: 3200 },
    { day: "Wed", income: 2900 },
    { day: "Thu", income: 3500 },
    { day: "Fri", income: 4200 },
    { day: "Sat", income: 5100 },
    { day: "Sun", income: 4800 },
  ];

  const maxIncome = Math.max(...incomeData.map(d => d.income));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Income Chart and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Income Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Weekly Income</h2>
          <div className="flex items-end justify-between h-64 gap-4">
            {incomeData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-amber-500 rounded-t-lg relative" style={{ height: `${(data.income / maxIncome) * 100}%` }}>
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
                    ${data.income}
                  </span>
                </div>
                <span className="text-sm text-gray-600 font-medium">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold">{order.id}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.items}</p>
                </div>
                <p className="font-bold text-amber-600">{order.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Status Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Table Status Overview</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {Array.from({ length: 20 }, (_, i) => {
            const status = i < 12 ? "used" : i < 15 ? "reserved" : "empty";
            const statusColors = {
              used: "bg-red-500",
              reserved: "bg-yellow-500",
              empty: "bg-green-500",
            };
            return (
              <div key={i} className="text-center">
                <div className={`w-full aspect-square ${statusColors[status]} rounded-lg flex items-center justify-center text-white font-bold mb-2`}>
                  {i + 1}
                </div>
                <p className="text-xs text-gray-600 capitalize">{status}</p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Empty (8)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">In Use (12)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Reserved (3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
