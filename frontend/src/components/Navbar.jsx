import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import authStore from "../store/store.js";
import { cartStore } from "../store/store.js";
import "./Navbar.css";
import axios from "axios";

function Navbar() {
  const currentUser = authStore((state) => state.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = cartStore((state) => state.cartCount);
  const fetchAndSetCartCount = cartStore((state) => state.fetchAndSetCartCount);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);

  useEffect(() => {
    fetchAndSetCartCount();
  }, [currentUser, fetchAndSetCartCount]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      alert(err);
    }
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            ClothzyStore
          </Link>

          <div className="navbar-links">
            <Link to="/products" className="navbar-link">
              Products
            </Link>
            <Link to="/about" className="navbar-link">
              About
            </Link>
            <Link to="/contact" className="navbar-link">
              Contact
            </Link>
          </div>

          <div className="navbar-right">
            {currentUser && (
              <Link
                to="/cart"
                className="navbar-link cart-icon"
                style={{ position: "relative" }}
              >
                <ShoppingCartIcon className="icon" />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
            )}

            {currentUser ? (
              <div
                className="relative"
                ref={dropdownRef}
                style={{ position: "relative" }}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="navbar-link"
                >
                  <UserIcon className="icon" />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {currentUser.role === "admin" && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="navbar-link">
                <span>Login</span>
              </Link>
            )}

            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="icon" />
              ) : (
                <Bars3Icon className="icon" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`mobile-nav-links ${
            mobileMenuOpen ? "mobile-menu-open" : ""
          }`}
        >
          <Link
            to="/products"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/about"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
