import { useState } from "react";
import { Plus, Edit, Trash2, X, Tag } from "lucide-react";
import { toast } from "sonner";

interface DishType {
  id: number;
  name: string;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  typeId: number;
}

export function FoodManagementPage() {
  const [dishTypes, setDishTypes] = useState<DishType[]>([
    { id: 1, name: "Appetizers" },
    { id: 2, name: "Main Course" },
    { id: 3, name: "Desserts" },
    { id: 4, name: "Beverages" },
  ]);

  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: 1,
      name: "Grilled Ribeye Steak",
      description: "Prime cut ribeye with herb butter",
      price: 42,
      image: "https://images.unsplash.com/photo-1693422660544-014dd9f3ef73?w=400",
      typeId: 2,
    },
    {
      id: 2,
      name: "Fresh Pasta Carbonara",
      description: "House-made pasta with pancetta",
      price: 28,
      image: "https://images.unsplash.com/photo-1676300184847-4ee4030409c0?w=400",
      typeId: 2,
    },
    {
      id: 3,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with ice cream",
      price: 14,
      image: "https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?w=400",
      typeId: 3,
    },
  ]);

  const [showDishModal, setShowDishModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [newTypeName, setNewTypeName] = useState("");

  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    typeId: "",
  });

  const openAddDish = () => {
    setEditingDish(null);
    setDishForm({ name: "", description: "", price: "", image: "", typeId: "" });
    setShowDishModal(true);
  };

  const openEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      image: dish.image,
      typeId: dish.typeId.toString(),
    });
    setShowDishModal(true);
  };

  const handleSaveDish = () => {
    if (!dishForm.name || !dishForm.price || !dishForm.typeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingDish) {
      setDishes(
        dishes.map((d) =>
          d.id === editingDish.id
            ? {
                ...d,
                name: dishForm.name,
                description: dishForm.description,
                price: parseFloat(dishForm.price),
                image: dishForm.image,
                typeId: parseInt(dishForm.typeId),
              }
            : d
        )
      );
      toast.success("Dish updated successfully!");
    } else {
      const newDish: Dish = {
        id: dishes.length > 0 ? Math.max(...dishes.map((d) => d.id)) + 1 : 1,
        name: dishForm.name,
        description: dishForm.description,
        price: parseFloat(dishForm.price),
        image: dishForm.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        typeId: parseInt(dishForm.typeId),
      };
      setDishes([...dishes, newDish]);
      toast.success("Dish added successfully!");
    }

    setShowDishModal(false);
  };

  const handleDeleteDish = (id: number) => {
    setDishes(dishes.filter((d) => d.id !== id));
    toast.success("Dish deleted successfully!");
  };

  const handleAddType = () => {
    if (!newTypeName.trim()) {
      toast.error("Please enter a type name");
      return;
    }

    const newType: DishType = {
      id: dishTypes.length > 0 ? Math.max(...dishTypes.map((t) => t.id)) + 1 : 1,
      name: newTypeName,
    };
    setDishTypes([...dishTypes, newType]);
    setNewTypeName("");
    toast.success("Type added successfully!");
  };

  const handleDeleteType = (id: number) => {
    const hasDishe = dishes.some((d) => d.typeId === id);
    if (hasDishe) {
      toast.error("Cannot delete type with existing dishes!");
      return;
    }
    setDishTypes(dishTypes.filter((t) => t.id !== id));
    toast.success("Type deleted successfully!");
  };

  const getTypeName = (typeId: number) => {
    return dishTypes.find((t) => t.id === typeId)?.name || "Unknown";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Food Management</h1>
        <p className="text-gray-600">Manage dishes and food categories</p>
      </div>

      {/* Dish Types Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Dish Types</h2>
          <button
            onClick={() => setShowTypeModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Type
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {dishTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
            >
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{type.name}</span>
              <button
                onClick={() => handleDeleteType(type.id)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dishes Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Dishes</h2>
          <button
            onClick={openAddDish}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Dish
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <div key={dish.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <span className="text-xs text-amber-600 font-medium">
                      {getTypeName(dish.typeId)}
                    </span>
                    <h3 className="font-semibold text-lg">{dish.name}</h3>
                  </div>
                  <span className="text-lg font-bold text-amber-600">${dish.price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{dish.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditDish(dish)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDish(dish.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Dish Modal */}
      {showDishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {editingDish ? "Edit Dish" : "Add New Dish"}
              </h3>
              <button
                onClick={() => setShowDishModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dish Name *
                </label>
                <input
                  type="text"
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter dish name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={dishForm.typeId}
                    onChange={(e) => setDishForm({ ...dishForm, typeId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select type</option>
                    {dishTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={dishForm.image}
                  onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDishModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDish}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
              >
                {editingDish ? "Update" : "Add"} Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Type Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Add Dish Type</h3>
              <button
                onClick={() => setShowTypeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type Name *
              </label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Salads, Soups"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowTypeModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddType}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
              >
                Add Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
