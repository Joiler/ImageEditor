'use strict';

var express = require('express');
var async = require('async');
var historyManager = require('../BLL/historyManager');

var router = express.Router();

router.get('/', isLoggedIn, function (req, res, next) {
    async.waterfall([
            function (callback) {
                historyManager.getHistoryListForUser(req.user, callback);
            },
            function (images, callback) {
                res.send({success: true, result: images});
            }
        ],
        function (error) {
            if (error) {
                res.send({success: false, error: error.message});
            }
        }
    );
});

router.delete('/', isLoggedIn, function (req, res, next) {
    async.waterfall([
            function (callback) {
                historyManager.clearAllHistory(req.user, callback);
            },
            function (images, callback) {
                res.send({success: true});
            }
        ],
        function (error) {
            if (error) {
                res.send({success: false, error: error.message});
            }
        }
    );
});

router.get('/:historyId', isLoggedIn, function (req, res, next) {
    async.waterfall([
            function (callback) {
                historyManager.getHistoryItem(req.params.historyId, req.user, callback);
            },
            function (imageFile, image, callback) {
                res.sendFile(imageFile, {});
            }
        ],
        function (error) {
            if (error) {
                res.send({success: false, error: error.message});
            }
        }
    );
});

router.post('/:historyId', function (req, res, next) {
    async.waterfall([
            function (callback) {
                historyManager.rollbackHistoryItem(req.params.historyId, req.user, callback);
            },
            function (callback) {
                res.send({success: true});
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
        res.send({success: false, error: 'Unauthorized'});
    }
}


module.exports = router;
