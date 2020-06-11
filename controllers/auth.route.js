const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config/db.config');

var userModel = require('../models/user.model');
var userMap = require('../helpers/user.map');

var passwordHash = require('password-hash');

router.route('/register')
    .post(function (req, res, next) {
        var User = new userModel({});
        var registered = userMap(User, req.body);
        if (registered.password != undefined) { //if empty then hash results error
            registered.password = passwordHash.generate(req.body.password);
            registered.save((err, done) => { //here only compared with schema 
                if (!err) {
                    res.status(200).send("Data Added Successfully >> " + done);
                } else {
                    next({
                        msg: "error occured during saving data",
                        error: err
                    })
                }
            })
        } else {
            next("Password field can't be empty");
        }
    })


router.route('/login')
    .post((req, res, next) => {
        userModel.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                next(err)
            }
            if (user) {
                var isMatch = passwordHash.verify(req.body.password, user.password);
                if (isMatch) {
                    var token = jwt.sign({ id: user._id}, config.jwtSecret);
                    res.status(200).json({ user: user, token: token });
                } else {
                    next({
                        msg: "Invalid Login Credentials!..."
                    })
                }
            } else {
                next({
                    msg: "Invalid Login Credentials!..."
                })
            }
        })
    })

module.exports = router;