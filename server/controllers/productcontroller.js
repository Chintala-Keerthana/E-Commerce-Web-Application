const Product = require("../models/productmodel");

// @desc    Get all products (with search, category filter, and sorting)
// @route   GET /api/products
// @access  Public
const getProducts = (req, res) => {
  const { search, category, sort } = req.query;

  Product.getAllProducts({ search, category, sort }, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Server error fetching products" });
    }
    res.status(200).json(results);
  });
};

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
const getProduct = (req, res) => {
  const productId = req.params.id;

  Product.getProductById(productId, (err, results) => {
    if (err) {
      console.error("Error fetching product details:", err);
      return res.status(500).json({ message: "Server error fetching product details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(results[0]);
  });
};

// @desc    Get all unique product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = (req, res) => {
  Product.getCategories((err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ message: "Server error fetching categories" });
    }
    // Extract category names from SQL results array into a clean array of strings
    const categories = results.map(row => row.category);
    res.status(200).json(categories);
  });
};

// --- ADMIN CRUD HANDLERS ---

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = (req, res) => {
  const { name, description, price, image_url, category, stock } = req.body;

  // Validation
  if (!name || isNaN(parseFloat(price)) || !category) {
    return res.status(400).json({ message: "Please provide product name, valid price, and category" });
  }

  const productData = {
    name,
    description: description || "",
    price: parseFloat(price),
    image_url: image_url || "",
    category,
    stock: parseInt(stock) || 0,
  };

  Product.createProduct(productData, (err, result) => {
    if (err) {
      console.error("Error creating product:", err);
      return res.status(500).json({ message: "Server error creating product" });
    }
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
      ...productData,
    });
  });
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, description, price, image_url, category, stock } = req.body;

  // Validation
  if (!name || isNaN(parseFloat(price)) || !category) {
    return res.status(400).json({ message: "Please provide product name, valid price, and category" });
  }

  const productData = {
    name,
    description: description || "",
    price: parseFloat(price),
    image_url: image_url || "",
    category,
    stock: parseInt(stock) || 0,
  };

  Product.updateProduct(productId, productData, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ message: "Server error updating product" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found to update" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      id: productId,
      ...productData,
    });
  });
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = (req, res) => {
  const productId = req.params.id;

  Product.deleteProduct(productId, (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ message: "Server error deleting product" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found to delete" });
    }

    res.status(200).json({ message: "Product deleted successfully", id: productId });
  });
};

module.exports = {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
