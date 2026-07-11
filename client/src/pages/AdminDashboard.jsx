import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  BarChart3,
  Package,
  ListOrdered,
  Users,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  X,
  PlusCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Guard check
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Active tab state: stats, products, orders, users
  const [activeTab, setActiveTab] = useState("stats");

  // Live states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  // Product Form Fields
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodDesc, setProdDesc] = useState("");

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error loading admin stats:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsersList(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  // Fetch data depending on active tab
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (activeTab === "stats") await loadStats();
      if (activeTab === "products") await loadProducts();
      if (activeTab === "orders") await loadOrders();
      if (activeTab === "users") await loadUsers();
      setLoading(false);
    };
    fetchData();
  }, [activeTab]);

  // Open Add modal
  const openAddProduct = () => {
    setModalMode("add");
    setEditingProductId(null);
    setProdName("");
    setProdPrice("");
    setProdCategory("");
    setProdImageUrl("");
    setProdStock("");
    setProdDesc("");
    setIsProductModalOpen(true);
  };

  // Open Edit modal
  const openEditProduct = (prod) => {
    setModalMode("edit");
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdCategory(prod.category);
    setProdImageUrl(prod.image_url);
    setProdStock(prod.stock);
    setProdDesc(prod.description);
    setIsProductModalOpen(true);
  };

  // Handle Add/Edit product submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      price: parseFloat(prodPrice),
      category: prodCategory,
      image_url: prodImageUrl,
      stock: parseInt(prodStock) || 0,
      description: prodDesc,
    };

    try {
      if (modalMode === "add") {
        await api.post("/products", payload);
        addToast("Product created successfully!", "success");
      } else {
        await api.put(`/products/${editingProductId}`, payload);
        addToast("Product updated successfully!", "success");
      }
      setIsProductModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      addToast(err.response?.data?.message || "Failed to save product.", "error");
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        addToast("Product deleted successfully!", "info");
        loadProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        addToast("Failed to delete product.", "error");
      }
    }
  };

  // Handle Order Status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      addToast("Order status updated successfully!", "success");
      loadOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      addToast("Failed to update status.", "error");
    }
  };

  return (
    <div className="container section animate-fade-in" style={{ padding: "40px 24px", minHeight: "80vh" }}>
      <h2 style={{ textAlign: "left", color: "var(--text-dark)", marginBottom: "30px" }}>Admin Panel Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px" }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ textAlign: "left" }}>
          <ul className="sidebar-list">
            <li
              className={`sidebar-item flex-between ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChart3 size={16} /> Analytics
              </span>
            </li>
            <li
              className={`sidebar-item flex-between ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Package size={16} /> Manage Products
              </span>
            </li>
            <li
              className={`sidebar-item flex-between ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ListOrdered size={16} /> Manage Orders
              </span>
            </li>
            <li
              className={`sidebar-item flex-between ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={16} /> User Accounts
              </span>
            </li>
          </ul>
        </aside>

        {/* Dashboard Panels */}
        <div>
          {loading ? (
            <div className="flex-center" style={{ minHeight: "300px" }}>
              <div className="spinner" />
            </div>
          ) : (
            <>
              
              {/* PANEL 1: ANALYTICS METRICS */}
              {activeTab === "stats" && stats && (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div className="grid grid-cols-4" style={{ gap: "20px" }}>
                    
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "20px", textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "8px" }}>TOTAL SALES REVENUE</div>
                      <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--primary)" }}>${stats.totalRevenue}</div>
                    </div>

                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "20px", textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "8px" }}>TOTAL ORDERS RECORDED</div>
                      <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.totalOrders}</div>
                    </div>

                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "20px", textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "8px" }}>TOTAL PRODUCT TYPES</div>
                      <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.totalProducts}</div>
                    </div>

                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "20px", textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "8px" }}>REGISTERED USERS</div>
                      <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-dark)" }}>{stats.totalUsers}</div>
                    </div>

                  </div>

                  {/* Dashboard Welcome panel */}
                  <div style={{ background: "var(--primary-light-bg)", border: "1px solid var(--border-focus)", borderRadius: "var(--radius-lg)", padding: "32px", textAlign: "left" }}>
                    <h3 style={{ color: "var(--primary)", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Welcome to the Store Manager</h3>
                    <p style={{ color: "var(--text-main)", fontSize: "14px", lineHeight: "1.6" }}>
                      Manage products, review sales charts, watch client profiles, and oversee shipping statuses. Select tabs on the left to initiate operations.
                    </p>
                  </div>
                </div>
              )}

              {/* PANEL 2: MANAGE PRODUCTS */}
              {activeTab === "products" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div className="flex-between">
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Total Products: {products.length}</p>
                    <button className="btn btn-primary" onClick={openAddProduct}>
                      <PlusCircle size={16} /> Add New Product
                    </button>
                  </div>

                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "var(--bg-main)", borderBottom: "1px solid var(--border-color)", color: "var(--text-dark)", fontWeight: "600" }}>
                            <th style={{ padding: "16px 24px" }}>Image</th>
                            <th style={{ padding: "16px 24px" }}>Product Name</th>
                            <th style={{ padding: "16px 24px" }}>Category</th>
                            <th style={{ padding: "16px 24px" }}>Price</th>
                            <th style={{ padding: "16px 24px" }}>Stock</th>
                            <th style={{ padding: "16px 24px", textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((prod) => (
                            <tr key={prod.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                              <td style={{ padding: "16px 24px" }}>
                                <img
                                  src={prod.image_url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=60&q=80"}
                                  alt={prod.name}
                                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}
                                />
                              </td>
                              <td style={{ padding: "16px 24px", fontWeight: "600", color: "var(--text-dark)" }}>{prod.name}</td>
                              <td style={{ padding: "16px 24px" }}>{prod.category}</td>
                              <td style={{ padding: "16px 24px", fontWeight: "600" }}>${parseFloat(prod.price).toFixed(2)}</td>
                              <td style={{ padding: "16px 24px" }}>
                                <span style={{ fontWeight: "600", color: prod.stock === 0 ? "var(--danger)" : prod.stock < 5 ? "var(--warning)" : "var(--success)" }}>
                                  {prod.stock}
                                </span>
                              </td>
                              <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                  <button
                                    className="btn btn-outline"
                                    onClick={() => openEditProduct(prod)}
                                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "var(--radius-sm)" }}
                                    title="Edit Product"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    className="btn btn-outline"
                                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "var(--radius-sm)", color: "var(--danger)", borderColor: "var(--border-color)" }}
                                    title="Delete Product"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 3: MANAGE ORDERS */}
              {activeTab === "orders" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", textAlign: "left" }}>Total Orders Received: {orders.length}</p>

                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "var(--bg-main)", borderBottom: "1px solid var(--border-color)", color: "var(--text-dark)", fontWeight: "600" }}>
                            <th style={{ padding: "16px 24px" }}>Order ID</th>
                            <th style={{ padding: "16px 24px" }}>Client Account</th>
                            <th style={{ padding: "16px 24px" }}>Date</th>
                            <th style={{ padding: "16px 24px" }}>Address</th>
                            <th style={{ padding: "16px 24px" }}>Invoice Total</th>
                            <th style={{ padding: "16px 24px" }}>Shipping Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((ord) => (
                            <tr key={ord.id} style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-main)" }}>
                              <td style={{ padding: "16px 24px", fontWeight: "600", color: "var(--text-dark)" }}>#{ord.id}</td>
                              <td style={{ padding: "16px 24px" }}>
                                <div style={{ fontWeight: "500", color: "var(--text-dark)" }}>{ord.username}</div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ord.email}</div>
                              </td>
                              <td style={{ padding: "16px 24px" }}>{new Date(ord.created_at).toLocaleDateString()}</td>
                              <td style={{ padding: "16px 24px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={ord.shipping_address}>
                                {ord.shipping_address}
                              </td>
                              <td style={{ padding: "16px 24px", fontWeight: "600" }}>${parseFloat(ord.total_price).toFixed(2)}</td>
                              <td style={{ padding: "16px 24px" }}>
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "var(--radius-sm)",
                                    border: "1px solid var(--border-color)",
                                    background: "var(--bg-card)",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    color: ord.status === "Delivered" ? "var(--success)" : ord.status === "Shipped" ? "var(--primary)" : "var(--warning)",
                                    borderColor: ord.status === "Delivered" ? "var(--success)" : ord.status === "Shipped" ? "var(--primary)" : "var(--warning)",
                                  }}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 4: REGISTERED USERS */}
              {activeTab === "users" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", textAlign: "left" }}>Registered Users: {usersList.length}</p>

                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "var(--bg-main)", borderBottom: "1px solid var(--border-color)", color: "var(--text-dark)", fontWeight: "600" }}>
                            <th style={{ padding: "16px 24px" }}>ID</th>
                            <th style={{ padding: "16px 24px" }}>Full Name</th>
                            <th style={{ padding: "16px 24px" }}>Email</th>
                            <th style={{ padding: "16px 24px" }}>Role</th>
                            <th style={{ padding: "16px 24px" }}>Created Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.map((usr) => (
                            <tr key={usr.id} style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-main)" }}>
                              <td style={{ padding: "16px 24px", fontWeight: "600", color: "var(--text-dark)" }}>#{usr.id}</td>
                              <td style={{ padding: "16px 24px", fontWeight: "600", color: "var(--text-dark)" }}>{usr.username}</td>
                              <td style={{ padding: "16px 24px" }}>{usr.email}</td>
                              <td style={{ padding: "16px 24px" }}>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    padding: "2px 8px",
                                    borderRadius: "var(--radius-round)",
                                    background: usr.role === "admin" ? "var(--primary-light-bg)" : "var(--bg-main)",
                                    color: usr.role === "admin" ? "var(--primary)" : "var(--text-main)",
                                    border: usr.role === "admin" ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                                  }}
                                >
                                  {usr.role}
                                </span>
                              </td>
                              <td style={{ padding: "16px 24px" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <Calendar size={14} style={{ color: "var(--text-muted)" }} />
                                  {new Date(usr.created_at).toLocaleDateString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
        </div>

      </div>

      {/* Product ADD/EDIT Modal */}
      {isProductModalOpen && (
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
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "28px",
              width: "100%",
              maxWidth: "550px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "var(--shadow-lg)",
              textAlign: "left",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between" style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-dark)" }}>
                {modalMode === "add" ? "Add Product" : "Edit Product"}
              </h3>
              <button
                className="btn-icon-only"
                onClick={() => setIsProductModalOpen(false)}
                style={{ width: "32px", height: "32px", border: "none" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-name">Product Title</label>
                <input
                  id="prod-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. AeroPro Headphones"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-price">Price ($)</label>
                  <input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="299.99"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-stock">Stock Quantity</label>
                  <input
                    id="prod-stock"
                    type="number"
                    className="form-input"
                    placeholder="50"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-category">Category</label>
                <input
                  id="prod-category"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Electronics, Fashion"
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-image">Image URL</label>
                <input
                  id="prod-image"
                  type="text"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-desc">Description</label>
                <textarea
                  id="prod-desc"
                  className="form-input"
                  rows="4"
                  placeholder="Write description here..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }}>
                {modalMode === "add" ? "Create Product" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
