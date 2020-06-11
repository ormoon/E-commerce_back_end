const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const config = require('./config/db.config');
const apiRouter = require('./routes/api.route')();



require('./db');

var app = express();


app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(cors());

app.use('/api', apiRouter);
app.use(function (err, req, res, next) {
    console.log("I'm from error handling middleware");
    res.send(err)
});


var server = http.createServer(app);

server.listen(config.PORT, 'localhost', () => {
    console.log("Server is LIstening at port : ", config.PORT);
})
