const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = (req, res) => {
  const { username, email, password, role } = req.body;

  // Validate inputs
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide username, email, and password" });
  }

  // Check if user already exists
  User.findUserByEmail(email, (err, results) => {
    if (err) {
      console.error("Database error during registration check:", err);
      return res.status(500).json({ message: "Server error during registration" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash the password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Bcrypt hashing error:", hashErr);
        return res.status(500).json({ message: "Server error creating user" });
      }

      // Default role is 'customer'
      const userRole = role || "customer";

      // Save user to database
      User.createUser(username, email, hashedPassword, userRole, (createErr, createResult) => {
        if (createErr) {
          console.error("Database error during user insertion:", createErr);
          return res.status(500).json({ message: "Server error during user creation" });
        }

        const userId = createResult.insertId;

        // Generate JWT token
        const token = jwt.sign(
          { id: userId, email, role: userRole },
          process.env.JWT_SECRET || "mysecretkey123",
          { expiresIn: "24h" }
        );

        res.status(201).json({
          message: "User registered successfully",
          token,
          user: {
            id: userId,
            username,
            email,
            role: userRole,
          },
        });
      });
    });
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  // Find user by email
  User.findUserByEmail(email, (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: "Server error during login" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Check password
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error("Bcrypt comparison error:", compareErr);
        return res.status(500).json({ message: "Server error during password validation" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "mysecretkey123",
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
};

module.exports = {
  register,
  login,
};
