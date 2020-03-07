const mongoose = require('mongoose');

const toursSchemna = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a Name.'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration.']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a maximum group number.']
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty.']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'The Price is a Required Field.']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a summary.']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have an image cover.']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', toursSchemna);

module.exports = Tour;
