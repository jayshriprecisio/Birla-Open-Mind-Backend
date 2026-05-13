import {
  createBoardRepo,
  deleteBoardRepo,
  existsBoardNameRepo,
  getBoardsRepo,
  updateBoardRepo,
} from './board.repository';

export const createBoardService = async (
  boardName: string,
  status: string,
  createdBy: string
) => {
  const duplicate = await existsBoardNameRepo({
    boardName,
  });

  if (duplicate.rowCount) {
    throw new Error(
      'A board with this name already exists. Please use a different Board Name.'
    );
  }

  const result = await createBoardRepo(
    boardName,
    status,
    Number(createdBy)
  );

  return result.rows[0];
};

export const getBoardsService = async () => {
  const result = await getBoardsRepo();
  return result.rows;
};

export const updateBoardService = async ({
  boardCode,
  boardName,
  status,
  updatedBy,
}: {
  boardCode: string;
  boardName?: string;
  status?: string;
  updatedBy: string;
}) => {
  if (boardName) {
    const duplicate = await existsBoardNameRepo({
      boardName,
      excludeBoardCode: boardCode,
    });

    if (duplicate.rowCount) {
      throw new Error(
        'A board with this name already exists. Please use a different Board Name.'
      );
    }
  }

  const result = await updateBoardRepo({
    boardCode,
    boardName,
    status,
    updatedBy,
  });

  return result.rows[0] || null;
};

export const deleteBoardService = async (
  boardCode: string
) => {
  return await deleteBoardRepo(boardCode);
};
