import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Guard: if cart is empty, redirect back
  if (cartItems.length === 0 && !isProcessing) {
    return <Navigate to="/cart" replace />;
  }

  const shippingFee = cartTotal >= 100 ? 0.0 : 9.99;
  const estimatedTax = cartTotal * 0.05;
  const orderTotal = cartTotal + shippingFee + estimatedTax;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !address || !city || !zip || !cardNumber || !expiry || !cvv) {
      setError("Please fill in all fields.");
      return;
    }

    // Trigger Payment Simulation
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const shippingAddress = `${name}, ${address}, ${city} - ${zip}`;
        
        // Format items list for backend insertion
        const formattedItems = cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        }));

        const res = await api.post("/orders", {
          totalPrice: orderTotal,
          shippingAddress,
          paymentMethod: "Simulated Credit Card",
          items: formattedItems,
        });

        // Clear local/backend cart state on checkout success
        await clearCart();
        setIsProcessing(false);
        addToast("Order placed successfully!", "success");

        // Redirect to success screen
        navigate(`/checkout-success?orderId=${res.data.orderId}&total=${orderTotal.toFixed(2)}`);
      } catch (err) {
        console.error("Checkout transaction error:", err);
        setError(err.response?.data?.message || "Failed to process checkout. Please try again.");
        setIsProcessing(false);
      }
    }, 2000); // 2 seconds simulated payment loading delay
  };

  return (
    <div className="container section animate-fade-in" style={{ padding: "40px 24px" }}>
      <h2 style={{ textAlign: "left", color: "var(--text-dark)", marginBottom: "24px" }}>Checkout</h2>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "24px" }}>
          <span>{error}</span>
        </div>
      )}

      {isProcessing ? (
        <div className="flex-center" style={{ flexDirection: "column", minHeight: "50vh", gap: "20px" }}>
          <div className="spinner" style={{ width: "50px", height: "50px", borderWidth: "4px" }} />
          <h3 style={{ color: "var(--text-dark)" }}>Processing Your Payment...</h3>
          <p style={{ color: "var(--text-muted)" }}>Please do not close this window or reload the page.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="cart-layout">
          {/* Left Column - Checkout forms */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Shipping details */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "left" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Truck size={20} style={{ color: "var(--primary)" }} /> Shipping Information
              </h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="ship-name">Recipient Full Name</label>
                <input
                  id="ship-name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ship-address">Street Address</label>
                <input
                  id="ship-address"
                  type="text"
                  className="form-input"
                  placeholder="Apt, Suite, Street Name"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="ship-city">City</label>
                  <input
                    id="ship-city"
                    type="text"
                    className="form-input"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="ship-zip">Zip/Postal Code</label>
                  <input
                    id="ship-zip"
                    type="text"
                    className="form-input"
                    placeholder="10001"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment simulation */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "left" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={20} style={{ color: "var(--primary)" }} /> Payment details (Simulation)
              </h3>
              
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", background: "var(--primary-light-bg)", padding: "8px", borderRadius: "var(--radius-sm)" }}>
                💳 This checkout is simulated. You can type any card number to proceed. No real charges are made.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="card-number">Card Number</label>
                <input
                  id="card-number"
                  type="text"
                  className="form-input"
                  placeholder="4000 1234 5678 9010"
                  maxLength="19"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="card-expiry">Expiry Date</label>
                  <input
                    id="card-expiry"
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="card-cvv">CVV</label>
                  <input
                    id="card-cvv"
                    type="password"
                    className="form-input"
                    placeholder="123"
                    maxLength="4"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Summary & Actions */}
          <div className="cart-summary animate-slide-up" style={{ alignSelf: "start" }}>
            <h3 className="summary-title">Summary of Order</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
              {cartItems.map((item) => (
                <div key={item.id} className="flex-between" style={{ fontSize: "14px" }}>
                  <span style={{ color: "var(--text-muted)" }}>
                    {item.name} <strong style={{ color: "var(--text-dark)" }}>x{item.quantity}</strong>
                  </span>
                  <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Cart Subtotal</span>
              <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>
                {shippingFee === 0 ? <span style={{ color: "var(--success)" }}>Free</span> : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-row">
              <span>Taxes (5%)</span>
              <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>${estimatedTax.toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total Price</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px 20px" }}>
              <ShieldCheck size={18} /> Place Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
