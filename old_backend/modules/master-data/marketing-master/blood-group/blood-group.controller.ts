import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createBloodGroupService,
  deleteBloodGroupService,
  listBloodGroupsService,
  updateBloodGroupService,
} from './blood-group.service';
import {
  createBloodGroupSchema,
  deleteBloodGroupSchema,
  updateBloodGroupSchema,
} from './blood-group.validation';

function toUserField(userId: string) {
  const num = Number(userId);
  return Number.isFinite(num) ? num : null;
}

const normStatus = (body: Record<string, unknown>) => ({
  ...body,
  status:
    typeof body.status === 'string'
      ? body.status.toUpperCase()
      : body.status,
});

export const getBloodGroupsController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const data = await listBloodGroupsService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createBloodGroupController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createBloodGroupSchema.parse(normStatus(body));
    const data = await createBloodGroupService({
      name: v.name,
      status: v.status,
      createdBy: toUserField(user.id),
    });
    return NextResponse.json({
      success: true,
      data,
      message: 'Blood group created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateBloodGroupController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updateBloodGroupSchema.parse(normStatus(body));
    const data = await updateBloodGroupService({
      id: v.id,
      name: v.name,
      status: v.status ?? 'ACTIVE',
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
      message: 'Blood group updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteBloodGroupController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = deleteBloodGroupSchema.parse(body);
    const result = await deleteBloodGroupService(v.id);
    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Blood group deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
