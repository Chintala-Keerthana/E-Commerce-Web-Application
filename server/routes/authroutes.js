const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authcontroller");

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

module.exports = router;
