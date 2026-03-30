import { useState } from "react";
import { Search, Tag } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "food" | "drink";
  type: string;
  image: string;
  isOnSale?: boolean;
  salePrice?: number;
}

export function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "food" | "drink">("all");

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Grilled Ribeye Steak",
      description: "Prime cut ribeye with herb butter, mashed potatoes, and seasonal vegetables",
      price: 42,
      category: "food",
      type: "Main Course",
      image: "https://images.unsplash.com/photo-1693422660544-014dd9f3ef73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc3RlYWslMjBkaW5uZXJ8ZW58MXx8fHwxNzc0NzgwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isOnSale: true,
      salePrice: 36,
    },
    {
      id: 2,
      name: "Fresh Pasta Carbonara",
      description: "House-made pasta with pancetta, egg yolk, and aged parmesan",
      price: 28,
      category: "food",
      type: "Main Course",
      image: "https://images.unsplash.com/photo-1676300184847-4ee4030409c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBhc3RhJTIwZGlzaHxlbnwxfHx8fDE3NzQ4MTQ3OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      name: "Gourmet Platter",
      description: "A selection of artisanal cheeses, cured meats, and accompaniments",
      price: 32,
      category: "food",
      type: "Appetizer",
      image: "https://images.unsplash.com/photo-1755811248324-3c9b7c8865fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzc0NzY0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isOnSale: true,
      salePrice: 26,
    },
    {
      id: 4,
      name: "Chocolate Lava Cake",
      description: "Warm molten chocolate cake served with vanilla bean ice cream",
      price: 14,
      category: "food",
      type: "Dessert",
      image: "https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2hvY29sYXRlJTIwY2FrZXxlbnwxfHx8fDE3NzQ3NjI0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 5,
      name: "Signature Cocktail",
      description: "Our house special blend with premium spirits and fresh ingredients",
      price: 16,
      category: "drink",
      type: "Cocktail",
      image: "https://images.unsplash.com/photo-1650691960684-c15e3e2d5c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rcyUyMGJhcnxlbnwxfHx8fDE3NzQ4Mzc2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isOnSale: true,
      salePrice: 12,
    },
    {
      id: 6,
      name: "Fresh Squeezed Lemonade",
      description: "House-made lemonade with fresh mint",
      price: 6,
      category: "drink",
      type: "Non-Alcoholic",
      image: "https://images.unsplash.com/photo-1650691960684-c15e3e2d5c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rcyUyMGJhcnxlbnwxfHx8fDE3NzQ4Mzc2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 7,
      name: "Caesar Salad",
      description: "Crisp romaine lettuce, parmesan, croutons, and Caesar dressing",
      price: 16,
      category: "food",
      type: "Salad",
      image: "https://images.unsplash.com/photo-1755811248324-3c9b7c8865fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzc0NzY0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 8,
      name: "Craft Beer Selection",
      description: "Rotating selection of local and imported craft beers",
      price: 8,
      category: "drink",
      type: "Beer",
      image: "https://images.unsplash.com/photo-1650691960684-c15e3e2d5c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rcyUyMGJhcnxlbnwxfHx8fDE3NzQ4Mzc2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-amber-100">Delicious food and refreshing drinks</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory("food")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === "food"
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Food
              </button>
              <button
                onClick={() => setSelectedCategory("drink")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === "drink"
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Drinks
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative">
              {/* Sale Badge */}
              {item.isOnSale && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="font-semibold">Sale</span>
                </div>
              )}

              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm text-amber-600 font-medium">{item.type}</span>
                    <h3 className="text-xl font-semibold mt-1">{item.name}</h3>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                <div className="flex justify-between items-center">
                  <div>
                    {item.isOnSale ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-red-500">${item.salePrice}</span>
                        <span className="text-lg text-gray-400 line-through">${item.price}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
