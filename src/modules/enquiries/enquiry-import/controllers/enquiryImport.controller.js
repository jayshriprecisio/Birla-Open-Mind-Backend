

const getSchool = async (req, res, next) => {
  try {
    const school = await schoolsService.getSchoolById(req.params.schoolId);
    res.status(200).json(new ApiResponse(200, school, 'School retrieved successfully'));
  } catch (error) {
    next(error);
  }
};