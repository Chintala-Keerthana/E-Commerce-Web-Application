const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Access Denied: Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admin role required" });
  }

  next();
};

module.exports = adminMiddleware;
