import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, ListOrdered } from "lucide-react";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");

  return (
    <div className="container section flex-center animate-fade-in" style={{ minHeight: "70vh" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "48px 32px",
          width: "100%",
          maxWidth: "550px",
          boxShadow: "var(--shadow-lg)",
          textAlign: "center",
        }}
      >
        <div className="flex-center" style={{ color: "var(--success)", marginBottom: "20px" }}>
          <CheckCircle size={64} fill="var(--success-bg)" />
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-dark)", marginBottom: "8px" }}>
          Order Confirmed!
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "32px", lineHeight: "1.6" }}>
          Thank you for your order. We have received your payment and are preparing your package for shipment.
        </p>

        {/* Order Info Summary */}
        <div
          style={{
            background: "var(--bg-main)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            marginBottom: "32px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className="flex-between" style={{ fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)" }}>Order Reference ID:</span>
            <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>#{orderId}</span>
          </div>
          <div className="flex-between" style={{ fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)" }}>Total Price Charged:</span>
            <span style={{ fontWeight: "700", color: "var(--primary)" }}>${parseFloat(total || 0).toFixed(2)}</span>
          </div>
          <div className="flex-between" style={{ fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)" }}>Payment Method:</span>
            <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>Simulated Credit Card</span>
          </div>
          <div className="flex-between" style={{ fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)" }}>Order Status:</span>
            <span
              style={{
                background: "var(--warning-bg)",
                border: "1px solid var(--warning)",
                color: "var(--warning)",
                fontSize: "11px",
                fontWeight: "600",
                padding: "2px 8px",
                borderRadius: "var(--radius-round)",
              }}
            >
              Pending
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Link to="/my-orders" className="btn btn-primary">
            <ListOrdered size={16} /> View Orders
          </Link>
          <Link to="/shop" className="btn btn-outline">
            <ShoppingBag size={16} /> Shop More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
