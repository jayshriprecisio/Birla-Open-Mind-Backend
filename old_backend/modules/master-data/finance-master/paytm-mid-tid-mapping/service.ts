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
  school_name: string;
  mid: string;
  tid: string;
  edc_type: string;
  status?: string;
  created_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.school_name, args.mid, args.tid)).rowCount) {
    throw new Error('Paytm mapping already exists for this School + MID + TID.');
  }
  const r = await createRepo({
    school_name: args.school_name.trim(),
    mid: args.mid.trim(),
    tid: args.tid.trim(),
    edc_type: args.edc_type.trim(),
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  school_name: string;
  mid: string;
  tid: string;
  edc_type: string;
  status?: string;
  updated_by: string | null;
}) => {
  if (
    (await existsDuplicateRepo(args.school_name, args.mid, args.tid, args.id))
      .rowCount
  ) {
    throw new Error('Paytm mapping already exists for this School + MID + TID.');
  }
  const r = await updateRepo({
    id: args.id,
    school_name: args.school_name.trim(),
    mid: args.mid.trim(),
    tid: args.tid.trim(),
    edc_type: args.edc_type.trim(),
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
