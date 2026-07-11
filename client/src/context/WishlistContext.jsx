import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  // Fetch user's wishlist from API when user logs in
  const fetchWishlist = async () => {
    if (!token) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/wishlist");
      setWishlistItems(res.data);
    } catch (err) {
      console.error("Error loading wishlist from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token, user]);

  // Toggle product in wishlist (add if not present, remove if present)
  const toggleWishlist = async (productId) => {
    if (!token) {
      return { success: false, message: "Please log in to add items to your wishlist." };
    }
    try {
      const res = await api.post("/wishlist", { productId });
      await fetchWishlist(); // Reload updated items list
      return { success: true, isWishlisted: res.data.isWishlisted };
    } catch (err) {
      console.error("Error toggling wishlist item:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update wishlist.",
      };
    }
  };

  // Remove item by wishlist row ID
  const removeFromWishlist = async (wishlistId) => {
    if (!token) return { success: false };
    try {
      await api.delete(`/wishlist/${wishlistId}`);
      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting wishlist item:", err);
      fetchWishlist();
      return { success: false };
    }
  };

  // Helper check to check if product is wishlisted
  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.product_id === parseInt(productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
