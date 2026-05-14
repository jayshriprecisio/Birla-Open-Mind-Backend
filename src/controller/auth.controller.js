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

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await service.forgotPassword(email);
    res.status(200).json(new ApiResponse(200, null, result.message));
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await service.resetPassword(token, password);
    res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  forgotPassword,
  resetPassword,
};
