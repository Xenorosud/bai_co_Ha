import { useState } from "react";
import { Plus, Edit, Trash2, X, Shield, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: number;
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
  status: "Active" | "Inactive";
  hireDate: string;
}

export function WorkersManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Admin User",
      email: "admin@restora.com",
      phone: "(555) 100-0001",
      role: "Administrator",
      permissions: {
        dashboard: true,
        foodManagement: true,
        orderManagement: true,
        tableManagement: true,
        reservationManagement: true,
        paymentManagement: true,
        inventoryManagement: true,
        workersManagement: true,
      },
      status: "Active",
      hireDate: "2020-01-15",
    },
    {
      id: 2,
      name: "John Manager",
      email: "john.manager@restora.com",
      phone: "(555) 100-0002",
      role: "Manager",
      permissions: {
        dashboard: true,
        foodManagement: true,
        orderManagement: true,
        tableManagement: true,
        reservationManagement: true,
        paymentManagement: true,
        inventoryManagement: true,
        workersManagement: false,
      },
      status: "Active",
      hireDate: "2021-03-20",
    },
    {
      id: 3,
      name: "Sarah Waiter",
      email: "sarah.waiter@restora.com",
      phone: "(555) 100-0003",
      role: "Server",
      permissions: {
        dashboard: true,
        foodManagement: false,
        orderManagement: true,
        tableManagement: true,
        reservationManagement: true,
        paymentManagement: true,
        inventoryManagement: false,
        workersManagement: false,
      },
      status: "Active",
      hireDate: "2022-06-10",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    permissions: {
      dashboard: false,
      foodManagement: false,
      orderManagement: false,
      tableManagement: false,
      reservationManagement: false,
      paymentManagement: false,
      inventoryManagement: false,
      workersManagement: false,
    },
  });

  const permissionLabels = {
    dashboard: "Dashboard Access",
    foodManagement: "Food Management",
    orderManagement: "Order Management",
    tableManagement: "Table Management",
    reservationManagement: "Reservation Management",
    paymentManagement: "Payment Management",
    inventoryManagement: "Inventory Management",
    workersManagement: "Workers Management (Admin Only)",
  };

  const openAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm({
      name: "",
      email: "",
      phone: "",
      role: "",
      permissions: {
        dashboard: false,
        foodManagement: false,
        orderManagement: false,
        tableManagement: false,
        reservationManagement: false,
        paymentManagement: false,
        inventoryManagement: false,
        workersManagement: false,
      },
    });
    setShowModal(true);
  };

  const openEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      permissions: { ...employee.permissions },
    });
    setShowModal(true);
  };

  const handleSaveEmployee = () => {
    if (!employeeForm.name || !employeeForm.email || !employeeForm.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                name: employeeForm.name,
                email: employeeForm.email,
                phone: employeeForm.phone,
                role: employeeForm.role,
                permissions: employeeForm.permissions,
              }
            : emp
        )
      );
      toast.success("Employee updated successfully!");
    } else {
      const newEmployee: Employee = {
        id: employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1,
        name: employeeForm.name,
        email: employeeForm.email,
        phone: employeeForm.phone,
        role: employeeForm.role,
        permissions: employeeForm.permissions,
        status: "Active",
        hireDate: new Date().toISOString().split('T')[0],
      };
      setEmployees([...employees, newEmployee]);
      toast.success("Employee added successfully!");
    }

    setShowModal(false);
  };

  const handleDeleteEmployee = (id: number) => {
    if (id === 1) {
      toast.error("Cannot delete the main administrator account");
      return;
    }
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.success("Employee deleted successfully!");
  };

  const togglePermission = (permission: keyof Employee["permissions"]) => {
    setEmployeeForm({
      ...employeeForm,
      permissions: {
        ...employeeForm.permissions,
        [permission]: !employeeForm.permissions[permission],
      },
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workers Management</h1>
        <p className="text-gray-600">Manage employees and their permissions</p>
      </div>

      {/* Add Employee Button */}
      <div className="mb-6">
        <button
          onClick={openAddEmployee}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Employees List */}
      <div className="grid grid-cols-1 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-semibold">{employee.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      employee.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {employee.status}
                    </span>
                  </div>
                  <p className="text-amber-600 font-medium mb-2">{employee.role}</p>
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{employee.phone}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Hire Date: {new Date(employee.hireDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditEmployee(employee)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Permissions */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold">Permissions</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(employee.permissions).map(([key, value]) => (
                  <div
                    key={key}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      value
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-500 border border-gray-300"
                    }`}
                  >
                    {permissionLabels[key as keyof typeof permissionLabels]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-semibold mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={employeeForm.name}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={employeeForm.role}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Manager, Server, Chef, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="employee@restora.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={employeeForm.phone}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="font-semibold mb-4">Permissions</h4>
                <div className="space-y-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={employeeForm.permissions[key as keyof typeof employeeForm.permissions]}
                        onChange={() => togglePermission(key as keyof Employee["permissions"])}
                        className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEmployee}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
              >
                {editingEmployee ? "Update" : "Add"} Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
