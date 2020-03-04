const express = require('express');
const fs = require('fs');
const router = express.Router();
const tourController = require('./../controller/tourController');


router.route('/')
.get(tourController.getAllTours)
.post(tourController.addTour);


router.route('/:id')
.get(tourController.getTour);

module.exports = router;