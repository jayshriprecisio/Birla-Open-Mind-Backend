import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import { createSchema, deleteSchema, updateSchema } from './validation';
import { createService, deleteService, listService, updateService } from './service';

const toUserField = (userId: string) =>
  String(userId ?? '').trim().slice(0, 50) || null;

const normalizeBody = (body: Record<string, unknown>) => ({
  ...body,
  status: typeof body.status === 'string' ? body.status.toUpperCase() : body.status,
});

export const getController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const data = await listService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createSchema.parse(normalizeBody(body));
    const data = await createService({
      school_name: v.school_name,
      bank_name: v.bank_name,
      account_number: v.account_number,
      ifsc_code: v.ifsc_code,
      account_type: v.account_type,
      status: v.status,
      created_by: toUserField(user.id),
    });
    return NextResponse.json({
      success: true,
      data,
      message: 'School and bank mapping created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updateSchema.parse(normalizeBody(body));
    const data = await updateService({
      id: v.id,
      school_name: v.school_name,
      bank_name: v.bank_name,
      account_number: v.account_number,
      ifsc_code: v.ifsc_code,
      account_type: v.account_type,
      status: v.status,
      updated_by: toUserField(user.id),
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
      message: 'School and bank mapping updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = deleteSchema.parse(body);
    const result = await deleteService(v.id);
    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'School and bank mapping deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
