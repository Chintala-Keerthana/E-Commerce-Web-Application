import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, RefreshCw } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const handleQtyChange = (cartItemId, currentQty, stock, modifier) => {
    const nextQty = currentQty + modifier;
    if (nextQty >= 1 && nextQty <= stock) {
      updateQuantity(cartItemId, nextQty);
    }
  };

  const handleRemove = async (itemId, itemName) => {
    const res = await removeFromCart(itemId);
    if (res.success) {
      addToast(`Removed ${itemName} from cart`, "info");
    } else {
      addToast(`Failed to remove ${itemName}`, "error");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      const res = await clearCart();
      if (res.success) {
        addToast("Cleared all items from your cart", "info");
      } else {
        addToast("Failed to clear cart", "error");
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container section flex-center" style={{ flexDirection: "column", minHeight: "50vh", gap: "16px" }}>
        <ShoppingBag size={64} style={{ color: "var(--text-muted)", opacity: 0.8 }} />
        <h2 style={{ color: "var(--text-dark)" }}>Your Cart is Empty</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "400px", textAlign: "center" }}>
          Looks like you haven't added anything to your cart yet. Head over to our catalog and discover amazing deals.
        </p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: "12px" }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Shipping & Tax calculations
  const shippingFee = cartTotal >= 100 ? 0.0 : 9.99;
  const estimatedTax = cartTotal * 0.05; // 5% VAT
  const orderTotal = cartTotal + shippingFee + estimatedTax;

  return (
    <div className="container section animate-fade-in" style={{ padding: "40px 24px" }}>
      <h2 style={{ textAlign: "left", color: "var(--text-dark)", marginBottom: "24px" }}>Shopping Cart</h2>

      <div className="cart-layout">
        {/* Left Side - Cart Items */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image_url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-info" style={{ textAlign: "left" }}>
                <h4 className="cart-item-title">{item.name}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>
                  {item.category}
                </p>
                <div className="cart-item-price">${parseFloat(item.price).toFixed(2)}</div>
              </div>

              {/* Quantity Changer */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div className="quantity-picker" style={{ scale: "0.9" }}>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQtyChange(item.id, item.quantity, item.stock, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <div className="quantity-value">{item.quantity}</div>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQtyChange(item.id, item.quantity, item.stock, 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {item.quantity >= item.stock && (
                  <span style={{ fontSize: "10px", color: "var(--warning)", fontWeight: "500" }}>
                    Limit reached ({item.stock})
                  </span>
                )}
              </div>

              {/* Subtotal & Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ fontWeight: "700", color: "var(--text-dark)", width: "80px", textAlign: "right" }}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
                <button
                  className="btn-icon-only"
                  onClick={() => handleRemove(item.id, item.name)}
                  style={{ color: "var(--text-muted)", border: "1px solid var(--border-color)", padding: "10px" }}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Action Row */}
          <div className="flex-between" style={{ marginTop: "16px" }}>
            <Link to="/shop" className="btn btn-outline">
              Continue Shopping
            </Link>
            <button className="btn btn-outline" onClick={handleClearCart} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right Side - Cart Summary */}
        <div className="cart-summary animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>
              {shippingFee === 0 ? (
                <span style={{ color: "var(--success)" }}>Free</span>
              ) : (
                `$${shippingFee.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="summary-row">
            <span>Estimated Tax (5%)</span>
            <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>${estimatedTax.toFixed(2)}</span>
          </div>

          {shippingFee > 0 && (
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "left", background: "var(--primary-light-bg)", padding: "8px", borderRadius: "var(--radius-sm)", margin: "12px 0" }}>
              💡 Add <strong>${(100 - cartTotal).toFixed(2)}</strong> more to unlock <strong>Free Shipping</strong>!
            </p>
          )}

          <div className="summary-row total">
            <span>Order Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>

          <button className="btn btn-primary" onClick={handleCheckout} style={{ width: "100%", padding: "14px 20px" }}>
            <CreditCard size={18} /> Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
