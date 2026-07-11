const db = require("../config/db");

// Get wishlist items with product details for a user
const getWishlistByUserId = (userId, callback) => {
  const sql = `
    SELECT w.id, w.product_id, p.name, p.price, p.image_url, p.category, p.stock
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Check if item is already in user's wishlist
const checkWishlistItem = (userId, productId, callback) => {
  db.query(
    "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
    [userId, productId],
    callback
  );
};

// Add item to wishlist
const addWishlistItem = (userId, productId, callback) => {
  db.query(
    "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
    [userId, productId],
    callback
  );
};

// Remove item from wishlist by product_id (toggle off)
const removeWishlistItem = (userId, productId, callback) => {
  db.query(
    "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
    [userId, productId],
    callback
  );
};

// Remove item from wishlist by wishlist item ID (verifying user ownership)
const removeWishlistById = (wishlistId, userId, callback) => {
  db.query(
    "DELETE FROM wishlist WHERE id = ? AND user_id = ?",
    [wishlistId, userId],
    callback
  );
};

module.exports = {
  getWishlistByUserId,
  checkWishlistItem,
  addWishlistItem,
  removeWishlistItem,
  removeWishlistById,
};
