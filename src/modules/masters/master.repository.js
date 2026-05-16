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
      // Handle models that might not have 'name' (e.g., some legacy ones use 'academic_name')
      // For simplicity, we'll try 'name' first, then fall back to common legacy names if needed
      const searchField = this.model.rawAttributes.name ? 'name' : 
                          this.model.rawAttributes.academic_name ? 'academic_name' : 
                          this.model.rawAttributes.session_name ? 'session_name' : 'name';
      
      where[searchField] = { [Op.iLike]: `%${filters.search}%` };
    }

    const order = [];
    if (this.model.rawAttributes.display_order) order.push(['display_order', 'ASC']);
    if (this.model.rawAttributes.name) order.push(['name', 'ASC']);
    else order.push(['created_at', 'DESC']);

    return await this.model.findAll({
      where,
      order: order.length > 0 ? order : [['created_at', 'DESC']],
    });
  }

  async findById(id) {
    return await this.model.findOne({
      where: { id, is_deleted: false },
    });
  }

  async findByName(name) {
    const searchField = this.model.rawAttributes.name ? 'name' : 
                        this.model.rawAttributes.academic_name ? 'academic_name' : 
                        this.model.rawAttributes.session_name ? 'session_name' : 'name';
    
    return await this.model.findOne({
      where: { [searchField]: name, is_deleted: false },
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
    
    // Check if soft delete column exists
    if (record.is_deleted !== undefined) {
      return await record.update({ is_deleted: true });
    }
    return await record.destroy(); // Hard delete if no soft delete support
  }
}

module.exports = MasterRepository;
