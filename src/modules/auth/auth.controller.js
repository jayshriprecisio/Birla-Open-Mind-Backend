const authService = require('./auth.service');
const ApiResponse = require('../../utils/api-response');

const loginController = async (req, res, next) => {
  try {
    const result = await authService.loginService(req.body);

    const userPayload = {
      id: result.user.id,
      school_code: result.user.school_code,
      role: result.user.role,
      role_id: result.user.role_id,
      full_name: result.user.full_name,
      email: result.user.email,
      phone: result.user.phone,
      is_active: result.user.is_active,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: userPayload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginController,
};
