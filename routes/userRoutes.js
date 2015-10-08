'use strict';

var express = require('express');
var passport = require('passport');
var async = require('async');
var userManager = require('../BLL/userManager');

var router = express.Router();

router.post('/logon', function (req, res, next) {
    async.waterfall([
            function (callback) {
                passport.authenticate('local-signin', callback)(req, res, next);
            },
            function (user, info, callback) {
                if (!user) {
                    return res.send({success: false, error: info.message});
                }
                req.logIn(user, callback);
            },
            function (callback) {
                return res.send({success: true});
            }
        ],
        function (error) {
            if (error) {
                return res.send({success: false, error: error.message});
            }
        }
    );
});

router.get('/isLoggedIn', isLoggedIn, function (req, res, next) {
    res.send({success: true, username: req.user.username});
});

router.get('/logout', function (req, res, next) {
    req.logout();
    res.send({success: true});
});

router.post('/register', function (req, res, next) {
    async.waterfall([
            function (callback) {
                userManager.addUser(req.body.username, req.body.password, req.body.email, callback);
            },
            function (user, callback) {
                req.logIn(user, callback);
            },
            function (callback) {
                return res.send({success: true, username: req.user.username});
            }
        ],
        function (error) {
            if (error) {
                res.send({success: false, error: error.message});
            }
        }
    );
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.send({success: false, message: 'Unauthorized user'});
    }
}


module.exports = router;
