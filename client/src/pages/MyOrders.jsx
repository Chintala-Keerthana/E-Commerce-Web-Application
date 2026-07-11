import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { ListOrdered, Eye, Calendar, DollarSign, X } from "lucide-react";

const MyOrders = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal detailed order view
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading user orders:", err);
      setError("Failed to load your order history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = async (orderId) => {
    setLoadingDetails(true);
    try {
      const res = await api.get(`/orders/${orderId}`);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error("Error loading order details:", err);
      addToast("Failed to load order details.", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { background: "var(--success-bg)", border: "1px solid var(--success)", color: "var(--success)" };
      case "Shipped":
        return { background: "var(--primary-light-bg)", border: "1px solid var(--primary)", color: "var(--primary)" };
      default:
        return { background: "var(--warning-bg)", border: "1px solid var(--warning)", color: "var(--warning)" };
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container section animate-fade-in" style={{ padding: "40px 24px" }}>
      <h2 style={{ textAlign: "left", color: "var(--text-dark)", marginBottom: "24px" }}>My Orders</h2>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "20px" }}>
          <span>{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex-center" style={{ flexDirection: "column", minHeight: "45vh", gap: "16px" }}>
          <ListOrdered size={64} style={{ color: "var(--text-muted)", opacity: 0.8 }} />
          <h3 style={{ color: "var(--text-dark)" }}>No Orders Yet</h3>
          <p style={{ color: "var(--text-muted)" }}>You haven't placed any orders with us yet.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: "8px" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {/* Orders Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--bg-main)", borderBottom: "1px solid var(--border-color)", color: "var(--text-dark)", fontWeight: "600" }}>
                  <th style={{ padding: "16px 24px" }}>Order ID</th>
                  <th style={{ padding: "16px 24px" }}>Date</th>
                  <th style={{ padding: "16px 24px" }}>Total Price</th>
                  <th style={{ padding: "16px 24px" }}>Payment Method</th>
                  <th style={{ padding: "16px 24px" }}>Status</th>
                  <th style={{ padding: "16px 24px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-main)" }}>
                    <td style={{ padding: "16px 24px", fontWeight: "600", color: "var(--text-dark)" }}>#{order.id}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={14} style={{ color: "var(--text-muted)" }} />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", fontWeight: "600" }}>${parseFloat(order.total_price).toFixed(2)}</td>
                    <td style={{ padding: "16px 24px" }}>{order.payment_method}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "2px 10px",
                          borderRadius: "var(--radius-round)",
                          display: "inline-block",
                          ...getStatusStyle(order.status),
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => handleViewDetails(order.id)}
                        style={{ padding: "6px 12px", fontSize: "13px", borderRadius: "var(--radius-sm)" }}
                      >
                        <Eye size={14} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "28px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "var(--shadow-lg)",
              textAlign: "left",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between" style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-dark)" }}>
                Order Details: #{selectedOrder.id}
              </h3>
              <button
                className="btn-icon-only"
                onClick={() => setSelectedOrder(null)}
                style={{ width: "32px", height: "32px", border: "none" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px" }}>
              <div className="flex-between" style={{ fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Order Placed:</span>
                <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
              </div>
              <div className="flex-between" style={{ fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Status:</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-round)",
                    ...getStatusStyle(selectedOrder.status),
                  }}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex-between" style={{ fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Shipping Address:</span>
                <span style={{ fontWeight: "500", color: "var(--text-dark)", maxWidth: "350px", textAlign: "right" }}>
                  {selectedOrder.shipping_address}
                </span>
              </div>
              <div className="flex-between" style={{ fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Payment Method:</span>
                <span>{selectedOrder.payment_method}</span>
              </div>
            </div>

            {/* Order Items */}
            <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "12px" }}>Items Purchased</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px", marginBottom: "20px" }}>
              {selectedOrder.items &&
                selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex-between" style={{ fontSize: "14px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=60&q=80"}
                        alt={item.name}
                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}
                      />
                      <div>
                        <div style={{ fontWeight: "600", color: "var(--text-dark)" }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: "600", color: "var(--text-dark)" }}>
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex-between" style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-dark)" }}>
              <span>Total Bill (incl. Shipping & Tax)</span>
              <span style={{ color: "var(--primary)", fontSize: "18px" }}>${parseFloat(selectedOrder.total_price).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
