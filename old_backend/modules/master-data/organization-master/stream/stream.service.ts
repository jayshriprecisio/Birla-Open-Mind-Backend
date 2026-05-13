import {
  createStreamRepo,
  existsStreamNameRepo,
  existsStreamShortRepo,
  listStreamsRepo,
  softDeleteStreamRepo,
  updateStreamRepo,
} from './stream.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

export const createStreamService = async (args: {
  name: string;
  shortForm: string;
  status?: string;
  createdBy: string | null;
}) => {
  if ((await existsStreamNameRepo(args.name)).rowCount) {
    throw new Error(
      'A stream with this name already exists. Please use a different name.'
    );
  }
  if ((await existsStreamShortRepo(args.shortForm)).rowCount) {
    throw new Error(
      'A stream with this short form already exists. Please use a different short form.'
    );
  }
  const r = await createStreamRepo({
    name: args.name,
    shortForm: args.shortForm,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listStreamsService = async () => {
  const r = await listStreamsRepo();
  return r.rows;
};

export const updateStreamService = async (args: {
  id: string | number;
  name: string;
  shortForm: string;
  status: string;
  updatedBy: string | null;
}) => {
  if ((await existsStreamNameRepo(args.name, args.id)).rowCount) {
    throw new Error(
      'A stream with this name already exists. Please use a different name.'
    );
  }
  if ((await existsStreamShortRepo(args.shortForm, args.id)).rowCount) {
    throw new Error(
      'A stream with this short form already exists. Please use a different short form.'
    );
  }
  const r = await updateStreamRepo({
    id: args.id,
    name: args.name,
    shortForm: args.shortForm,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteStreamService = (id: string | number) =>
  softDeleteStreamRepo(id);
