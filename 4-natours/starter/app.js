//requiers modules
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const tourRouter = require('./router/tour-route');

//major variables
const app = express();
dotenv.config({ path: './config.env' });
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);

module.exports = app;
