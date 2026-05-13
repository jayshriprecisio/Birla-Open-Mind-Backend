import { JwtPayload } from '@/backend/utils/jwt';
import { resolveRoleName } from '@/backend/utils/roles';

/**
 * Roles that may access cross-tenant (corporate) operations. Keep in sync with DB `users.role`.
 */
const CROSS_TENANT_ROLES = new Set(['SUPER_ADMIN']);

function normalizeRole(role: unknown): string {
  return resolveRoleName(role);
}

/**
 * Enforces that a school-scoped resource belongs to the caller's tenant.
 * `SUPER_ADMIN` bypasses (HO / corporate). All other users must match `resourceSchoolId` to JWT `schoolId`.
 *
 * Call this in API handlers after `authenticate` when reading/updating rows that include `school_id`.
 */
export function assertTenantSchoolAccess(
  user: JwtPayload,
  resourceSchoolId: string | number | null | undefined
): void {
  const role = normalizeRole(user.role);
  if (CROSS_TENANT_ROLES.has(role)) {
    return;
  }

  const tenantId = String(user.schoolId ?? '').trim();
  const resourceId =
    resourceSchoolId != null && resourceSchoolId !== ''
      ? String(resourceSchoolId).trim()
      : '';

  if (!tenantId) {
    throw new Error('Forbidden: missing school context on token');
  }
  if (!resourceId || tenantId !== resourceId) {
    throw new Error('Forbidden: tenant mismatch');
  }
}

/**
 * School-scoped users only; super-admin is rejected. Use for endpoints that must never run as HO.
 */
export function assertStrictSchoolUser(user: JwtPayload): void {
  const role = normalizeRole(user.role);
  if (CROSS_TENANT_ROLES.has(role)) {
    throw new Error('Forbidden: operation not allowed for this role');
  }
}
