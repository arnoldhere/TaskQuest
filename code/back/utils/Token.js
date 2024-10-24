require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, `${process.env.JWT_AUTH_KEY}`, {
    expiresIn: '24h',
  });
}

module.exports = generateToken;
