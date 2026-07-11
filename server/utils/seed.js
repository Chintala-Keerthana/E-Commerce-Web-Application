const mysql = require("mysql2/promise");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const products = [
  // 💻 Electronics
  {
    name: "Quantum Ultra Laptop",
    description: "High-performance laptop featuring a brilliant 15-inch display, 16GB unified memory, and 512GB SSD storage for seamless multitasking and productivity.",
    price: 1299.99,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Nova X Pro Smartphone",
    description: "Experience the future with the Nova X Pro. Dynamic OLED display, advanced triple lens camera system, and ultra-fast 5G connectivity.",
    price: 799.99,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    stock: 30,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, high-resolution audio, and up to 30 hours of continuous playback.",
    price: 249.99,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your workouts, heart rate, sleep quality, and receive instant notifications on a sleek always-on AMOLED touch display.",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    stock: 35,
  },
  {
    name: "Ultra HD 4K Monitor",
    description: "Immersive 27-inch 4K UHD display with thin bezels, rich color accuracy, and multiple input ports for creators and gamers alike.",
    price: 399.99,
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    stock: 15,
  },

  // 🏠 Home & Living
  {
    name: "Precision Drip Coffee Maker",
    description: "Barista-grade drip coffee maker featuring advanced temperature control, custom strength selections, and a double-wall thermal carafe.",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    category: "Home & Living",
    stock: 20,
  },
  {
    name: "Smart Air Fryer",
    description: "Cook healthy, crispy meals with 85% less oil. Touchscreen control presets, large 5.8-quart capacity, and dishwasher-safe components.",
    price: 119.99,
    image_url: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80",
    category: "Home & Living",
    stock: 18,
  },
  {
    name: "Robot Vacuum Cleaner",
    description: "Smart robotic vacuum with laser navigation, strong suction, self-charging dock, and full companion app scheduling controls.",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    category: "Home & Living",
    stock: 12,
  },
  {
    name: "LED Study Desk Lamp",
    description: "Eye-caring LED desk lamp featuring adjustable brightness levels, multiple color modes, integrated timer, and a USB charging output.",
    price: 34.99,
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    category: "Home & Living",
    stock: 50,
  },
  {
    name: "Premium Blender",
    description: "Commercial-grade high-speed blender with variable speed controls, hardened steel blades, and a large BPA-free blending container.",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=600&q=80",
    category: "Home & Living",
    stock: 22,
  },

  // 👕 Fashion
  {
    name: "Classic Cotton Hoodie",
    description: "Cozy premium organic cotton hoodie featuring a brushed fleece lining, kangaroo pouch pocket, and an adjustable drawstring hood.",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 60,
  },
  {
    name: "Running Sports Shoes",
    description: "Lightweight running sneakers built with responsive cushioning midsoles and breathable mesh mesh uppers for elite athletics.",
    price: 110.00,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 35,
  },
  {
    name: "Leather Travel Backpack",
    description: "Handcrafted top-grain leather backpack with a dedicated padded laptop compartment, internal organizers, and heavy-duty steel zippers.",
    price: 129.99,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 28,
  },
  {
    name: "Polarized Sunglasses",
    description: "Classic style polarized sunglasses offering 100% UV protection, anti-glare lenses, and a lightweight durable frames casing.",
    price: 79.99,
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 45,
  },
  {
    name: "Stainless Steel Wrist Watch",
    description: "Elegant analog watch crafted with a stainless steel link band, sapphire scratch-resistant crystal glass, and Japanese quartz movement.",
    price: 189.99,
    image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 25,
  },

  // 📚 Books
  {
    name: "Atomic Habits",
    description: "The legendary self-improvement guide by James Clear. Learn how small changes can lead to remarkable personal development achievements.",
    price: 16.99,
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    category: "Books",
    stock: 100,
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship by Robert C. Martin. Master standard practices to write cleaner, more maintainable code.",
    price: 34.99,
    image_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    category: "Books",
    stock: 80,
  },

  // 🎮 Gaming
  {
    name: "Mechanical Gaming Keyboard",
    description: "Tactile mechanical keyboard featuring custom linear red switches, dynamic full RGB backlighting presets, and anti-ghosting keys.",
    price: 99.99,
    image_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    category: "Gaming",
    stock: 30,
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Ultra-lightweight wireless mouse with high-precision DPI tracking sensor, long-lasting battery lifecycle, and low latency signals.",
    price: 59.99,
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
    category: "Gaming",
    stock: 40,
  },
  {
    name: "Gaming Controller",
    description: "Ergonomic layout wireless gamepad controller featuring custom haptic feedback vibration motors, tactile triggers, and bluetooth.",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80",
    category: "Gaming",
    stock: 50,
  },
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Keerthi@123",
    database: process.env.DB_NAME || "ecommerce_db",
  });

  console.log("🔌 Connected to database for seeding...");

  // Disable checks to allow clean deletes
  await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
  await connection.query("DELETE FROM products");
  await connection.query("ALTER TABLE products AUTO_INCREMENT = 1");
  await connection.query("DELETE FROM users");
  await connection.query("ALTER TABLE users AUTO_INCREMENT = 1");
  await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
  console.log("🧹 Cleared existing products and users tables.");

  const sql = "INSERT INTO products (name, description, price, image_url, category, stock) VALUES (?, ?, ?, ?, ?, ?)";
  for (const product of products) {
    await connection.query(sql, [
      product.name,
      product.description,
      product.price,
      product.image_url,
      product.category,
      product.stock,
    ]);
    console.log(`✨ Seeded: ${product.name}`);
  }

  // Seed default admin user
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
  await connection.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    ["Admin User", "admin@thiranshop.com", adminPasswordHash, "admin"]
  );
  console.log("👤 Seeded Admin User (admin@thiranshop.com / adminpassword123)");

  console.log("🎉 Seeding completed successfully!");
  await connection.end();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
