const db = require("../config/db");

// Get all products with dynamic search, filter, and sorting
const getAllProducts = (filters, callback) => {
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  // Search filter
  if (filters.search) {
    sql += " AND (name LIKE ? OR description LIKE ?)";
    const searchParam = `%${filters.search}%`;
    params.push(searchParam, searchParam);
  }

  // Category filter
  if (filters.category && filters.category !== "All") {
    sql += " AND category = ?";
    params.push(filters.category);
  }

  // Sorting
  if (filters.sort) {
    if (filters.sort === "price_asc") {
      sql += " ORDER BY price ASC";
    } else if (filters.sort === "price_desc") {
      sql += " ORDER BY price DESC";
    } else if (filters.sort === "newest") {
      sql += " ORDER BY created_at DESC";
    } else {
      sql += " ORDER BY id ASC";
    }
  } else {
    sql += " ORDER BY id ASC";
  }

  db.query(sql, params, callback);
};

// Get a single product by ID
const getProductById = (id, callback) => {
  db.query("SELECT * FROM products WHERE id = ?", [id], callback);
};

// Get unique categories list
const getCategories = (callback) => {
  db.query("SELECT DISTINCT category FROM products", callback);
};

// --- ADMIN CRUD OPERATIONS ---

// Create a new product
const createProduct = (productData, callback) => {
  const { name, description, price, image_url, category, stock } = productData;
  const sql = `
    INSERT INTO products (name, description, price, image_url, category, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [name, description, parseFloat(price), image_url, category, parseInt(stock) || 0],
    callback
  );
};

// Update an existing product
const updateProduct = (id, productData, callback) => {
  const { name, description, price, image_url, category, stock } = productData;
  const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, image_url = ?, category = ?, stock = ?
    WHERE id = ?
  `;
  db.query(
    sql,
    [name, description, parseFloat(price), image_url, category, parseInt(stock) || 0, id],
    callback
  );
};

// Delete a product
const deleteProduct = (id, callback) => {
  db.query("DELETE FROM products WHERE id = ?", [id], callback);
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
