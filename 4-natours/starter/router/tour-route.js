const express = require('express');

const router = express.Router();
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addTour);

router.route('/tour-statictics').get(tourController.getTourStat);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
