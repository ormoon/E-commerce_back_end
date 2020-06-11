const mongoose = require('mongoose');
mongoose.connect(" mongodb://127.0.0.1:27017/Shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(success => {
        console.log("Database connection success");
    })
    .catch(err => {
        console.log("Error during connection to the database");
    })