const pool = require("../config/db");

// Place a new order using a SQL Transaction (Atomic operation)
const placeOrder = (userId, totalPrice, shippingAddress, paymentMethod, items, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Transaction Connection Error:", err);
      return callback(err);
    }

    connection.beginTransaction((txErr) => {
      if (txErr) {
        connection.release();
        return callback(txErr);
      }

      // 1. Insert order record
      const orderSql = `
        INSERT INTO orders (user_id, total_price, shipping_address, payment_method)
        VALUES (?, ?, ?, ?)
      `;
      connection.query(
        orderSql,
        [userId, totalPrice, shippingAddress, paymentMethod],
        (orderErr, orderResult) => {
          if (orderErr) {
            return connection.rollback(() => {
              connection.release();
              callback(orderErr);
            });
          }

          const orderId = orderResult.insertId;

          // 2. Insert order items and deduct stock levels
          const itemSql = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
          `;
          const stockSql = "UPDATE products SET stock = stock - ? WHERE id = ?";

          const insertItemsAndDeductStock = (index) => {
            if (index === items.length) {
              // 3. Clear user's cart on success
              connection.query(
                "DELETE FROM cart_items WHERE user_id = ?",
                [userId],
                (cartErr) => {
                  if (cartErr) {
                    return connection.rollback(() => {
                      connection.release();
                      callback(cartErr);
                    });
                  }

                  // Commit the transaction
                  connection.commit((commitErr) => {
                    if (commitErr) {
                      return connection.rollback(() => {
                        connection.release();
                        callback(commitErr);
                      });
                    }
                    connection.release();
                    callback(null, { orderId });
                  });
                }
              );
              return;
            }

            const item = items[index];

            connection.query(
              itemSql,
              [orderId, item.product_id, item.quantity, parseFloat(item.price)],
              (itemErr) => {
                if (itemErr) {
                  return connection.rollback(() => {
                    connection.release();
                    callback(itemErr);
                  });
                }

                // Update product stock
                connection.query(
                  stockSql,
                  [item.quantity, item.product_id],
                  (stockErr) => {
                    if (stockErr) {
                      return connection.rollback(() => {
                        connection.release();
                        callback(stockErr);
                      });
                    }
                    insertItemsAndDeductStock(index + 1);
                  }
                );
              }
            );
          };

          insertItemsAndDeductStock(0);
        }
      );
    });
  });
};

// Retrieve orders list for a specific user
const getOrdersByUserId = (userId, callback) => {
  const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
  pool.query(sql, [userId], callback);
};

// Retrieve full details of an order (checks ownership unless user is admin)
const getOrderById = (orderId, userId, userRole, callback) => {
  let sql = "SELECT * FROM orders WHERE id = ?";
  const params = [orderId];

  // Restrict access for non-admin users to their own orders
  if (userRole !== "admin") {
    sql += " AND user_id = ?";
    params.push(userId);
  }

  pool.query(sql, params, (err, orderResults) => {
    if (err) return callback(err);
    if (orderResults.length === 0) return callback(null, null);

    const order = orderResults[0];

    // Load order items associated with this order
    const itemsSql = `
      SELECT oi.*, p.name, p.image_url, p.category
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    pool.query(itemsSql, [orderId], (itemsErr, itemsResults) => {
      if (itemsErr) return callback(itemsErr);
      order.items = itemsResults;
      callback(null, order);
    });
  });
};

// Retrieve all orders (Admin operation)
const getAllOrders = (callback) => {
  const sql = `
    SELECT o.*, u.username, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  pool.query(sql, [], callback);
};

// Update order status (Admin operation)
const updateStatus = (orderId, status, callback) => {
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  pool.query(sql, [status, orderId], callback);
};

module.exports = {
  placeOrder,
  getOrdersByUserId,
  getOrderById,
  getAllOrders,
  updateStatus,
};
