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
  entity_name: string;
  status?: string;
  created_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.entity_name)).rowCount) {
    throw new Error('Bank / Wallet / Merchant name already exists.');
  }
  const r = await createRepo({
    entity_name: args.entity_name.trim(),
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  entity_name: string;
  status?: string;
  updated_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.entity_name, args.id)).rowCount) {
    throw new Error('Bank / Wallet / Merchant name already exists.');
  }
  const r = await updateRepo({
    id: args.id,
    entity_name: args.entity_name.trim(),
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
