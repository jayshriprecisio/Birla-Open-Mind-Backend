const { Op } = require('sequelize');

class MasterRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filters = {}) {
    const where = { is_deleted: false };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.search) {
      where.name = { [Op.iLike]: `%${filters.search}%` };
    }

    return await this.model.findAll({
      where,
      order: [['display_order', 'ASC'], ['name', 'ASC']],
    });
  }

  async findById(id) {
    return await this.model.findOne({
      where: { id, is_deleted: false },
    });
  }

  async findByName(name) {
    return await this.model.findOne({
      where: { name, is_deleted: false },
    });
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const record = await this.findById(id);
    if (!record) return null;
    return await record.update(data);
  }

  async softDelete(id) {
    const record = await this.findById(id);
    if (!record) return null;
    return await record.update({ is_deleted: true });
  }
}

module.exports = MasterRepository;
