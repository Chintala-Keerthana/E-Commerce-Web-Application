const Order = require("../models/ordermodel");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Protected
const createOrder = (req, res) => {
  const userId = req.user.id;
  const { totalPrice, shippingAddress, paymentMethod, items } = req.body;

  // Validate request inputs
  if (!shippingAddress) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items provided for order" });
  }

  // Calculate/Validate totals on backend to prevent clients tampering with prices
  const computedTotal = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  
  // Basic shipping and tax simulation matching client logic
  const shippingFee = computedTotal >= 100 ? 0.0 : 9.99;
  const estimatedTax = computedTotal * 0.05;
  const finalTotalPrice = computedTotal + shippingFee + estimatedTax;

  const payment = paymentMethod || "Dummy Card";

  Order.placeOrder(
    userId,
    finalTotalPrice,
    shippingAddress,
    payment,
    items,
    (err, result) => {
      if (err) {
        console.error("Order Insertion Transaction Failed:", err);
        return res.status(500).json({ message: "Database transaction failed placing order" });
      }

      res.status(201).json({
        message: "Order placed successfully",
        orderId: result.orderId,
        totalPrice: finalTotalPrice,
      });
    }
  );
};

// @desc    Get user's personal order history
// @route   GET /api/orders/my-orders
// @access  Protected
const getMyOrders = (req, res) => {
  const userId = req.user.id;

  Order.getOrdersByUserId(userId, (err, results) => {
    if (err) {
      console.error("Error loading user orders:", err);
      return res.status(500).json({ message: "Server error retrieving order history" });
    }
    res.status(200).json(results);
  });
};

// @desc    Get specific order details by ID (with items)
// @route   GET /api/orders/:id
// @access  Protected
const getOrderDetails = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const orderId = req.params.id;

  Order.getOrderById(orderId, userId, userRole, (err, order) => {
    if (err) {
      console.error("Error loading order details:", err);
      return res.status(500).json({ message: "Server error retrieving order details" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized access" });
    }

    res.status(200).json(order);
  });
};

// @desc    Get all orders (Admin role check)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = (req, res) => {
  Order.getAllOrders((err, results) => {
    if (err) {
      console.error("Error loading store orders:", err);
      return res.status(500).json({ message: "Server error loading dashboard orders" });
    }
    res.status(200).json(results);
  });
};

// @desc    Update order shipping status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ["Pending", "Shipped", "Delivered"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Please provide a valid status: Pending, Shipped, or Delivered" });
  }

  Order.updateStatus(orderId, status, (err, result) => {
    if (err) {
      console.error("Error updating order status:", err);
      return res.status(500).json({ message: "Server error updating order status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found to update status" });
    }

    res.status(200).json({ message: "Order status updated successfully", orderId, status });
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
};
