const { 
  SchoolEnquiry, 
  SchoolEnquiryFollowup, 
  School, 
  GradeMaster, 
  User, 
  sequelize 
} = require('../models');
const { Op } = require('sequelize');

const createFollowupRepo = async (payload, userId) => {
  return await SchoolEnquiryFollowup.create({
    ...payload,
    created_by: userId,
    updated_by: userId
  });
};

const updateFollowupRepo = async (followupId, payload, userId) => {
  const followup = await SchoolEnquiryFollowup.findByPk(followupId);
  if (followup) {
    await followup.update({
      ...payload,
      updated_by: userId
    });
    return followup;
  }
  return null;
};

const deleteFollowupRepo = async (followupId, userId) => {
  const followup = await SchoolEnquiryFollowup.findByPk(followupId);
  if (followup) {
    followup.is_deleted = true;
    followup.updated_by = userId;
    await followup.save();
    return followup;
  }
  return null;
};

const getFollowupByIdRepo = async (followupId) => {
  return await SchoolEnquiryFollowup.findOne({
    where: { followup_id: followupId, is_deleted: false },
    include: [
      { 
        model: SchoolEnquiry, 
        include: [
          { model: School, as: 'school', attributes: ['school_name'] },
          { model: GradeMaster, as: 'grade', attributes: ['name'] }
        ] 
      }
    ]
  });
};

const listFollowupsRepo = async (filters) => {
  const where = { is_deleted: false };
  
  if (filters.enquiry_id) {
    where.enquiry_id = filters.enquiry_id;
  }

  const { count, rows } = await SchoolEnquiryFollowup.findAndCountAll({
    where,
    include: [
      { 
        model: SchoolEnquiry, 
        attributes: ['enquiry_no', 'student_name', 'father_name', 'father_mobile'],
        include: [
          { model: GradeMaster, as: 'grade', attributes: ['name'] }
        ]
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(filters.pageSize || 10, 10),
    offset: (parseInt(filters.page || 1, 10) - 1) * parseInt(filters.pageSize || 10, 10),
  });

  return {
    total: count,
    items: rows,
    page: parseInt(filters.page || 1, 10),
    pageSize: parseInt(filters.pageSize || 10, 10),
  };
};

const findEnquiryByNoRepo = async (enquiryNo) => {
  return await SchoolEnquiry.findOne({
    where: { enquiry_no: enquiryNo, is_deleted: false },
    include: [
      { model: School, as: 'school', attributes: ['school_name'] },
      { model: GradeMaster, as: 'grade', attributes: ['name'] }
    ]
  });
};

module.exports = {
  createFollowupRepo,
  updateFollowupRepo,
  deleteFollowupRepo,
  getFollowupByIdRepo,
  listFollowupsRepo,
  findEnquiryByNoRepo,
};
