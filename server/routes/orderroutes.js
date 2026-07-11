const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/ordercontroller");
const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminmiddleware");

// Require login for all order routes
router.use(authMiddleware);

// Customer endpoints
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderDetails);
router.post("/", createOrder);

// Admin-only endpoints
router.get("/", adminMiddleware, getAllOrders);
router.put("/:id/status", adminMiddleware, updateOrderStatus);

module.exports = router;
