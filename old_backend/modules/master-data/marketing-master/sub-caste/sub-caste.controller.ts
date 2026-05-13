import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createSubCasteService,
  deleteSubCasteService,
  listSubCastesService,
  updateSubCasteService,
} from './sub-caste.service';
import {
  createSubCasteSchema,
  deleteSubCasteSchema,
  updateSubCasteSchema,
} from './sub-caste.validation';

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

export const getSubCastesController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const data = await listSubCastesService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createSubCasteController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createSubCasteSchema.parse(normStatus(body));
    const data = await createSubCasteService({
      name: v.name,
      displayOrder: v.displayOrder,
      status: v.status,
      createdBy: toUserField(user.id),
    });
    return NextResponse.json({
      success: true,
      data,
      message: 'Sub caste created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateSubCasteController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updateSubCasteSchema.parse(normStatus(body));
    const data = await updateSubCasteService({
      id: v.id,
      name: v.name,
      displayOrder: v.displayOrder,
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
      message: 'Sub caste updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteSubCasteController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = deleteSubCasteSchema.parse(body);
    const result = await deleteSubCasteService(v.id);
    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Sub caste deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

