const db = require("../config/db");

// @desc    Get registered users (excluding password hashes)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = (req, res) => {
  const sql = "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error loading user lists for admin:", err);
      return res.status(500).json({ message: "Server error fetching user list" });
    }
    res.status(200).json(results);
  });
};

// @desc    Get store statistics metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = (req, res) => {
  const revSql = "SELECT SUM(total_price) as revenue FROM orders";
  const orderSql = "SELECT COUNT(*) as orders FROM orders";
  const prodSql = "SELECT COUNT(*) as products FROM products";
  const userSql = "SELECT COUNT(*) as users FROM users";

  db.query(revSql, (err1, r1) => {
    if (err1) return res.status(500).json({ message: "Error fetching revenue metrics" });

    db.query(orderSql, (err2, r2) => {
      if (err2) return res.status(500).json({ message: "Error fetching order metrics" });

      db.query(prodSql, (err3, r3) => {
        if (err3) return res.status(500).json({ message: "Error fetching product metrics" });

        db.query(userSql, (err4, r4) => {
          if (err4) return res.status(500).json({ message: "Error fetching user metrics" });

          res.status(200).json({
            totalRevenue: parseFloat(r1[0].revenue || 0).toFixed(2),
            totalOrders: r2[0].orders || 0,
            totalProducts: r3[0].products || 0,
            totalUsers: r4[0].users || 0,
          });
        });
      });
    });
  });
};

module.exports = {
  getUsers,
  getStats,
};
