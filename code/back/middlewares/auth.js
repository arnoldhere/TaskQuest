require("dotenv").config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_AUTH_KEY);
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authorization failed ! Try again ...." })
    }
};

module.exports = authMiddleware;
