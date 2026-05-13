import {
  createRepo,
  existsDuplicateRepo,
  listRepo,
  softDeleteRepo,
  updateRepo,
} from './repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

export const listService = async () => {
  const r = await listRepo();
  return r.rows;
};

export const createService = async (args: {
  transaction_type: string;
  status?: string;
  created_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.transaction_type)).rowCount) {
    throw new Error('Transaction type already exists.');
  }
  const r = await createRepo({
    transaction_type: args.transaction_type.trim(),
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  transaction_type: string;
  status?: string;
  updated_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.transaction_type, args.id)).rowCount) {
    throw new Error('Transaction type already exists.');
  }
  const r = await updateRepo({
    id: args.id,
    transaction_type: args.transaction_type.trim(),
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
