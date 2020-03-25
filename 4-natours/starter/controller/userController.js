const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (Obj, ...options) => {
  const newObj = {};
  Object.keys(Obj).forEach(el => {
    if (options.includes(el)) newObj[el] = Obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(202).json({
    status: 'sucess',
    result: users.length,
    data: {
      users
    }
  });
});

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

exports.updateData = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is to update user data, please user /updatePassword to update your password!',
        400
      )
    );
  }

  const filterdBody = filterObj(req.body, 'name', 'email');

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      updateUser
    }
  });
});
