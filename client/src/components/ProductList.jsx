import React from "react";
import ProductCard from "./ProductCard";
import { EyeOff } from "lucide-react";

const ProductList = ({
  products,
  loading,
  error,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onClearFilters,
  activeSearch,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="product-card skeleton-card">
            <div className="product-card-image-wrapper skeleton-shimmer"></div>
            <div className="product-card-content">
              <div className="skeleton-line skeleton-category skeleton-shimmer"></div>
              <div className="skeleton-line skeleton-title skeleton-shimmer"></div>
              <div className="skeleton-line skeleton-title skeleton-shimmer" style={{ width: "60%" }}></div>
              <div className="product-card-price-row">
                <div className="skeleton-line skeleton-price skeleton-shimmer"></div>
                <div className="skeleton-button skeleton-shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ marginTop: "20px" }}>
        <span>{error}</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-center" style={{ flexDirection: "column", minHeight: "350px", gap: "16px" }}>
        <EyeOff size={48} style={{ color: "var(--text-muted)" }} />
        <h3 style={{ color: "var(--text-dark)" }}>No Products Found</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Try modifying your search or choosing a different category.
        </p>
        {onClearFilters && (
          <button
            className="btn btn-outline"
            onClick={onClearFilters}
            style={{ marginTop: "8px" }}
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={isWishlisted ? isWishlisted(product.id) : false}
          onWishlistToggle={onWishlistToggle}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
