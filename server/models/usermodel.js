const db = require("../config/db");

const createUser = (username, email, password, role, callback) => {
  const sql =
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [username, email, password, role], callback);
};

const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

const updatePassword = (email, hashedPassword, callback) => {
  const sql = "UPDATE users SET password = ? WHERE email = ?";
  db.query(sql, [hashedPassword, email], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  updatePassword,
};