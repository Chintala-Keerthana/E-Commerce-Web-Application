import React from "react";
import { SlidersHorizontal } from "lucide-react";

const FilterComponent = ({ categories, activeCategory, onCategorySelect }) => {
  return (
    <aside style={{ textAlign: "left" }}>
      <h3 className="sidebar-title flex-between">
        <span>Categories</span>
        <SlidersHorizontal size={16} style={{ color: "var(--text-muted)" }} />
      </h3>
      <ul className="sidebar-list">
        {categories.map((cat) => (
          <li
            key={cat}
            className={`sidebar-item ${activeCategory === cat ? "active" : ""}`}
            onClick={() => onCategorySelect(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default FilterComponent;
