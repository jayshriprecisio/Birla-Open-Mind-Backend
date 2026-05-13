import {
  createSubjectGroupRepo,
  existsSubjectGroupNameRepo,
  listSubjectGroupsRepo,
  softDeleteSubjectGroupRepo,
  updateSubjectGroupRepo,
} from './subjectGroup.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

export const createSubjectGroupService = async (args: {
  subjectGroupName: string;
  status?: string;
  createdBy: string | null;
}) => {
  if ((await existsSubjectGroupNameRepo(args.subjectGroupName)).rowCount) {
    throw new Error(
      'A subject group with this name already exists. Please use a different name.'
    );
  }
  const r = await createSubjectGroupRepo({
    subjectGroupName: args.subjectGroupName,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listSubjectGroupsService = async () => {
  const r = await listSubjectGroupsRepo();
  return r.rows;
};

export const updateSubjectGroupService = async (args: {
  id: string | number;
  subjectGroupName: string;
  status: string;
  updatedBy: string | null;
}) => {
  if ((await existsSubjectGroupNameRepo(args.subjectGroupName, args.id)).rowCount) {
    throw new Error(
      'A subject group with this name already exists. Please use a different name.'
    );
  }
  const r = await updateSubjectGroupRepo({
    id: args.id,
    subjectGroupName: args.subjectGroupName,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteSubjectGroupService = (id: string | number) =>
  softDeleteSubjectGroupRepo(id);
