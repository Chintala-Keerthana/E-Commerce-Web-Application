import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div style={{ textAlign: "left" }}>
            <h1 className="hero-title">
              Discover the Art of <span>Premium Shopping</span>
            </h1>
            <p className="hero-subtitle">
              Shop the latest trends in electronics, fashion, and accessories. High-quality products selected just for you with express global delivery.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link to="/shop" className="btn btn-primary">
                Shop Collection <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn btn-outline">
                Learn More
              </a>
            </div>
          </div>
          <div className="flex-center" style={{ position: "relative" }}>
            {/* Elegant placeholder badge or design element */}
            <div
              className="hero-image-float"
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary-light-bg), var(--border-color))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-lg)",
                border: "2px solid var(--border-color)",
              }}
            >
              <ShoppingBag size={120} style={{ color: "var(--primary)", opacity: 0.8 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section container" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "48px" }}>
        <div className="grid grid-cols-3" style={{ gap: "32px" }}>
          <div className="category-card" style={{ cursor: "default" }}>
            <div className="flex-center category-card-icon">
              <Truck size={36} />
            </div>
            <h3 className="category-card-title" style={{ margin: "12px 0 8px" }}>Free Shipping</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>On all orders above $50. Tracked shipping worldwide.</p>
          </div>

          <div className="category-card" style={{ cursor: "default" }}>
            <div className="flex-center category-card-icon">
              <ShieldCheck size={36} />
            </div>
            <h3 className="category-card-title" style={{ margin: "12px 0 8px" }}>Secure Payment</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>100% secure payment methods and encrypted transactions.</p>
          </div>

          <div className="category-card" style={{ cursor: "default" }}>
            <div className="flex-center category-card-icon">
              <RotateCcw size={36} />
            </div>
            <h3 className="category-card-title" style={{ margin: "12px 0 8px" }}>Easy Returns</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Hassle-free 30-day return policy. Shop with confidence.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
