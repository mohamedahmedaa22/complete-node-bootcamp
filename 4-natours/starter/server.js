const app = require('./app');
//listening to port
app.listen(process.env.PORT, () => {
    console.log(`App Running on port ${process.env.PORT}`);
});