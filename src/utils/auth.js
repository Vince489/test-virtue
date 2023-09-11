const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET; // Define your secret key
  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "1h", // Set the token expiration time
  });
  return token;
};

module.exports = generateToken;
