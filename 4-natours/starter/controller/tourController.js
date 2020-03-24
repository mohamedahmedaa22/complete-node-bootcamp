const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeaturs');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  res.status(200).json({
    status: 'sucess',
    result: tours.length,
    data: {
      tours: tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new AppError(`no tour found with that id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour: tour
    }
  });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'sucess',
    data: {
      tours: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const patchedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!patchedTour) {
    return next(
      new AppError(`no tour found with that id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour: patchedTour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deleteTour = await Tour.findByIdAndDelete(req.params.id);

  if (!deleteTour) {
    return next(
      new AppError(`no tour found with that id: ${req.params.id}`, 404)
    );
  }

  res.status(202).json({
    status: 'sucess',
    data: {
      tour: deleteTour
    }
  });
});

exports.getTourStat = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  res.status(200).json({
    status: 'sucess',
    data: {
      stats
    }
  });
});
