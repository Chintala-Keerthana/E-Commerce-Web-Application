const express = require("express");
const router = express.Router();
const { getUsers, getStats } = require("../controllers/admincontroller");
const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminmiddleware");

// Protect all admin endpoints with both token validation and role check
router.use(authMiddleware, adminMiddleware);

// Get users list
router.get("/users", getUsers);

// Get metrics stats
router.get("/stats", getStats);

module.exports = router;
