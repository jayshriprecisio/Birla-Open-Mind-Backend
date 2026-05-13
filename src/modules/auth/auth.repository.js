const { User } = require('../../models');

const findUserByEmail = async (email) => {
  return User.findOne({ where: { email, is_active: true } });
};

const findUserById = async (id) => {
  return User.findByPk(id);
};

const createUser = async (userData) => {
  return User.create(userData);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
