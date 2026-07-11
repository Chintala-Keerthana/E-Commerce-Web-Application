const express = require("express");
const router = express.Router();
const {
  getWishlist,
  toggleWishlist,
  removeWishlistItem,
} = require("../controllers/wishlistcontroller");
const authMiddleware = require("../middleware/authmiddleware");

// Protect all wishlist routes with JWT verification
router.use(authMiddleware);

// Get user's wishlist
router.get("/", getWishlist);

// Toggle wishlist item (add/remove)
router.post("/", toggleWishlist);

// Remove item from wishlist by wishlist item ID
router.delete("/:id", removeWishlistItem);

module.exports = router;
