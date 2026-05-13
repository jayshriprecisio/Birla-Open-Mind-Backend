import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createModeOfPaymentService,
  deleteModeOfPaymentService,
  listModeOfPaymentPaginatedService,
  updateModeOfPaymentService,
} from './mode-of-payment.service';
import {
  createModeOfPaymentSchema,
  deleteModeOfPaymentSchema,
  listModeOfPaymentQuerySchema,
  updateModeOfPaymentSchema,
} from './mode-of-payment.validation';

function httpStatusForError(message: string): number {
  if (message.startsWith('Unauthorized')) return 401;
  if (message.startsWith('Forbidden')) return 403;
  return 400;
}

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

const normalizeYesNoInput = (value: unknown) => {
  const str = String(value ?? '').trim().toUpperCase();
  if (str === 'Y' || str === 'YES' || str === 'TRUE' || str === '1') return 'YES';
  if (str === 'N' || str === 'NO' || str === 'FALSE' || str === '0') return 'NO';
  return value;
};

export const getModeOfPaymentController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const { searchParams } = req.nextUrl;
    const raw = {
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    };

    const validated = listModeOfPaymentQuerySchema.parse(raw);
    const statusFilter =
      validated.status === 'ACTIVE' || validated.status === 'INACTIVE'
        ? validated.status
        : '';

    const { rows, total } = await listModeOfPaymentPaginatedService({
      page: validated.page,
      pageSize: validated.pageSize,
      q: validated.q ?? '',
      statusFilter,
    });

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      page: validated.page,
      pageSize: validated.pageSize,
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const createModeOfPaymentController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      modeOfPaymentName:
        body.modeOfPaymentName ??
        body.ModeOfPaymentName ??
        body.ModeOfPayment ??
        body['Mode Of Payment'],
      nameOnReceipt:
        body.nameOnReceipt ??
        body.NameOnReceipt ??
        body['Name On Receipt'] ??
        body['Name on Receipt'],
      visibleToParent: normalizeYesNoInput(
        body.visibleToParent ??
          body.VisibleToParent ??
          body['Visible To Parent']
      ),
      visibleToFeeCounter: normalizeYesNoInput(
        body.visibleToFeeCounter ??
          body.VisibleToFeeCounter ??
          body['Visible To Fee Counter']
      ),
      orderOfPreference:
        body.orderOfPreference ??
        body.OrderOfPreference ??
        body['Order Of Preference'],
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = createModeOfPaymentSchema.parse(merged);

    const data = await createModeOfPaymentService({
      modeOfPaymentName: validated.modeOfPaymentName,
      nameOnReceipt: validated.nameOnReceipt,
      visibleToParent: validated.visibleToParent,
      visibleToFeeCounter: validated.visibleToFeeCounter,
      orderOfPreference: validated.orderOfPreference,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Mode of payment created successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const updateModeOfPaymentController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      id: body.id ?? body.internalId ?? body.ID,
      modeOfPaymentName:
        body.modeOfPaymentName ??
        body.ModeOfPaymentName ??
        body.ModeOfPayment ??
        body['Mode Of Payment'],
      nameOnReceipt:
        body.nameOnReceipt ??
        body.NameOnReceipt ??
        body['Name On Receipt'] ??
        body['Name on Receipt'],
      visibleToParent: normalizeYesNoInput(
        body.visibleToParent ??
          body.VisibleToParent ??
          body['Visible To Parent']
      ),
      visibleToFeeCounter: normalizeYesNoInput(
        body.visibleToFeeCounter ??
          body.VisibleToFeeCounter ??
          body['Visible To Fee Counter']
      ),
      orderOfPreference:
        body.orderOfPreference ??
        body.OrderOfPreference ??
        body['Order Of Preference'],
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = updateModeOfPaymentSchema.parse(merged);

    const data = await updateModeOfPaymentService({
      id: validated.id,
      modeOfPaymentName: validated.modeOfPaymentName,
      nameOnReceipt: validated.nameOnReceipt,
      visibleToParent: validated.visibleToParent,
      visibleToFeeCounter: validated.visibleToFeeCounter,
      orderOfPreference: validated.orderOfPreference,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Mode of payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Mode of payment updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const deleteModeOfPaymentController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteModeOfPaymentSchema.parse({
      id: body.id ?? body.internalId ?? body.ID,
    });

    const result = await deleteModeOfPaymentService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Mode of payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mode of payment deleted successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};
