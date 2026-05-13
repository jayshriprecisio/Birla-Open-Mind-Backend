import {
  countPeriodOfServicesRepo,
  createPeriodOfServiceRepo,
  existsPeriodOfServiceNameRepo,
  listPeriodOfServicesPaginatedRepo,
  softDeletePeriodOfServiceByIdRepo,
  updatePeriodOfServiceRepo,
} from './period-of-service.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createPeriodOfServiceService = async ({
  periodOfServiceName,
  status,
  createdBy,
}: {
  periodOfServiceName: string;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsPeriodOfServiceNameRepo({ periodOfServiceName });
  if (dup.rowCount) {
    throw new Error(
      'A period of service value with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createPeriodOfServiceRepo({
    periodOfServiceName,
    status: finalStatus,
    createdBy,
  });
  return result.rows[0];
};

export type ListPeriodOfServiceParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listPeriodOfServicesService = async ({
  page,
  pageSize,
  q,
  statusFilter,
}: ListPeriodOfServiceParams) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const filterBase = {
    q,
    statusFilter,
  };

  const [total, result] = await Promise.all([
    countPeriodOfServicesRepo(filterBase),
    listPeriodOfServicesPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updatePeriodOfServiceService = async ({
  id,
  periodOfServiceName,
  status,
}: {
  id: string | number;
  periodOfServiceName?: string;
  status?: string;
}) => {
  if (periodOfServiceName) {
    const dup = await existsPeriodOfServiceNameRepo({
      periodOfServiceName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A period of service value with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updatePeriodOfServiceRepo({
    id,
    periodOfServiceName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deletePeriodOfServiceService = async (id: string | number) => {
  return softDeletePeriodOfServiceByIdRepo(id);
};
