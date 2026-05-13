import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createBoardService,
  deleteBoardService,
  getBoardsService,
  updateBoardService,
} from './board.service';
import {
  createBoardSchema,
  deleteBoardSchema,
  updateBoardSchema,
} from './board.validation';
import { formatApiError } from '@/backend/utils/api-error';

const getUserId = (id: string) => id || 'system';

export const getBoardsController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const boards = await getBoardsService();
    return NextResponse.json({
      success: true,
      data: boards,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createBoardController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createBoardSchema.parse({
      ...body,
      status: body.status?.toUpperCase(),
    });

    const board = await createBoardService(
      validated.boardName,
      validated.status,
      getUserId(user.id)
    );

    return NextResponse.json({
      success: true,
      data: board,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateBoardController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateBoardSchema.parse({
      ...body,
      status: body.status?.toUpperCase(),
    });

    const updated = await updateBoardService({
      boardCode: validated.boardCode,
      boardName: validated.boardName,
      status: validated.status,
      updatedBy: getUserId(user.id),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteBoardController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteBoardSchema.parse(body);
    const result = await deleteBoardService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
