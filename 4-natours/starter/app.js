//requiers modules
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const tourRouter = require('./router/tour-route');

//major variables
const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/tours', tourRouter);

module.exports = app;
