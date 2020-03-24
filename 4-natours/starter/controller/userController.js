const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deleteUser = await User.findOneAndDelete(req.params.id);

  if (!deleteUser) {
    return next(
      new AppError(`No user found with that id: ${req.params.id}`, 404)
    );
  }

  res.status(202).json({
    status: 'sucess',
    data: {
      deleteUser
    }
  });
});
