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
  institute_id: string;
  api_key: string;
  environment: string;
  status?: string;
  created_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.school_name, args.institute_id)).rowCount) {
    throw new Error('GrayQuest mapping already exists for this School + Institute ID.');
  }
  const r = await createRepo({
    school_name: args.school_name.trim(),
    institute_id: args.institute_id.trim(),
    api_key: args.api_key.trim(),
    environment: normalizeEnvironment(args.environment),
    status: normalizeStatus(args.status),
    created_by: args.created_by,
  });
  return r.rows[0];
};

export const updateService = async (args: {
  id: string | number;
  school_name: string;
  institute_id: string;
  api_key: string;
  environment: string;
  status?: string;
  updated_by: string | null;
}) => {
  if ((await existsDuplicateRepo(args.school_name, args.institute_id, args.id)).rowCount) {
    throw new Error('GrayQuest mapping already exists for this School + Institute ID.');
  }
  const r = await updateRepo({
    id: args.id,
    school_name: args.school_name.trim(),
    institute_id: args.institute_id.trim(),
    api_key: args.api_key.trim(),
    environment: normalizeEnvironment(args.environment),
    status: normalizeStatus(args.status),
    updated_by: args.updated_by,
  });
  return r.rows[0] ?? null;
};

export const deleteService = (id: string | number) => softDeleteRepo(id);
