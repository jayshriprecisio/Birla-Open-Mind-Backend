const { School, GradeMaster, ZoneMaster, BrandMaster, BoardMaster, SessionMaster, User } = require('../models');

const listSchoolsLookup = async () => {
  return School.findAll({
    where: { status: 'active' },
    attributes: ['school_id', 'school_name', 'school_code'],
    order: [['school_name', 'ASC']]
  }).then(schools => schools.map(s => ({
    id: s.school_id,
    name: s.school_name,
    code: s.school_code
  })));
};

const listGradesLookup = async () => {
  return GradeMaster.findAll({
    where: { is_deleted: false },
    attributes: ['id', 'name', 'short_form'],
    order: [['id', 'ASC']]
  });
};

const listZonesLookup = async () => {
  return ZoneMaster.findAll({
    where: { is_deleted: false },
    attributes: ['id', 'zone_name'],
    order: [['zone_name', 'ASC']]
  });
};

const listBrandsLookup = async () => {
  return BrandMaster.findAll({
    attributes: ['id', 'name', 'brand_code'],
    order: [['name', 'ASC']]
  });
};

const listBoardsLookup = async () => {
  return BoardMaster.findAll({
    attributes: ['id', 'board_name', 'board_code'],
    order: [['board_name', 'ASC']]
  });
};

const listSessionsLookup = async () => {
  return SessionMaster.findAll({
    where: { is_deleted: false },
    attributes: ['id', 'session_name'],
    order: [['session_name', 'ASC']]
  });
};

const listUsersLookup = async () => {
  return User.findAll({
    where: { 
      is_active: true,
      role: 5 
    },
    attributes: ['id', 'full_name'],
    order: [['full_name', 'ASC']]
  });
};

module.exports = {
  listSchoolsLookup,
  listGradesLookup,
  listZonesLookup,
  listBrandsLookup,
  listBoardsLookup,
  listSessionsLookup,
  listUsersLookup,
};
