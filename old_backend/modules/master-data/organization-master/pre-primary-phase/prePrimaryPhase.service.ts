import {
  createPrePrimaryPhaseRepo,
  existsPrePrimaryPhaseNameRepo,
  listPrePrimaryPhasesRepo,
  softDeletePrePrimaryPhaseRepo,
  updatePrePrimaryPhaseRepo,
} from './prePrimaryPhase.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

export const createPrePrimaryPhaseService = async (args: {
  phaseName: string;
  status?: string;
  createdBy: string | null;
}) => {
  const dup = await existsPrePrimaryPhaseNameRepo({ phaseName: args.phaseName });
  if (dup.rowCount) {
    throw new Error(
      'A phase with this name already exists. Please use a different name.'
    );
  }
  const r = await createPrePrimaryPhaseRepo({
    phaseName: args.phaseName,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listPrePrimaryPhasesService = async () => {
  const r = await listPrePrimaryPhasesRepo();
  return r.rows;
};

export const updatePrePrimaryPhaseService = async (args: {
  id: string | number;
  phaseName: string;
  status: string;
  updatedBy: string | null;
}) => {
  const dup = await existsPrePrimaryPhaseNameRepo({
    phaseName: args.phaseName,
    excludeId: args.id,
  });
  if (dup.rowCount) {
    throw new Error(
      'A phase with this name already exists. Please use a different name.'
    );
  }
  const r = await updatePrePrimaryPhaseRepo({
    id: args.id,
    phaseName: args.phaseName,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deletePrePrimaryPhaseService = (id: string | number) =>
  softDeletePrePrimaryPhaseRepo(id);
