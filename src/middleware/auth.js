const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, TOKEN_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

// Middleware to check access to the dashboard
const checkDashboardAccess = async (req, res, next) => {
  if (!req.user || !req.user.gamerId) {
    return res.status(401).send("Access Denied");
  }

  // Here, you can implement your custom logic to check if the user has access to the dashboard.
  // For example, you can fetch the gamer from the database and check some criteria.

  try {
    const gamer = await Gamer.findById(req.user.gamerId);

    if (!gamer) return res.status(404).send("Gamer profile not found");

    // You can implement your custom logic here to check access to the dashboard.
    // For example, check if the gamer has the necessary criteria.

    if (!gamer.hasAccessToDashboard) {
      return res.status(403).send("Access to the dashboard is denied.");
    }

    next();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { verifyToken, checkDashboardAccess };