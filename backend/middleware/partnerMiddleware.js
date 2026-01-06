/**
 * Partner Authorization Middleware
 * Restricts access to routes that require partner role
 * 
 * Usage: Add after auth middleware
 * router.post('/route', auth, partnerMiddleware, handler);
 */
module.exports = function (req, res, next) {
  // Check if user is authenticated and has partner role
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "partner") {
    return res.status(403).json({ 
      message: "Access denied. Partners only." 
    });
  }

  next();
};

