const ApiError = require('../utils/ApiError');

class MasterService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAllMasters(filters) {
    return await this.repository.findAll(filters);
  }

  async getMasterById(id) {
    const master = await this.repository.findById(id);
    if (!master) {
      throw new ApiError(404, 'Master record not found');
    }
    return master;
  }

  async createMaster(data) {
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new ApiError(400, 'Master record with this name already exists');
    }
    return await this.repository.create(data);
  }

  async updateMaster(id, data) {
    const master = await this.repository.update(id, data);
    if (!master) {
      throw new ApiError(404, 'Master record not found');
    }
    return master;
  }

  async deleteMaster(id) {
    const master = await this.repository.softDelete(id);
    if (!master) {
      throw new ApiError(404, 'Master record not found');
    }
    return master;
  }
}

module.exports = MasterService;
