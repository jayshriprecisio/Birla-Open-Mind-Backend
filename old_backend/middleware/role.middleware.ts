import { JwtPayload } from '../utils/jwt';
import { getRoleName } from '../utils/roles';

export const authorizeRole = (
  user: JwtPayload,
  allowedRoles: string[]
) => {
  const userRoleName = getRoleName(user.role);
  
  if (userRoleName === 'UNKNOWN') {
    throw new Error('Unauthorized: Invalid role');
  }

  const normalizedAllowed = allowedRoles.map(r => getRoleName(r));

  if (!normalizedAllowed.includes(userRoleName)) {
    throw new Error('Forbidden: Access denied');
  }
};