const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/mailer');

const signToken = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    status: 200,
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user implomented email and password for the request
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }

  // check if email and password exisit
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password'), 401);
  }

  //send the JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(`you aren't logged in! please login to have access`, 401)
    );
  }

  // verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exisit
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('the user belongs to the token is no longer exisit.', 401)
    );
  }

  // check if user changed his password after iat
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently has changed his password, Please log in again.',
        401
      )
    );
  }

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You aren't Allowed to preform this action.`, 403)
      );
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get the user email
  const user = await User.findOne({ email: req.body.email });

  //create random token
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });

  //send token email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password?\nplease do a patch request to our website with your new password and passwordConfirm\n${resetURL}`;

  await sendEmail({
    email: user.email,
    subject: 'Your password reset Token',
    message: message
  });

  res.status(200).json({
    status: 'success',
    data: {
      message: `Token sent to ${user.email}.`
    }
  });
});
