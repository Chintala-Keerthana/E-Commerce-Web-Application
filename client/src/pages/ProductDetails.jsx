import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { ArrowLeft, ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product details:", err);
        setError("Product not found or database is unreachable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleWishlistClick = async () => {
    if (!product) return;
    const res = await toggleWishlist(product.id);
    if (!res.success && res.message) {
      addToast(res.message, "error");
    } else {
      addToast(res.isWishlisted ? `Saved ${product.name} to wishlist!` : `Removed ${product.name} from wishlist!`, "success");
    }
  };

  const handleAddToCartClick = async () => {
    if (!product) return;
    const res = await addToCart(product.id, quantity);
    if (!res.success && res.message) {
      addToast(res.message, "error");
    } else {
      addToast(`Added ${quantity} x ${product.name} to cart!`, "success");
    }
  };

  if (loading) {
    return (
      <div className="container section animate-fade-in" style={{ padding: "40px 24px" }}>
        <div style={{ width: "120px", height: "38px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", marginBottom: "32px" }} className="skeleton-shimmer"></div>
        <div className="details-grid">
          <div className="details-image-container skeleton-shimmer" style={{ paddingTop: "100%", height: 0 }}></div>
          <div style={{ textAlign: "left" }}>
            <div className="skeleton-line skeleton-category skeleton-shimmer" style={{ height: "16px", width: "120px" }}></div>
            <div className="skeleton-line skeleton-title skeleton-shimmer" style={{ height: "40px", width: "85%" }}></div>
            <div style={{ display: "flex", gap: "4px", margin: "16px 0" }}>
              {[...Array(5)].map((_, j) => (
                <div key={j} className="skeleton-star skeleton-shimmer" style={{ width: "18px", height: "18px" }}></div>
              ))}
            </div>
            <div className="skeleton-line skeleton-shimmer" style={{ height: "32px", width: "40%", marginBottom: "24px" }}></div>
            <div className="skeleton-line skeleton-shimmer" style={{ height: "100px", width: "100%", marginBottom: "24px" }}></div>
            <div className="details-actions">
              <div className="skeleton-shimmer" style={{ width: "130px", height: "46px", borderRadius: "var(--radius-md)" }}></div>
              <div className="skeleton-shimmer" style={{ flex: 1, height: "46px", borderRadius: "var(--radius-md)" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container section flex-center" style={{ flexDirection: "column", minHeight: "50vh", gap: "16px" }}>
        <div className="alert alert-danger" style={{ maxWidth: "500px" }}>
          <span>{error || "Could not retrieve product information."}</span>
        </div>
        <Link to="/shop" className="btn btn-outline">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const { name, description, price, image_url, category, stock } = product;

  return (
    <div className="container section animate-fade-in" style={{ padding: "40px 24px" }}>
      {/* Back Button */}
      <Link to="/shop" className="btn btn-outline" style={{ display: "inline-flex", marginBottom: "32px", padding: "8px 16px" }}>
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="details-grid">
        {/* Left Side - Image */}
        <div className="details-image-container">
          <img
            src={image_url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"}
            alt={name}
            className="details-image"
          />
        </div>

        {/* Right Side - Information */}
        <div style={{ textAlign: "left" }}>
          <span className="details-category">{category}</span>
          <h1 className="details-title" style={{ margin: "8px 0 16px" }}>{name}</h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < 4 ? "#f59e0b" : "none"}
                stroke={i < 4 ? "#f59e0b" : "var(--text-muted)"}
              />
            ))}
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark)", marginLeft: "4px" }}>4.0</span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>| 12 Reviews</span>
          </div>

          <div className="details-price">${parseFloat(price).toFixed(2)}</div>

          <p className="details-desc">{description}</p>

          {/* Stock Info & Controls */}
          <div className="details-meta">
            <div className="details-meta-item">
              <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>Availability: </span>
              {stock === 0 ? (
                <span style={{ color: "var(--danger)", fontWeight: "600" }}>Out of Stock</span>
              ) : stock < 5 ? (
                <span style={{ color: "var(--warning)", fontWeight: "600" }}>Low Stock: Only {stock} left!</span>
              ) : (
                <span style={{ color: "var(--success)", fontWeight: "600" }}>In Stock ({stock} available)</span>
              )}
            </div>
          </div>

          {stock > 0 && (
            <div className="details-actions">
              {/* Quantity Selector */}
              <div className="quantity-picker">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={handleDecreaseQty}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="quantity-value">{quantity}</div>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={handleIncreaseQty}
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                className="btn btn-primary"
                onClick={handleAddToCartClick}
                style={{ flex: 1, padding: "12px 24px" }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>

              {/* Add to Wishlist */}
              <button
                className={`btn-icon-only ${isWishlisted(product.id) ? "active" : ""}`}
                onClick={handleWishlistClick}
                style={{ width: "48px", height: "48px", color: isWishlisted(product.id) ? "var(--danger)" : "inherit" }}
                aria-label="Add to Wishlist"
              >
                <Heart size={20} fill={isWishlisted(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "32px", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Truck size={20} style={{ color: "var(--primary)" }} />
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark)" }}>Fast Delivery</h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Shipped within 24-48 hours</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <RotateCcw size={20} style={{ color: "var(--primary)" }} />
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark)" }}>Easy Returns</h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>30-day money-back guarantee</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
