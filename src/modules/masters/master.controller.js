const MasterRepository = require('./master.repository');
const MasterService = require('./master.service');
const ApiResponse = require('../../utils/api-response');
const { catchAsync } = require('../../utils/catchAsync');
const masterRegistry = require('./master.registry');

// Helper to get service for a master type
const getService = (type) => {
  const model = masterRegistry[type];
  if (!model) return null;
  return new MasterService(new MasterRepository(model));
};

const listMasters = catchAsync(async (req, res) => {
  const { masterType } = req.params;
  const service = getService(masterType);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, `Master type '${masterType}' not found`));
  }
  const data = await service.getAllMasters(req.query);
  res.status(200).json(new ApiResponse(200, data, `${masterType} list retrieved successfully`));
});

const getMaster = catchAsync(async (req, res) => {
  const { masterType, id } = req.params;
  const service = getService(masterType);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, `Master type '${masterType}' not found`));
  }
  const data = await service.getMasterById(id);
  res.status(200).json(new ApiResponse(200, data, `${masterType} record retrieved successfully`));
});

const createMaster = catchAsync(async (req, res) => {
  const { masterType } = req.params;
  const service = getService(masterType);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, `Master type '${masterType}' not found`));
  }
  const data = await service.createMaster(req.body);
  res.status(201).json(new ApiResponse(201, data, `${masterType} created successfully`));
});

const updateMaster = catchAsync(async (req, res) => {
  const { masterType, id } = req.params;
  const service = getService(masterType);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, `Master type '${masterType}' not found`));
  }
  const data = await service.updateMaster(id, req.body);
  res.status(200).json(new ApiResponse(200, data, `${masterType} updated successfully`));
});

const deleteMaster = catchAsync(async (req, res) => {
  const { masterType, id } = req.params;
  const service = getService(masterType);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, `Master type '${masterType}' not found`));
  }
  await service.deleteMaster(id);
  res.status(200).json(new ApiResponse(200, null, `${masterType} deleted successfully`));
});

module.exports = {
  listMasters,
  getMaster,
  createMaster,
  updateMaster,
  deleteMaster,
};
