const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeaturs');

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: {
        message: "can't find any tours."
      }
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'sucess',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: {
        message: err
      }
    });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'sucess',
      data: {
        tours: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: {
        message: err
      }
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const patchedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'sucess',
      data: {
        tour: patchedTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: {
        message: err
      }
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deleteTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(202).json({
      status: 'sucess',
      data: {
        tour: deleteTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: {
        message: err
      }
    });
  }
};

exports.getTourStat = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      }
    ]);
    res.status(202).json({
      status: 'sucess',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: {
        message: err
      }
    });
  }
};
