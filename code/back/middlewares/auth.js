require("dotenv").config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_AUTH_KEY);
        // console.log(decoded)
        // req.user = { id: decoded.id, email: decoded.email };
        if (decoded) {
            next();
        } else {
            return res.status(401).json({ message: "Invalid token ! failed to verify" })
        }
    } catch (error) {
        return res.status(401).json({ message: "Authorization failed ! Try again ...." })
    }
};

module.exports = authMiddleware;
