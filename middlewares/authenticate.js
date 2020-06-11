const config = require('../config/db.config');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');

module.exports = function (req, res, next) {
    var token;
    if (req.headers['authorization']) {//global approach for accessing token
        token = req.headers['authorization'];
    }
    if (req.headers['x-access-token']) {////global approach for accessing token
        token = req.headers['x-access-token'];
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (!err) {
                console.log("Token verified >> ", decoded)
                userModel.findById(decoded.id, (err, done) => {
                    if (err) {
                        next(err)
                    }
                    if (done) {
                        req.loggedInUser = done;
                        return next();
                    } else {
                        next({
                            msg: "User removed from system"
                        })
                    }
                })
            } else {
                next(err)
            }
        });
    } else {
        next({
            msg: "Token not provided"
        })
    }
}