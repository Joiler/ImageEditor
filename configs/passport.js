'use strict';

var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var userManager = require('../BLL/userManager');


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        userManager.findUserById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signin', new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, username, password, done) {
                async.waterfall([
                    function (callback) {
                        userManager.findUserByName(username, callback);
                    },
                    function (user, callback) {
                        if (user) {
                            if (user.validPassword(password)) {
                                return done(null, user, {});
                            }
                            else {
                                return done(null, false, {message: 'This userName is already taken'});
                            }
                        } else {
                            return done(null, false, {message: 'Username is not found'});
                        }
                    }
                ], function (err) {
                    if (err) {
                        return done(err);
                    }
                });
            })
    );
};
