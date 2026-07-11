const db = require("../config/db");

// Get cart items with product details for a user
const getCartByUserId = (userId, callback) => {
  const sql = `
    SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url, p.category, p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Check if item already exists in cart for a user
const checkCartItem = (userId, productId, callback) => {
  db.query(
    "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId],
    callback
  );
};

// Add new item to cart
const addCartItem = (userId, productId, quantity, callback) => {
  db.query(
    "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [userId, productId, quantity],
    callback
  );
};

// Update quantity of an item already in the cart (by user_id and product_id)
const updateCartItem = (userId, productId, quantity, callback) => {
  db.query(
    "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
    [quantity, userId, productId],
    callback
  );
};

// Update quantity of an item by cart item ID (verifying user ownership)
const updateQuantityById = (cartItemId, userId, quantity, callback) => {
  db.query(
    "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
    [quantity, cartItemId, userId],
    callback
  );
};

// Remove item from cart (verifying user ownership)
const removeCartItem = (cartItemId, userId, callback) => {
  db.query(
    "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
    [cartItemId, userId],
    callback
  );
};

// Clear all cart items for a user
const clearCart = (userId, callback) => {
  db.query("DELETE FROM cart_items WHERE user_id = ?", [userId], callback);
};

module.exports = {
  getCartByUserId,
  checkCartItem,
  addCartItem,
  updateCartItem,
  updateQuantityById,
  removeCartItem,
  clearCart,
};
