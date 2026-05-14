const jwt = require("jsonwebtoken");

function signUser(user) {
  return jwt.sign({ id: user.id, email: user.email, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function signAdmin(admin) {
  return jwt.sign({ id: admin.id, email: admin.email, role: "admin" }, process.env.JWT_ADMIN_SECRET, { expiresIn: "8h" });
}

module.exports = { signUser, signAdmin };
