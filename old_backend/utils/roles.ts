/**
 * Single source of truth for role mapping.
 * Supports both legacy string roles and requested numeric IDs.
 */

export const ROLE_SUPER_ADMIN = 1;
export const ROLE_SCHOOL_ADMIN = 2;
export const ROLE_PARENT = 3;

export const ROLE_MAP: Record<string | number, string> = {
  1: 'SUPER_ADMIN',
  2: 'SCHOOL_ADMIN',
  3: 'PARENT',
  5: 'PARENT', // Additional parent role found in DB
  'SUPER_ADMIN': 'SUPER_ADMIN',
  'SCHOOL_ADMIN': 'SCHOOL_ADMIN',
  'PARENT': 'PARENT',
  'superadmin': 'SUPER_ADMIN',
  'school': 'SCHOOL_ADMIN',
  'parent': 'PARENT'
};

/** Convert any role representation to a canonical upper-case name. */
export const getRoleName = (role: string | number | unknown): string => {
  const r = String(role ?? '').trim();
  if (!r) return 'UNKNOWN';
  
  // Direct map check
  if (ROLE_MAP[r]) return ROLE_MAP[r];
  
  // Case-insensitive check
  const upper = r.toUpperCase();
  if (ROLE_MAP[upper]) return ROLE_MAP[upper];
  
  return upper;
};
