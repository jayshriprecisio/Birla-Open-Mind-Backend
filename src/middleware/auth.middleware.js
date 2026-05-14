const jwt = require('jsonwebtoken');
const ApiError = require('../utils/api-error');

const auth = (req, res, next) => {
  try {
    let token = '';
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.cookie) {
      // Manual fallback if cookie-parser is not active
      const cookies = req.headers.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        acc[k] = v;
        return acc;
      }, {});
      token = cookies.token;
    }

    if (!token) {
      throw new ApiError(401, 'Please authenticate');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Please authenticate'));
  }
};

module.exports = auth;
