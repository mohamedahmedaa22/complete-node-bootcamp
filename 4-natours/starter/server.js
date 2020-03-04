const app = require('./app');
//listening to port
const port = 3000;
app.listen(port, () => {
    console.log(`App Running on port ${port}`);
});