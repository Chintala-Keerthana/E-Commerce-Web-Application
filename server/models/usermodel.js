const db = require("../config/db");

const createUser = (username, email, password, role, callback) => {
  const sql =
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [username, email, password, role], callback);
};

const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
};