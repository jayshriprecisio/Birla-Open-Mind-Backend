const jwt = require('jsonwebtoken');
const ApiError = require('../utils/api-error');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Please authenticate');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Please authenticate'));
  }
};

module.exports = auth;
