const { User, PasswordReset } = require('../models');

const findUserByEmail = async (email) => {
  return User.findOne({ where: { email, is_active: true } });
};

const findUserById = async (id) => {
  return User.findByPk(id);
};

const createUser = async (userData) => {
  return User.create(userData);
};

const createPasswordResetToken = async (userId, token) => {
  await PasswordReset.destroy({ where: { user_id: userId } });
  return PasswordReset.create({
    user_id: userId,
    token: token,
    expires_at: new Date(Date.now() + 3600000),
  });
};

const findPasswordResetToken = async (token) => {
  return PasswordReset.findOne({ where: { token } });
};

const updateUserPassword = async (userId, hashedPassword) => {
  return User.update({ password: hashedPassword }, { where: { id: userId } });
};

const deletePasswordResetToken = async (token) => {
  return PasswordReset.destroy({ where: { token } });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  createPasswordResetToken,
  findPasswordResetToken,
  updateUserPassword,
  deletePasswordResetToken,
};
