const express = require('express');

const router = express.Router();
const authController = require('./../controller/authController');
const userController = require('./../controller/userController');

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead'),
    userController.deleteUser
  );

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updatePassword')
  .post(authController.protect, authController.updatePassword);
router
  .route('/updateUser')
  .patch(authController.protect, userController.updateData);

module.exports = router;
