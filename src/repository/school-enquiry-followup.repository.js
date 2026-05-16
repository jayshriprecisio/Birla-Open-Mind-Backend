const { 
  SchoolEnquiry, 
  SchoolEnquiryFollowup, 
  School, 
  GradeMaster, 
  User, 
  InteractionModeMaster,
  InteractionStatusMaster,
  PriorityMaster,
  StageMaster,
  FollowupStatusMaster,
  sequelize 
} = require('../models');
const { Op } = require('sequelize');

const createFollowupRepo = async (payload, userId) => {
  return await SchoolEnquiryFollowup.create({
    ...payload,
    created_by: userId,
    updated_by: userId,
    followup_by: userId
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
      },
      { model: InteractionModeMaster, as: 'interaction_mode', attributes: ['name'] },
      { model: PriorityMaster, as: 'priority_ref', attributes: ['name', 'color_code'] },
      { model: StageMaster, as: 'stage', attributes: ['name'] },
      { model: InteractionStatusMaster, as: 'interaction_status', attributes: ['name'] },
      { model: FollowupStatusMaster, as: 'followup_status_ref', attributes: ['name'] },
      { model: User, as: 'counsellor', attributes: ['full_name'] }
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
        attributes: ['enquiry_no', 'student_name', 'father_name', 'father_mobile', 'father_email', 'mother_email'],
        include: [
          { model: GradeMaster, as: 'grade', attributes: ['name', 'short_form'] },
          { model: School, as: 'school', attributes: ['school_name'] }
        ]
      },
      { model: InteractionModeMaster, as: 'interaction_mode', attributes: ['name'] },
      { model: PriorityMaster, as: 'priority_ref', attributes: ['name', 'color_code'] },
      { model: StageMaster, as: 'stage', attributes: ['name'] },
      { model: InteractionStatusMaster, as: 'interaction_status', attributes: ['name'] },
      { model: FollowupStatusMaster, as: 'followup_status_ref', attributes: ['name'] },
      { model: User, as: 'counsellor', attributes: ['full_name'] }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(filters.pageSize || 10, 10),
    offset: (parseInt(filters.page || 1, 10) - 1) * parseInt(filters.pageSize || 10, 10),
  });

  const flattenedItems = rows.map(r => {
    const json = r.toJSON();
    if (json.SchoolEnquiry) {
      json.SchoolEnquiry.grade = json.SchoolEnquiry.grade?.short_form || json.SchoolEnquiry.grade?.name || '';
      json.SchoolEnquiry.school = json.SchoolEnquiry.school?.school_name || '';
    }
    // Map master names for easy frontend consumption
    json.mode_name = json.interaction_mode?.name || '';
    json.priority_name = json.priority_ref?.name || '';
    json.priority_color = json.priority_ref?.color_code || '';
    json.stage_name = json.stage?.name || '';
    json.status_name = json.interaction_status?.name || json.followup_status_ref?.name || '';
    json.counsellor_name = json.counsellor?.full_name || '';
    return json;
  });

  return {
    total: count,
    items: flattenedItems,
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
