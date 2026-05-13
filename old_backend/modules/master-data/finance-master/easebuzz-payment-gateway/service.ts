import {
  createRepo,
  existsDuplicateRepo,
  listRepo,
  softDeleteRepo,
  updateRepo,
} from './repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const normalizeEnvironment = (environment: string) => {
  const value = environment.trim().toUpperCase();
  if (value === 'PRODUCTION') return 'PROD';
  return value === 'PROD' ? 'PROD' : 'TEST';
};

export const listService = async () => {
  const r = await listRepo();
  return r.rows;
};

export const createService = async (args: {
  school_name: string;
  merchant_key: string;
  merchant_salt: string;
  environment: string;
  status?: string;
  created_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.school_name, args.merchant_key)).rowCount) {
    throw new Error('EaseBuzz mapping already exists for this School + Merchant Key.');
  }
  const r = await createRepo({
    school_name: args.school_name.trim(),
    merchant_key: args.merchant_key.trim(),
    merchant_salt: args.merchant_salt.trim(),
    environment: normalizeEnvironment(args.environment),
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  school_name: string;
  merchant_key: string;
  merchant_salt: string;
  environment: string;
  status?: string;
  updated_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.school_name, args.merchant_key, args.id)).rowCount) {
    throw new Error('EaseBuzz mapping already exists for this School + Merchant Key.');
  }
  const r = await updateRepo({
    id: args.id,
    school_name: args.school_name.trim(),
    merchant_key: args.merchant_key.trim(),
    merchant_salt: args.merchant_salt.trim(),
    environment: normalizeEnvironment(args.environment),
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
