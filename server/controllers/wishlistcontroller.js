const Wishlist = require("../models/wishlistmodel");

// @desc    Get user's wishlist items
// @route   GET /api/wishlist
// @access  Protected
const getWishlist = (req, res) => {
  const userId = req.user.id;

  Wishlist.getWishlistByUserId(userId, (err, results) => {
    if (err) {
      console.error("Error fetching wishlist:", err);
      return res.status(500).json({ message: "Server error fetching wishlist" });
    }
    res.status(200).json(results);
  });
};

// @desc    Toggle wishlist item (add if not present, remove if present)
// @route   POST /api/wishlist
// @access  Protected
const toggleWishlist = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  // Check if item is already in wishlist
  Wishlist.checkWishlistItem(userId, productId, (err, results) => {
    if (err) {
      console.error("Error checking wishlist item:", err);
      return res.status(500).json({ message: "Server error checking wishlist" });
    }

    if (results.length > 0) {
      // Already in wishlist, remove it
      Wishlist.removeWishlistItem(userId, productId, (removeErr) => {
        if (removeErr) {
          console.error("Error removing from wishlist:", removeErr);
          return res.status(500).json({ message: "Server error updating wishlist" });
        }
        res.status(200).json({ message: "Product removed from wishlist", isWishlisted: false });
      });
    } else {
      // Not in wishlist, add it
      Wishlist.addWishlistItem(userId, productId, (addErr) => {
        if (addErr) {
          console.error("Error adding to wishlist:", addErr);
          return res.status(500).json({ message: "Server error saving to wishlist" });
        }
        res.status(201).json({ message: "Product added to wishlist", isWishlisted: true });
      });
    }
  });
};

// @desc    Remove an item from wishlist by wishlist item ID
// @route   DELETE /api/wishlist/:id
// @access  Protected
const removeWishlistItem = (req, res) => {
  const userId = req.user.id;
  const wishlistId = req.params.id;

  Wishlist.removeWishlistById(wishlistId, userId, (err, result) => {
    if (err) {
      console.error("Error removing wishlist item:", err);
      return res.status(500).json({ message: "Server error removing item from wishlist" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Wishlist item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item removed from wishlist successfully" });
  });
};

module.exports = {
  getWishlist,
  toggleWishlist,
  removeWishlistItem,
};
