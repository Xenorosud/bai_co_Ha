import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Phone, Clock } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/reservation", label: "Reservations" },
    { path: "/order", label: "Order Online" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="hidden md:flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Mon-Sun: 11:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Main navigation */}
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">R</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Restora</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive(link.path)
                      ? "text-amber-600 font-semibold"
                      : "text-gray-700 hover:text-amber-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-amber-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 px-4 transition-colors ${
                    isActive(link.path)
                      ? "text-amber-600 font-semibold bg-amber-50"
                      : "text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">R</span>
                </div>
                <span className="text-xl font-bold">Restora</span>
              </div>
              <p className="text-gray-400 text-sm">
                Experience fine dining at its best. Fresh ingredients, exceptional service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-amber-500">Home</Link></li>
                <li><Link to="/menu" className="hover:text-amber-500">Menu</Link></li>
                <li><Link to="/reservation" className="hover:text-amber-500">Reservations</Link></li>
                <li><Link to="/order" className="hover:text-amber-500">Order Online</Link></li>
                <li><Link to="/admin" className="hover:text-amber-500">Admin Panel</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Monday - Friday: 11:00 AM - 10:00 PM</li>
                <li>Saturday: 10:00 AM - 11:00 PM</li>
                <li>Sunday: 10:00 AM - 9:00 PM</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>123 Restaurant Street</li>
                <li>New York, NY 10001</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@restora.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Restora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}