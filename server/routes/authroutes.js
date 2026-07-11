const express = require("express");
const router = express.Router();
const { register, login, forgotPassword } = require("../controllers/authcontroller");

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

// Route for forgot password
router.post("/forgot-password", forgotPassword);

module.exports = router;
