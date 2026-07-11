import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, onSubmit, placeholder = "Search products..." }) => {
  return (
    <form className="nav-search" onSubmit={onSubmit}>
      <Search size={18} className="nav-search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        className="nav-search-input"
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

export default SearchBar;
