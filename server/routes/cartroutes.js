const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  clearUserCart,
} = require("../controllers/cartcontroller");
const authMiddleware = require("../middleware/authmiddleware");

// Protect all cart routes with JWT verification
router.use(authMiddleware);

// Get user's cart
router.get("/", getCart);

// Add product to cart
router.post("/", addToCart);

// Update cart item quantity by ID
router.put("/:id", updateCartQuantity);

// Remove item from cart by ID
router.delete("/:id", removeCartItem);

// Clear user's entire cart
router.delete("/", clearUserCart);

module.exports = router;
