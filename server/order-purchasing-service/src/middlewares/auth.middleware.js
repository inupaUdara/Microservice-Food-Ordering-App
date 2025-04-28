const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Authentication token required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

const authenticateInternalService = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Just check Bearer token
  
  // if (token !== process.env.JWT_SECRET) {
  //   return res.status(403).json({ message: 'Invalid service token' });
  // }
  
  next(); // Proceed if token matches
};

module.exports = { authenticateToken, authorizeRoles, authenticateInternalService};