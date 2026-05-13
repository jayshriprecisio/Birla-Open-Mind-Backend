import {
  createPpMappingRepo,
  existsPpMappingDuplicateRepo,
  listPpMappingsRepo,
  parameterExistsRepo,
  softDeletePpMappingRepo,
  updatePpMappingRepo,
} from './ppGradeDomainSkillMapping.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

function toParamId(id: string | number): string {
  return String(id);
}

async function assertParameter(id: string | number) {
  const r = await parameterExistsRepo(id);
  if (!r.rowCount) {
    throw new Error('Selected parameter does not exist or is inactive.');
  }
}

export const createPpMappingService = async (args: {
  gradeName: string;
  domainName: string;
  skillName: string;
  parameterId: string | number;
  status?: string;
  createdBy: string | null;
}) => {
  const pid = toParamId(args.parameterId);
  await assertParameter(pid);
  const dup = await existsPpMappingDuplicateRepo({
    gradeName: args.gradeName,
    domainName: args.domainName,
    skillName: args.skillName,
    parameterId: pid,
  });
  if (dup.rowCount) {
    throw new Error(
      'This grade, domain, skill, and parameter combination already exists.'
    );
  }
  const r = await createPpMappingRepo({
    gradeName: args.gradeName,
    domainName: args.domainName,
    skillName: args.skillName,
    parameterId: pid,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listPpMappingsService = async () => {
  const r = await listPpMappingsRepo();
  return r.rows;
};

export const updatePpMappingService = async (args: {
  id: string | number;
  gradeName: string;
  domainName: string;
  skillName: string;
  parameterId: string | number;
  status: string;
  updatedBy: string | null;
}) => {
  const pid = toParamId(args.parameterId);
  await assertParameter(pid);
  const dup = await existsPpMappingDuplicateRepo({
    gradeName: args.gradeName,
    domainName: args.domainName,
    skillName: args.skillName,
    parameterId: pid,
    excludeId: args.id,
  });
  if (dup.rowCount) {
    throw new Error(
      'This grade, domain, skill, and parameter combination already exists.'
    );
  }
  const r = await updatePpMappingRepo({
    id: args.id,
    gradeName: args.gradeName,
    domainName: args.domainName,
    skillName: args.skillName,
    parameterId: pid,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deletePpMappingService = (id: string | number) =>
  softDeletePpMappingRepo(id);
