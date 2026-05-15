const service = require("../services/student-admissions.service");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");

const createDraftAdmissionController = async (req, res, next) => {
  try {
    const data = await service.createAdmissionService({
      ...req.body,
      status: "draft",
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, data, "Student Admission created successfully"),
      );
  } catch (error) {
    next(error);
  }
};

const createAdmissionController = async (req, res, next) => {
  try {
    const data = await service.createAdmissionService(req.body);
    res
      .status(201)
      .json(
        new ApiResponse(201, data, "Student Admission created successfully"),
      );
  } catch (error) {
    next(error);
  }
};

const getAllAdmissionsController = async (req, res, next) => {
  try {
    const data = await service.getAllAdmissionsService(req.query);
    res
      .status(200)
      .json(new ApiResponse(200, data, "Admissions retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const getAdmissionStatsController = async (req, res, next) => {
  try {
    const data = await service.getAdmissionStatsService();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          "Admission statistics retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const getAdmissionByIdController = async (req, res, next) => {
  try {
    const data = await service.getAdmissionByIdService(req.params.id);
    if (!data) throw new ApiError(404, "Admission record not found");
    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Admission record retrieved successfully"),
      );
  } catch (error) {
    next(error);
  }
};

const getAdmissionBySearchController = async (req, res, next) => {
  try {
    const data = await service.getAdmissionBySearchService(req.query);
    if (!data) throw new ApiError(404, "Admission record not found");
    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Admission record retrieved successfully"),
      );
  } catch (error) {
    next(error);
  }
};

const updateAdmissionController = async (req, res, next) => {
  try {
    const data = await service.updateAdmissionService(req.params.id, req.body);
    if (!data) throw new ApiError(404, "Admission record not found");
    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Admission record updated successfully"),
      );
  } catch (error) {
    next(error);
  }
};

const deleteAdmissionController = async (req, res, next) => {
  try {
    const data = await service.deleteAdmissionService(
      req.params.id,
      req.user?.id,
    );
    if (!data) throw new ApiError(404, "Admission record not found");
    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Admission record deleted successfully"),
      );
  } catch (error) {
    next(error);
  }
};

const cancelAdmissionController = async (req, res, next) => {
  try {
    const data = await service.cancelAdmissionService(req.params.id);
    if (!data) throw new ApiError(404, "Admission record not found");
    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Admission record cancelled successfully"),
      );
  } catch (error) {
    next(error);
  }
};

const clearChequeController = async (req, res, next) => {
  try {
    const data = await service.clearChequeService(req.params.id);
    if (!data) throw new ApiError(404, "Admission record not found");
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          "Cheque cleared and admission completed successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdmissionController,
  createDraftAdmissionController,
  getAllAdmissionsController,
  getAdmissionStatsController,
  getAdmissionBySearchController,
  getAdmissionByIdController,
  updateAdmissionController,
  deleteAdmissionController,
  cancelAdmissionController,
  clearChequeController,
};
