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
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: string;
  status?: string;
  created_by: string | null;
}) => {
  if (
    (await existsDuplicateRepo(args.school_name, args.bank_name, args.account_number))
      .rowCount
  ) {
    throw new Error(
      'School bank mapping already exists for this School + Bank + Account Number.'
    );
  }
  const r = await createRepo({
    school_name: args.school_name.trim(),
    bank_name: args.bank_name.trim(),
    account_number: args.account_number.trim(),
    ifsc_code: args.ifsc_code.trim(),
    account_type: args.account_type.trim(),
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  school_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: string;
  status?: string;
  updated_by: string | null;
}) => {
  if (
    (
      await existsDuplicateRepo(
        args.school_name,
        args.bank_name,
        args.account_number,
        args.id
      )
    ).rowCount
  ) {
    throw new Error(
      'School bank mapping already exists for this School + Bank + Account Number.'
    );
  }
  const r = await updateRepo({
    id: args.id,
    school_name: args.school_name.trim(),
    bank_name: args.bank_name.trim(),
    account_number: args.account_number.trim(),
    ifsc_code: args.ifsc_code.trim(),
    account_type: args.account_type.trim(),
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
