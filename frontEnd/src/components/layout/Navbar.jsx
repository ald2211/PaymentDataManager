import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white text-black shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-gray-200 rounded-full w-10 h-10">
              <span className="text-black font-bold text-lg">📅</span>
            </div>
            <h1 className="ml-2 text-2xl font-semibold tracking-wide">
              Data Manager
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-black hover:text-gray-600 transition duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/entry/new")}
              className="px-4 py-2 text-black hover:text-gray-600 transition duration-200"
            >
              New Entry
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-black focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => {
                navigate("/dashboard");
                toggleMobileMenu();
              }}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 rounded transition duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/events/new");
                toggleMobileMenu();
              }}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 rounded transition duration-200"
            >
              Create Event
            </button>
            <button
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="block w-full text-left px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
