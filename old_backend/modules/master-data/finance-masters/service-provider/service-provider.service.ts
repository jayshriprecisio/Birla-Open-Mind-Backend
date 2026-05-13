import {
  countServiceProviderRepo,
  createServiceProviderRepo,
  existsServiceProviderNameRepo,
  listServiceProviderPaginatedRepo,
  softDeleteServiceProviderByIdRepo,
  updateServiceProviderRepo,
} from './service-provider.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createServiceProviderService = async ({
  serviceProviderName,
  status,
  createdBy,
}: {
  serviceProviderName: string;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsServiceProviderNameRepo({ serviceProviderName });
  if (dup.rowCount) {
    throw new Error(
      'A service provider with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createServiceProviderRepo({
    serviceProviderName,
    status: finalStatus,
    createdBy,
  });
  return result.rows[0];
};

export type ListServiceProviderParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listServiceProviderPaginatedService = async (
  params: ListServiceProviderParams
) => {
  const limit = params.pageSize;
  const offset = (params.page - 1) * params.pageSize;
  const filterBase = {
    q: params.q,
    statusFilter: params.statusFilter,
  };

  const [total, result] = await Promise.all([
    countServiceProviderRepo(filterBase),
    listServiceProviderPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updateServiceProviderService = async ({
  id,
  serviceProviderName,
  status,
}: {
  id: string | number;
  serviceProviderName?: string;
  status?: string;
}) => {
  if (serviceProviderName) {
    const dup = await existsServiceProviderNameRepo({
      serviceProviderName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A service provider with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updateServiceProviderRepo({
    id,
    serviceProviderName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteServiceProviderService = async (id: string | number) => {
  return softDeleteServiceProviderByIdRepo(id);
};
