const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authroutes");
const productRoutes = require("./routes/productroutes");
const cartRoutes = require("./routes/cartroutes");
const wishlistRoutes = require("./routes/wishlistroutes");
const orderRoutes = require("./routes/orderroutes");
const adminRoutes = require("./routes/adminroutes");
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("🚀 E-Commerce API is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});