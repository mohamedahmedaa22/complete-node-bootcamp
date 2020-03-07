const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABSE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to the DB'));

//listening to port
app.listen(process.env.PORT, () => {
  console.log(`App Running on port ${process.env.PORT}`);
});
