const express = require('express');

const router = express.Router();
const authController = require('./../controller/authController');
const userController = require('./../controller/userController');

router.route('/');

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

module.exports = router;
