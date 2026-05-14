const ApiError = require('../utils/api-error');

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message: err.name === 'SequelizeDatabaseError' ? `DB Error: ${err.message}` : message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      sql: err.sql 
    }),
  };

  if (err.name === 'SequelizeDatabaseError') {
    console.error('Sequelize Database Error:', err.message);
    console.error('SQL:', err.sql);
  }
  
  res.status(statusCode || 500).send(response);
};

module.exports = { errorMiddleware };
