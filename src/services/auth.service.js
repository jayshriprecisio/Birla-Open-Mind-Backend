const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const repository = require('../repository/auth.repository');
const ApiError = require('../utils/api-error');
const { sendPasswordResetEmail } = require('../utils/email');

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

const forgotPassword = async (email) => {
  const user = await repository.findUserByEmail(email);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const token = crypto.randomBytes(32).toString('hex');
  await repository.createPasswordResetToken(user.id, token);
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:4028'}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetLink);
  return { message: 'Password reset link sent to your email' };
};

const resetPassword = async (token, newPassword) => {
  const resetToken = await repository.findPasswordResetToken(token);
  if (!resetToken || resetToken.expires_at < new Date()) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await repository.updateUserPassword(resetToken.user_id, hashedPassword);
  await repository.deletePasswordResetToken(token);

  return { message: 'Password reset successful' };
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};
