import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Trash2, ShoppingCart, Heart, ArrowRight } from "lucide-react";

const Wishlist = () => {
  const { addToast } = useToast();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (item) => {
    // Add to cart
    const res = await addToCart(item.product_id, 1);
    if (res.success) {
      // Remove from wishlist
      await removeFromWishlist(item.id);
      addToast(`Moved ${item.name} to cart!`, "success");
    } else if (res.message) {
      addToast(res.message, "error");
    }
  };

  const handleRemove = async (itemId, itemName) => {
    const res = await removeFromWishlist(itemId);
    if (res.success) {
      addToast(`Removed ${itemName} from wishlist`, "info");
    } else {
      addToast("Failed to remove item", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container section flex-center" style={{ flexDirection: "column", minHeight: "50vh", gap: "16px" }}>
        <Heart size={64} style={{ color: "var(--text-muted)", opacity: 0.8 }} />
        <h2 style={{ color: "var(--text-dark)" }}>Your Wishlist is Empty</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "400px", textAlign: "center" }}>
          You haven't saved any products to your wishlist yet. Explore our products and tap the heart icon to save them here.
        </p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: "12px" }}>
          Explore Shop <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container section animate-fade-in" style={{ padding: "40px 24px" }}>
      <h2 style={{ textAlign: "left", color: "var(--text-dark)", marginBottom: "24px" }}>My Saved Items</h2>

      {/* Grid of wishlisted items */}
      <div className="grid grid-cols-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-card-image-wrapper">
              <img
                src={item.image_url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"}
                alt={item.name}
                className="product-card-image"
              />
              <button
                className="wishlist-toggle active"
                onClick={() => handleRemove(item.id, item.name)}
                aria-label="Remove from wishlist"
                style={{ color: "var(--danger)" }}
              >
                <Heart size={18} fill="currentColor" />
              </button>
            </div>

            <div className="product-card-content" style={{ textAlign: "left" }}>
              <span className="product-card-category">{item.category}</span>
              <Link to={`/product/${item.product_id}`} style={{ color: "inherit" }}>
                <h3 className="product-card-title">{item.name}</h3>
              </Link>

              <div className="product-card-price-row" style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                <span className="product-card-price">${parseFloat(item.price).toFixed(2)}</span>
                
                {/* Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="product-card-add-btn"
                    onClick={() => handleMoveToCart(item)}
                    disabled={item.stock === 0}
                    title="Move to Cart"
                    style={{ padding: "8px 10px" }}
                  >
                    <ShoppingCart size={14} />
                    <span>Move</span>
                  </button>
                  <button
                    className="btn-icon-only"
                    onClick={() => handleRemove(item.id, item.name)}
                    style={{ width: "34px", height: "34px", borderRadius: "var(--radius-sm)", color: "var(--text-muted)" }}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
