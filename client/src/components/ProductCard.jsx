import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";

const ProductCard = ({ product, isWishlisted, onWishlistToggle, onAddToCart }) => {
  const { id, name, description, price, image_url, category, stock } = product;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) onWishlistToggle(id);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div className="product-card animate-fade-in">
      <Link to={`/product/${id}`} style={{ display: "block", color: "inherit" }}>
        <div className="product-card-image-wrapper">
          <img
            src={image_url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"}
            alt={name}
            className="product-card-image"
            loading="lazy"
          />
          <button
            className={`wishlist-toggle ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="product-card-content">
          <span className="product-card-category">{category}</span>
          <h3 className="product-card-title">{name}</h3>

          {/* Star rating (premium mockup) */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < 4 ? "#f59e0b" : "none"}
                stroke={i < 4 ? "#f59e0b" : "var(--text-muted)"}
              />
            ))}
            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "4px" }}>(4.0)</span>
          </div>

          <div className="product-card-price-row">
            <span className="product-card-price">${parseFloat(price).toFixed(2)}</span>
            <button
              className="product-card-add-btn"
              onClick={handleAddToCartClick}
              disabled={stock === 0}
            >
              <ShoppingCart size={15} />
              <span>{stock === 0 ? "Out of Stock" : "Add"}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
