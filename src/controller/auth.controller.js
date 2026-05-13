const service = require('../services/auth.service');
const ApiResponse = require('../utils/api-response');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await service.login(email, password);
    res.status(200).json(new ApiResponse(200, data, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
