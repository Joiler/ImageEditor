'use strict';

var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var stringformat = require('stringformat');
var validator = require('validator');
var userRepository = require('../DAL/userRepository');

var rootFolder = stringformat('{0}/../images/', __dirname);

var findUserById = function (userId, outerCallback) {
    userRepository.findUserById(userId, outerCallback);
};

var findUserByName = function (username, outerCallback) {
    if (!username) {
        outerCallback({message: 'UserName isn\'t specified'});
        return;
    }
    username = validator.escape(username).trim();
    userRepository.findUserByUsername(username, outerCallback);
};

var addUser = function (userName, password, email, outerCallback) {
    var user;
    async.waterfall([
        function (callback) {
            if (validator.isLength(userName, 3) && validator.isLength(password, 6) && validator.isEmail(email, {require_tld: false})) {
                userName = validator.escape(userName).trim();
                userRepository.findUserByUsername(userName, callback);
            } else {
                callback({message: 'Validation failed'});
            }
        },
        function (foundUser, callback) {
            if (foundUser) {
                callback({message: 'Such login has already used'});
            } else {
                user = userRepository.create();
                user.username = userName;
                user.email = email;
                user.password = user.generateHash(password);
                userRepository.save(user, callback);
            }
        },
        function (res, numberAffected, callback) {
            var fullUserDirectoryPath = path.normalize(stringformat('{0}{1}', rootFolder, user.id));
            fs.mkdirs(fullUserDirectoryPath, callback);
        },
        function (res, callback) {
            var fullUserHistoryFolderPath = path.normalize(stringformat('{0}{1}/history', rootFolder, user.id));
            fs.mkdirs(fullUserHistoryFolderPath, callback);
        },
        function (res, callback) {
            outerCallback(null, user);
        }
    ], function (error) {
        outerCallback(error);
    });
};


module.exports = {
    findUserById: findUserById,
    findUserByName: findUserByName,
    addUser: addUser
};
