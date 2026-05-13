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
  cheque_in_favour_of: string;
  fees_type: string;
  status?: string;
  created_by: string | null;
}) => {
  if (
    (await existsDuplicateRepo(args.cheque_in_favour_of, args.fees_type)).rowCount
  ) {
    throw new Error(
      'Cheque in favour of and fees type combination already exists.'
    );
  }
  const r = await createRepo({
    cheque_in_favour_of: args.cheque_in_favour_of.trim(),
    fees_type: args.fees_type.trim(),
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  cheque_in_favour_of: string;
  fees_type: string;
  status?: string;
  updated_by: string | null;
}) => {
  if (
    (
      await existsDuplicateRepo(args.cheque_in_favour_of, args.fees_type, args.id)
    ).rowCount
  ) {
    throw new Error(
      'Cheque in favour of and fees type combination already exists.'
    );
  }
  const r = await updateRepo({
    id: args.id,
    cheque_in_favour_of: args.cheque_in_favour_of.trim(),
    fees_type: args.fees_type.trim(),
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
