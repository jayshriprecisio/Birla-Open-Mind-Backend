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
  pdc_status: string;
  description: string | null;
  status?: string;
  created_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.pdc_status)).rowCount) {
    throw new Error('PDC status already exists.');
  }
  const r = await createRepo({
    pdc_status: args.pdc_status.trim(),
    description: args.description,
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  pdc_status: string;
  description: string | null;
  status?: string;
  updated_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.pdc_status, args.id)).rowCount) {
    throw new Error('PDC status already exists.');
  }
  const r = await updateRepo({
    id: args.id,
    pdc_status: args.pdc_status.trim(),
    description: args.description,
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
