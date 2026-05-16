const ApiError = require('../utils/api-error');

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  // Handle Sequelize errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = `Duplicate Entry: ${err.errors.map(e => e.message).join(', ')}`;
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    const fieldInfo = err.fields ? `in field ${err.fields.join(', ')}` : `(Constraint: ${err.index})`;
    message = `Foreign Key Error: Invalid reference ${fieldInfo}`;
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = `Validation Error: ${err.errors.map(e => e.message).join(', ')}`;
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = `Database Error: ${err.message}`;
  } else if (!err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    code: statusCode || 500,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      sql: err.sql,
      originalError: err.original?.message
    }),
  };

  if (err.name && err.name.startsWith('Sequelize')) {
    console.error(`Sequelize Error (${err.name}):`, err.message);
    if (err.sql) console.error('SQL:', err.sql);
    if (err.errors) console.error('Details:', err.errors);
  } else if (statusCode === 500) {
    console.error('Unhandled Error:', err);
  }
  
  res.status(statusCode || 500).send(response);
};

module.exports = { errorMiddleware };
