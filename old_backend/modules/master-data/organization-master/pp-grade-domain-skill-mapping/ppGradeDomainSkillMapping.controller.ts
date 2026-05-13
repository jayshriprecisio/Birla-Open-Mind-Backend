import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createPpMappingService,
  deletePpMappingService,
  listPpMappingsService,
  updatePpMappingService,
} from './ppGradeDomainSkillMapping.service';
import {
  createPpMappingSchema,
  deletePpMappingSchema,
  updatePpMappingSchema,
} from './ppGradeDomainSkillMapping.validation';

function toUserField(userId: string) {
  return String(userId ?? '').trim().slice(0, 50) || null;
}

const normStatus = (body: Record<string, unknown>) => ({
  ...body,
  status:
    typeof body.status === 'string'
      ? body.status.toUpperCase()
      : body.status,
});

export const getPpMappingsController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const data = await listPpMappingsService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createPpMappingController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createPpMappingSchema.parse(normStatus(body));
    const data = await createPpMappingService({
      gradeName: v.gradeName,
      domainName: v.domainName,
      skillName: v.skillName,
      parameterId: v.parameterId,
      status: v.status,
      createdBy: toUserField(user.id),
    });
    return NextResponse.json({
      success: true,
      data,
      message: 'Mapping created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updatePpMappingController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updatePpMappingSchema.parse(normStatus(body));
    const data = await updatePpMappingService({
      id: v.id,
      gradeName: v.gradeName,
      domainName: v.domainName,
      skillName: v.skillName,
      parameterId: v.parameterId,
      status: v.status ?? 'ACTIVE',
      updatedBy: toUserField(user.id),
    });
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data,
      message: 'Mapping updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deletePpMappingController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = deletePpMappingSchema.parse(body);
    const result = await deletePpMappingService(v.id);
    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Mapping deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
