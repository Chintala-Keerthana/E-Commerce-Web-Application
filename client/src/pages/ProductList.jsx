import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import FilterComponent from "../components/FilterComponent";
import ProductListGrid from "../components/ProductList";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

const ProductList = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params
  const activeCategory = searchParams.get("category") || "All";
  const activeSearch = searchParams.get("search") || "";
  const activeSort = searchParams.get("sort") || "default";

  // Fetch unique categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories");
        setCategories(["All", ...res.data]);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when search parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory && activeCategory !== "All") {
          queryParams.append("category", activeCategory);
        }
        if (activeSearch) {
          queryParams.append("search", activeSearch);
        }
        if (activeSort) {
          queryParams.append("sort", activeSort);
        }

        const res = await api.get(`/products?${queryParams.toString()}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeSearch, activeSort]);

  // Update URL params helpers
  const handleCategorySelect = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("category", category);
    // Reset page or search if wanted, but keeping search filter is nice
    setSearchParams(nextParams);
  };

  const handleSortChange = (e) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sort", e.target.value);
    setSearchParams(nextParams);
  };

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleWishlistToggle = async (id) => {
    const res = await toggleWishlist(id);
    if (!res.success && res.message) {
      addToast(res.message, "error");
    } else {
      const prod = products.find((p) => p.id === id);
      const prodName = prod ? prod.name : "Product";
      addToast(res.isWishlisted ? `Saved ${prodName} to wishlist!` : `Removed ${prodName} from wishlist!`, "success");
    }
  };

  const handleAddToCart = async (product) => {
    const res = await addToCart(product.id, 1);
    if (!res.success && res.message) {
      addToast(res.message, "error");
    } else {
      addToast(`Added ${product.name} to cart!`, "success");
    }
  };

  return (
    <div className="container section animate-fade-in">
      <div className="shop-layout">
        {/* Sidebar Filters */}
        <FilterComponent
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Main Content Area */}
        <div>
          <div className="shop-controls">
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Showing {products.length} {products.length === 1 ? "product" : "products"}
              {activeSearch && ` for "${activeSearch}"`}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="sort-by" style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Sort by:
              </label>
              <select
                id="sort-by"
                className="sort-select"
                value={activeSort}
                onChange={handleSortChange}
              >
                <option value="default">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          <ProductListGrid
            products={products}
            loading={loading}
            error={error}
            isWishlisted={isWishlisted}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            onClearFilters={() => setSearchParams({})}
            activeSearch={activeSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
