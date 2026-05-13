import {
  createBloodGroupRepo,
  existsBloodGroupNameRepo,
  listBloodGroupsRepo,
  softDeleteBloodGroupRepo,
  updateBloodGroupRepo,
} from './blood-group.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const normalizeName = (name: string) => name.trim().slice(0, 30);

export const createBloodGroupService = async (args: {
  name: string;
  status?: string;
  createdBy: number | null;
}) => {
  const name = normalizeName(args.name);
  if ((await existsBloodGroupNameRepo(name)).rowCount) {
    throw new Error(
      'A blood group with this name already exists. Please use a different name.'
    );
  }
  const r = await createBloodGroupRepo({
    name,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listBloodGroupsService = async () => {
  const r = await listBloodGroupsRepo();
  return r.rows;
};

export const updateBloodGroupService = async (args: {
  id: string | number;
  name: string;
  status: string;
}) => {
  const name = normalizeName(args.name);
  if ((await existsBloodGroupNameRepo(name, args.id)).rowCount) {
    throw new Error(
      'A blood group with this name already exists. Please use a different name.'
    );
  }
  const r = await updateBloodGroupRepo({
    id: args.id,
    name,
    status: normalizeStatus(args.status),
  });
  return r.rows[0] ?? null;
};

export const deleteBloodGroupService = (id: string | number) =>
  softDeleteBloodGroupRepo(id);
