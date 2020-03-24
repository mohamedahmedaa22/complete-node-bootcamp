//requiers modules
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const tourRouter = require('./router/tour-route');
const userRouter = require('./router/user-route');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

//major variables
const app = express();
dotenv.config({ path: './config.env' });
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
