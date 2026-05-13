import { NextRequest } from 'next/server';
import { verifyToken, JwtPayload } from '../utils/jwt';

export const authenticate = (
  req: NextRequest
): JwtPayload => {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized: Token missing');
  }

  return verifyToken(token);
};