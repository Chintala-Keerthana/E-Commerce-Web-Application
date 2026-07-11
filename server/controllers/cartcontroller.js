const Cart = require("../models/cartmodel");

// @desc    Get user's cart items
// @route   GET /api/cart
// @access  Protected
const getCart = (req, res) => {
  const userId = req.user.id;

  Cart.getCartByUserId(userId, (err, results) => {
    if (err) {
      console.error("Error fetching cart:", err);
      return res.status(500).json({ message: "Server error fetching cart" });
    }
    res.status(200).json(results);
  });
};

// @desc    Add product to cart or increment quantity
// @route   POST /api/cart
// @access  Protected
const addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  const qtyToAdd = parseInt(quantity) || 1;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  // Check if product is already in the cart
  Cart.checkCartItem(userId, productId, (err, results) => {
    if (err) {
      console.error("Error checking cart item:", err);
      return res.status(500).json({ message: "Server error updating cart" });
    }

    if (results.length > 0) {
      // Product exists, update quantity
      const existingItem = results[0];
      const newQty = existingItem.quantity + qtyToAdd;

      Cart.updateCartItem(userId, productId, newQty, (updateErr) => {
        if (updateErr) {
          console.error("Error updating cart quantity:", updateErr);
          return res.status(500).json({ message: "Server error updating cart quantity" });
        }
        res.status(200).json({ message: "Cart item quantity updated", productId, quantity: newQty });
      });
    } else {
      // Product doesn't exist in cart, add new record
      Cart.addCartItem(userId, productId, qtyToAdd, (addErr, addResult) => {
        if (addErr) {
          console.error("Error adding cart item:", addErr);
          return res.status(500).json({ message: "Server error adding item to cart" });
        }
        res.status(201).json({
          message: "Product added to cart",
          cartItemId: addResult.insertId,
          productId,
          quantity: qtyToAdd,
        });
      });
    }
  });
};

// @desc    Update quantity of cart item by cart item ID
// @route   PUT /api/cart/:id
// @access  Protected
const updateCartQuantity = (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;
  const newQty = parseInt(quantity);

  if (isNaN(newQty) || newQty <= 0) {
    return res.status(400).json({ message: "Quantity must be a valid positive number" });
  }

  Cart.updateQuantityById(cartItemId, userId, newQty, (err, result) => {
    if (err) {
      console.error("Error updating cart quantity:", err);
      return res.status(500).json({ message: "Server error updating quantity" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    res.status(200).json({ message: "Cart quantity updated successfully" });
  });
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:id
// @access  Protected
const removeCartItem = (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  Cart.removeCartItem(cartItemId, userId, (err, result) => {
    if (err) {
      console.error("Error removing cart item:", err);
      return res.status(500).json({ message: "Server error removing item from cart" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item removed from cart successfully" });
  });
};

// @desc    Clear all items in cart
// @route   DELETE /api/cart
// @access  Protected
const clearUserCart = (req, res) => {
  const userId = req.user.id;

  Cart.clearCart(userId, (err) => {
    if (err) {
      console.error("Error clearing cart:", err);
      return res.status(500).json({ message: "Server error clearing cart" });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  clearUserCart,
};
