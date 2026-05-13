const { School, SchoolPartner, SchoolContact, ZoneMaster, BrandMaster, sequelize } = require('../models');
const { Op } = require('sequelize');

const createSchoolTransaction = async (input) => {
  const transaction = await sequelize.transaction();
  try {
    const school = await School.create(input, { transaction });

    if (input.partners && input.partners.length > 0) {
      const partnersData = input.partners
        .filter(p => p.partner_name || p.partner_email || p.partner_mobile)
        .map((p, idx) => ({
          ...p,
          school_id: school.school_id,
          sort_order: p.sort_order ?? idx
        }));
      await SchoolPartner.bulkCreate(partnersData, { transaction });
    }

    const contacts = [];
    contacts.push({
      ...input.centre_head,
      school_id: school.school_id,
      contact_type: 'centre_head'
    });

    const isBomps = (input.brand_code || '').trim().toUpperCase() === 'BOMPS';
    if (!isBomps && input.principal) {
      contacts.push({
        ...input.principal,
        school_id: school.school_id,
        contact_type: 'principal'
      });
    }

    await SchoolContact.bulkCreate(contacts, { transaction });

    await transaction.commit();
    return { school_id: school.school_id };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const listSchoolsFilteredRepo = async (params) => {
  const { q, status, zone, board, brand, mapping, page, limit, sortBy, sortOrder } = params;
  
  const where = { deleted_at: null };
  const include = [
    { 
      model: ZoneMaster, 
      as: 'zone',
      on: sequelize.literal('CAST("School"."zone_id" AS INTEGER) = "zone"."id"')
    },
    { 
      model: BrandMaster, 
      as: 'brand',
      on: sequelize.literal('CAST("School"."brand_id" AS BIGINT) = "brand"."id"')
    }
  ];

  if (q) {
    where[Op.or] = [
      { school_name: { [Op.iLike]: `%${q}%` } },
      { school_code: { [Op.iLike]: `%${q}%` } },
      { city: { [Op.iLike]: `%${q}%` } },
      { official_email: { [Op.iLike]: `%${q}%` } }
    ];
  }

  if (status && status !== 'all') {
    where.status = status;
  }

  if (zone) {
    include[0].where = { zone_name: zone };
  }

  if (board) {
    where.board = board;
  }

  if (brand && brand !== 'all') {
    include[1].where = { brand_code: brand.toUpperCase() };
  }

  if (mapping === 'mapped') {
    where[Op.and] = [
      { udise_code: { [Op.ne]: null } },
      { cbse_school_code: { [Op.ne]: null } }
    ];
  } else if (mapping === 'partial') {
    where[Op.or] = [
      { udise_code: { [Op.ne]: null } },
      { cbse_school_code: { [Op.ne]: null } }
    ];
  } else if (mapping === 'unmapped') {
    where.udise_code = null;
    where.cbse_school_code = null;
  }

  const { count, rows } = await School.findAndCountAll({
    where,
    include,
    order: [[sortBy || 'school_name', sortOrder || 'DESC']],
    limit: limit || 20,
    offset: ((page || 1) - 1) * (limit || 20),
    distinct: true
  });

  return { rows, total: count };
};

const getSchoolsDashboardSummaryRepo = async () => {
  const total = await School.count({ where: { deleted_at: null } });
  const active = await School.count({ where: { status: 'active', deleted_at: null } });
  
  const bomis = await School.count({
    include: [{ 
      model: BrandMaster, 
      as: 'brand', 
      where: { brand_code: 'BOMIS' },
      on: sequelize.literal('CAST("School"."brand_id" AS BIGINT) = "brand"."id"')
    }],
    where: { deleted_at: null }
  });

  const bomps = await School.count({
    include: [{ 
      model: BrandMaster, 
      as: 'brand', 
      where: { brand_code: 'BOMPS' },
      on: sequelize.literal('CAST("School"."brand_id" AS BIGINT) = "brand"."id"')
    }],
    where: { deleted_at: null }
  });

  const mapped = await School.count({
    where: {
      deleted_at: null,
      udise_code: { [Op.ne]: null },
      cbse_school_code: { [Op.ne]: null }
    }
  });

  return { total, active, bomis, bomps, mapped };
};

const getSchoolByIdRepo = async (schoolId) => {
  return School.findOne({
    where: { school_id: schoolId, deleted_at: null },
    include: [
      { model: SchoolPartner, as: 'partners' },
      { model: SchoolContact, as: 'contacts' },
      { 
        model: ZoneMaster, 
        as: 'zone',
        on: sequelize.literal('CAST("School"."zone_id" AS INTEGER) = "zone"."id"')
      },
      { 
        model: BrandMaster, 
        as: 'brand',
        on: sequelize.literal('CAST("School"."brand_id" AS BIGINT) = "brand"."id"')
      }
    ]
  });
};

const softDeleteSchoolRepo = async (schoolId) => {
  return School.destroy({ where: { school_id: schoolId } });
};

const patchSchoolStatusRepo = async (schoolId, status) => {
  const school = await School.findByPk(schoolId);
  if (school) {
    school.status = status;
    await school.save();
    return { school_id: school.school_id };
  }
  return null;
};

const updateSchoolTransaction = async (schoolId, input) => {
  const transaction = await sequelize.transaction();
  try {
    const school = await School.findByPk(schoolId, { transaction });
    if (!school) {
      await transaction.rollback();
      return null;
    }

    await school.update(input, { transaction });

    // Re-create partners
    await SchoolPartner.destroy({ where: { school_id: schoolId }, transaction });
    if (input.partners && input.partners.length > 0) {
      const partnersData = input.partners
        .filter(p => p.partner_name || p.partner_email || p.partner_mobile)
        .map((p, idx) => ({
          ...p,
          school_id: schoolId,
          sort_order: p.sort_order ?? idx
        }));
      await SchoolPartner.bulkCreate(partnersData, { transaction });
    }

    // Re-create contacts
    await SchoolContact.destroy({ where: { school_id: schoolId }, transaction });
    const contacts = [];
    contacts.push({
      ...input.centre_head,
      school_id: schoolId,
      contact_type: 'centre_head'
    });

    const isBomps = (input.brand_code || '').trim().toUpperCase() === 'BOMPS';
    if (!isBomps && input.principal) {
      contacts.push({
        ...input.principal,
        school_id: schoolId,
        contact_type: 'principal'
      });
    }
    await SchoolContact.bulkCreate(contacts, { transaction });

    await transaction.commit();
    return { school_id: schoolId };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createSchoolTransaction,
  listSchoolsFilteredRepo,
  getSchoolsDashboardSummaryRepo,
  getSchoolByIdRepo,
  softDeleteSchoolRepo,
  patchSchoolStatusRepo,
  updateSchoolTransaction,
};
