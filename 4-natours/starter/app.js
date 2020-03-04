//requiers modules
const express = require('express');
const fs = require('fs');

//major variables
const app = express();
const port = 3000;
app.use(express.json());

// I/O handling.
const toursData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//http requests
app.get('/api/v1/tours', (req, res) => {
    res.status(200)
    .json({
        status: 'sucess',
        result: toursData.length,
        data: {
            tours: toursData
        }
    });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
    const newID = toursData[toursData.length - 1].id + 1;
    const newTour = Object.assign({id: newID}, req.body);
    toursData.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursData), err => {
        res.status(201)
        .json({
            status: 'sucess',
            result: toursData.length,
            data: {
                tours: toursData
            }
        });
    });
});


//listening to port
app.listen(port, () => {
    console.log(`App Running on port ${port}`);
});
