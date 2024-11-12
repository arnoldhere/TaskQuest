const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Bearer
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_AUTH_KEY);

        if (decoded) {
            next();
        } else {
            return res.status(401).json({ message: "Invalid token! Failed to verify" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Authorization failed! Please try again." });
    }
};

module.exports = authMiddleware;
