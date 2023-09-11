const jwt = require('jsonwebtoken');

// Middleware to verify JWT tokens
function verifyJWT(req, res, next) {
  // Extract the JWT token from the request cookies
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the JWT token with your secret key
    const decoded = jwt.verify(token, 'your-secret-key');

    // Attach the decoded token data (e.g., gamer's ID) to the request for later use
    req.gamer = decoded;

    // Continue processing the request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}