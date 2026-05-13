const { School, GradeMaster } = require('../models');

const listSchoolsLookup = async () => {
  return School.findAll({
    where: { deleted_at: null },
    attributes: ['school_id', 'school_name', 'school_code', 'brand_code'],
    order: [['school_name', 'ASC']]
  });
};

const listGradesLookup = async () => {
  return GradeMaster.findAll({
    where: { is_deleted: false },
    attributes: ['id', 'name', 'short_form'],
    order: [['id', 'ASC']]
  });
};

module.exports = {
  listSchoolsLookup,
  listGradesLookup,
};
