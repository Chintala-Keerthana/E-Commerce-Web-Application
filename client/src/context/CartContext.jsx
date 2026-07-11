import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  // Load cart items from API when user logs in/token is available
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCartItems(res.data);
    } catch (err) {
      console.error("Error loading cart from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, user]);

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      return { success: false, message: "Please log in to add items to your cart." };
    }
    try {
      await api.post("/cart", { productId, quantity });
      await fetchCart(); // Refresh cart list
      return { success: true };
    } catch (err) {
      console.error("Error adding to cart:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add product to cart.",
      };
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!token) return { success: false };
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      // Optmistic UI update or fetch from server
      setCartItems((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      fetchCart(); // Fallback on error
      return { success: false };
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    if (!token) return { success: false };
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      return { success: true };
    } catch (err) {
      console.error("Error removing cart item:", err);
      fetchCart();
      return { success: false };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!token) return { success: false };
    try {
      await api.delete("/cart");
      setCartItems([]);
      return { success: true };
    } catch (err) {
      console.error("Error clearing cart:", err);
      fetchCart();
      return { success: false };
    }
  };

  // Calculate cart metrics
  const cartTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
