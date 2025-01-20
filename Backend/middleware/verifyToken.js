const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ;

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to authenticate token.' });
    }
   
    req.user = decoded.id;
    next();
  });
};

module.exports = verifyToken;
