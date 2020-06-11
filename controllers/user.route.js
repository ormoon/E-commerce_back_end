const express = require('express');
const router = express.Router();
var userModel = require('../models/user.model');
var userMap = require('../helpers/user.map');

var passwordHash = require('password-hash');

router.route('/')
    .get((req, res) => {
        userModel
            .find({})
            .lean()
            .sort({ _id: -1 })
            // .skip(1)
            // .limit(3)
            .exec(function (err, done) {
                if (!err) {
                    res.status(200).send(done)
                } else {
                    next(err);
                }
            })
    })


router.route('/:id')
    .get(function (req, res, next) {
        userModel.findById(req.params.id, (err, done) => {
            if (!err) {
                res.status(200).send(done)
            } else {
                next("There is no any user matched with given Id")
            }
        })
    })
    .put(function (req, res, next) {
        userModel.findById(req.params.id)
            .exec((err, user) => {
                if (err) {
                    next(err)
                }
                else if (!user) {
                    next("User with particular Id is not available in database")
                }
                else {
                    console.log("loggedInUser >> ", req.loggedInUser)
                    if (req.body.password) {
                        req.body.password = passwordHash.generate(req.body.password);
                    }
                    var updated = userMap(user, req.body);
                    updated.updatedBy = req.loggedInUser.username;
                    updated.save((err, done) => {
                        if (!err) {
                            res.send("Data has been updated Successfully  >> " + done)
                        } else {
                            next(err)
                        }
                    })
                }
            })
    })

    .delete((req, res, next) => {
        if (req.loggedInUser.role !== 1) {
            return next({
                msg: "You don't have access"
            })
        } else {
            userModel.findByIdAndRemove(req.params.id, (err, done) => {
                if (done) {
                    res.status(200).send("User with given ID is successfully removed from database")
                } else if (err) {
                    next(err)
                } else {
                    next("The given Id didn't matched with any user's id in database")
                }
            })
        }
    })

module.exports = router;