const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token is missing' });
    }
    jwt.verify(token, JWT_SECRET, (err,decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    next();
    });
  };

  module.exports = { verifyToken };