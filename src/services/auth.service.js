const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('../repository/auth.repository');
const ApiError = require('../utils/api-error');

const login = async (email, password) => {
  const user = await repository.findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = {
  login,
};
