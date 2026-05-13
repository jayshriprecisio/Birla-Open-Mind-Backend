import {
  createParameterRepo,
  existsParameterNameRepo,
  listParametersRepo,
  softDeleteParameterRepo,
  updateParameterRepo,
} from './parameter.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

export const createParameterService = async (args: {
  parameterName: string;
  status?: string;
  createdBy: string | null;
}) => {
  if ((await existsParameterNameRepo(args.parameterName)).rowCount) {
    throw new Error(
      'A parameter with this name already exists. Please use a different name.'
    );
  }
  const r = await createParameterRepo({
    parameterName: args.parameterName,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listParametersService = async () => {
  const r = await listParametersRepo();
  return r.rows;
};

export const updateParameterService = async (args: {
  id: string | number;
  parameterName: string;
  status: string;
  updatedBy: string | null;
}) => {
  if (
    (
      await existsParameterNameRepo(
        args.parameterName,
        args.id
      )
    ).rowCount
  ) {
    throw new Error(
      'A parameter with this name already exists. Please use a different name.'
    );
  }
  const r = await updateParameterRepo({
    id: args.id,
    parameterName: args.parameterName,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteParameterService = (id: string | number) =>
  softDeleteParameterRepo(id);
