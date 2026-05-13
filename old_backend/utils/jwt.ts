import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key';

const JWT_EXPIRES_IN = '1d';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  schoolId: string;
  schoolCode: string;
}

export const generateToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    JWT_SECRET
  ) as JwtPayload;
};