import {
  countModeOfPaymentRepo,
  createModeOfPaymentRepo,
  existsModeOfPaymentNameRepo,
  listModeOfPaymentPaginatedRepo,
  softDeleteModeOfPaymentByIdRepo,
  updateModeOfPaymentRepo,
} from './mode-of-payment.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createModeOfPaymentService = async ({
  modeOfPaymentName,
  nameOnReceipt,
  visibleToParent,
  visibleToFeeCounter,
  orderOfPreference,
  status,
  createdBy,
}: {
  modeOfPaymentName: string;
  nameOnReceipt: string;
  visibleToParent: string;
  visibleToFeeCounter: string;
  orderOfPreference: number;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsModeOfPaymentNameRepo({ modeOfPaymentName });
  if (dup.rowCount) {
    throw new Error(
      'A mode of payment with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createModeOfPaymentRepo({
    modeOfPaymentName,
    nameOnReceipt,
    visibleToParent,
    visibleToFeeCounter,
    orderOfPreference,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export type ListModeOfPaymentParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listModeOfPaymentPaginatedService = async (
  params: ListModeOfPaymentParams
) => {
  const limit = params.pageSize;
  const offset = (params.page - 1) * params.pageSize;
  const filterBase = {
    q: params.q,
    statusFilter: params.statusFilter,
  };

  const [total, result] = await Promise.all([
    countModeOfPaymentRepo(filterBase),
    listModeOfPaymentPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updateModeOfPaymentService = async ({
  id,
  modeOfPaymentName,
  nameOnReceipt,
  visibleToParent,
  visibleToFeeCounter,
  orderOfPreference,
  status,
}: {
  id: string | number;
  modeOfPaymentName?: string;
  nameOnReceipt?: string;
  visibleToParent?: string;
  visibleToFeeCounter?: string;
  orderOfPreference?: number;
  status?: string;
}) => {
  if (modeOfPaymentName) {
    const dup = await existsModeOfPaymentNameRepo({
      modeOfPaymentName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A mode of payment with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updateModeOfPaymentRepo({
    id,
    modeOfPaymentName,
    nameOnReceipt,
    visibleToParent,
    visibleToFeeCounter,
    orderOfPreference,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteModeOfPaymentService = async (id: string | number) => {
  return softDeleteModeOfPaymentByIdRepo(id);
};
