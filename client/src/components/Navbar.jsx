import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import SearchBar from "./SearchBar";
import { ShoppingBag, ShoppingCart, Heart, LogOut, User, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  // Simple Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const { cartItemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">
          <ShoppingBag size={24} style={{ color: "var(--primary)" }} />
          <span>Thiran</span>Shop
        </Link>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={handleSearchSubmit}
        />

        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/shop" className="nav-link">Shop</Link>
          </li>
          {user && (
            <li>
              <Link to="/my-orders" className="nav-link">My Orders</Link>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {/* Theme Toggle */}
          <button className="nav-icon-btn" onClick={toggleTheme} style={{ background: "none", border: "none" }} aria-label="Toggle Theme">
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
          </Link>

          {/* User Section */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "500", color: "var(--text-dark)" }}>
                <User size={16} style={{ color: "var(--primary)" }} />
                <span>{user.username}</span>
              </div>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="btn btn-outline"
                  style={{ padding: "6px 12px", fontSize: "13px", borderRadius: "var(--radius-sm)", borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  Admin
                </Link>
              )}
              <button
                className="btn btn-outline"
                onClick={logout}
                style={{ padding: "6px 12px", fontSize: "13px", borderRadius: "var(--radius-sm)" }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: "8px 16px", borderRadius: "var(--radius-md)" }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
