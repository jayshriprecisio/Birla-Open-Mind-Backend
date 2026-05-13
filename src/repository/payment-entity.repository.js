const { PaymentEntityMaster, sequelize } = require('../models');
const { Op } = require('sequelize');

const listPaymentEntitiesRepo = async () => {
  return PaymentEntityMaster.findAll({
    where: { is_deleted: false },
    order: [['id', 'ASC']]
  });
};

const existsDuplicateRepo = async (entityName, excludeId = null) => {
  const where = {
    entity_name: sequelize.where(
      sequelize.fn('LOWER', sequelize.fn('TRIM', sequelize.col('entity_name'))),
      '=',
      entityName.trim().toLowerCase()
    ),
    is_deleted: false
  };

  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }

  const count = await PaymentEntityMaster.count({ where });
  return count > 0;
};

const createPaymentEntityRepo = async (data) => {
  return PaymentEntityMaster.create(data);
};

const updatePaymentEntityRepo = async (id, data) => {
  const entity = await PaymentEntityMaster.findByPk(id);
  if (entity) {
    return entity.update(data);
  }
  return null;
};

const deletePaymentEntityRepo = async (id, userId) => {
  const entity = await PaymentEntityMaster.findByPk(id);
  if (entity) {
    entity.is_deleted = true;
    entity.updated_by = userId;
    return entity.save();
  }
  return null;
};

module.exports = {
  listPaymentEntitiesRepo,
  existsDuplicateRepo,
  createPaymentEntityRepo,
  updatePaymentEntityRepo,
  deletePaymentEntityRepo,
};
