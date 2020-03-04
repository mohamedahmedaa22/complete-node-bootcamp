const fs = require('fs');

const toursData = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res) => {
    res.status(200)
    .json({
        status: 'sucess',
        result: toursData.length,
        data: {
            tours: toursData
        }
    });
};

exports.getTour = (req, res) => {
    const tripID = req.params.id * 1;
    if (tripID > toursData.length) {
        return res.status(404)
        .json({
            status: 'fail',
            error: {
                "message": "this tour id is can not be found."
            }
        });
    }
    const tour = toursData.find(el => el.id === tripID);
    res.status(200)
    .json({
        status: 'sucess',
        data: {
            tour
        }
    });
};

exports.addTour = (req, res) => {
    const newID = toursData[toursData.length - 1].id + 1;
    const newTour = Object.assign({id: newID}, req.body);
    toursData.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(toursData), err => {
        res.status(201)
        .json({
            status: 'sucess',
            result: toursData.length,
            data: {
                tours: toursData
            }
        });
    });
};