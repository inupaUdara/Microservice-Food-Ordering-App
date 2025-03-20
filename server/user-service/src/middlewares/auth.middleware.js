const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { JWT_SECRET } = require("../config/env.js");

const verifyToken = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "You need to login first." });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "No valid user found." });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token", error: error.message });
    }
};


const isCustomer = (req, res, next) => {
    if (req.user && req.user.role === "customer") {
        return next();
    }

    return res.status(403).json({ message: "You do not have permission to access this resource." });
};


const isRestaurant = (req, res, next) => {
    if (req.user && req.user.role === "restaurant") {
        return next();
    }

    return res.status(403).json({ message: "Only restaurant has permission to access this resource." });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({ message: "Only admin has permission to access this resource." });
};

module.exports = { verifyToken, isCustomer, isRestaurant, isAdmin };