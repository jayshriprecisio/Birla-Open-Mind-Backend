const MasterRepository = require('../repository/master.repository');
const MasterService = require('../services/master.service');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const { InteractionMaster, PriorityMaster, StageMaster, FollowupStatusMaster } = require('../models');

// Instantiate Repositories and Services
const interactionService = new MasterService(new MasterRepository(InteractionMaster));
const priorityService = new MasterService(new MasterRepository(PriorityMaster));
const stageService = new MasterService(new MasterRepository(StageMaster));
const followupStatusService = new MasterService(new MasterRepository(FollowupStatusMaster));

// Map master names to their services
const serviceMap = {
  interaction: interactionService,
  priority: priorityService,
  stage: stageService,
  'followup-status': followupStatusService,
};

const getService = (type) => {
  const service = serviceMap[type];
  if (!service) throw new Error('Invalid master type');
  return service;
};

const listMasters = catchAsync(async (req, res) => {
  const { type } = req.params;
  const service = getService(type);
  const data = await service.getAllMasters(req.query);
  res.status(200).json(new ApiResponse(200, data, `${type} masters retrieved successfully`));
});

const getMaster = catchAsync(async (req, res) => {
  const { type, id } = req.params;
  const service = getService(type);
  const data = await service.getMasterById(id);
  res.status(200).json(new ApiResponse(200, data, `${type} master retrieved successfully`));
});

const createMaster = catchAsync(async (req, res) => {
  const { type } = req.params;
  const service = getService(type);
  const data = await service.createMaster(req.body);
  res.status(201).json(new ApiResponse(201, data, `${type} master created successfully`));
});

const updateMaster = catchAsync(async (req, res) => {
  const { type, id } = req.params;
  const service = getService(type);
  const data = await service.updateMaster(id, req.body);
  res.status(200).json(new ApiResponse(200, data, `${type} master updated successfully`));
});

const deleteMaster = catchAsync(async (req, res) => {
  const { type, id } = req.params;
  const service = getService(type);
  await service.deleteMaster(id);
  res.status(200).json(new ApiResponse(200, null, `${type} master deleted successfully`));
});

module.exports = {
  listMasters,
  getMaster,
  createMaster,
  updateMaster,
  deleteMaster,
};
