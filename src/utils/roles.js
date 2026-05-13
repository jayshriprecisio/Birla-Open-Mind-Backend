const ROLE_SUPER_ADMIN = 1;
const ROLE_SCHOOL_ADMIN = 2;
const ROLE_PARENT = 3;

const ROLE_MAP = {
  1: 'SUPER_ADMIN',
  2: 'SCHOOL_ADMIN',
  3: 'PARENT',
  5: 'PARENT',
  'SUPER_ADMIN': 'SUPER_ADMIN',
  'SCHOOL_ADMIN': 'SCHOOL_ADMIN',
  'PARENT': 'PARENT',
  'superadmin': 'SUPER_ADMIN',
  'school': 'SCHOOL_ADMIN',
  'parent': 'PARENT'
};

const getRoleName = (role) => {
  const r = String(role ?? '').trim();
  if (!r) return 'UNKNOWN';
  if (ROLE_MAP[r]) return ROLE_MAP[r];
  const upper = r.toUpperCase();
  if (ROLE_MAP[upper]) return ROLE_MAP[upper];
  return upper;
};

const roleNamesToIds = (roles) => {
  const ids = [];
  // For the reverse map, we know 1=SUPER_ADMIN, 2=SCHOOL_ADMIN, 3=PARENT
  const nameToId = {
    'SUPER_ADMIN': 1,
    'SCHOOL_ADMIN': 2,
    'PARENT': 3
  };
  roles.forEach(name => {
    const canonical = getRoleName(name);
    if (nameToId[canonical]) {
      ids.push(nameToId[canonical]);
    }
  });
  return ids;
};

module.exports = {
  ROLE_SUPER_ADMIN,
  ROLE_SCHOOL_ADMIN,
  ROLE_PARENT,
  getRoleName,
  roleNamesToIds
};
