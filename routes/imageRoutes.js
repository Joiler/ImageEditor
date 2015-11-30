'use strict';

var express = require('express');
var async = require('async');
var imagesManager = require('../BLL/imagesManager');

var router = express.Router();

router.get('/', isLoggedIn, function (req, res, next) {
    async.waterfall([
            function (callback) {
                imagesManager.findImagesForUser(req.user, callback);
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

router.put('/', isLoggedIn, function (req, res, next) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        async.waterfall([
                function (callback) {
                    imagesManager.addImage(filename, file, req.user, callback);
                },
                function (image, numberAffected, callback) {
                    res.send({success: true, result: image});
                }
            ],
            function (error) {
                if (error) {
                    res.send({success: false, error: error.message});
                }
            }
        );
    });
});

router.get('/download/:imageId', isLoggedIn, function (req, res, next) {
    async.waterfall([
            function (callback) {
                imagesManager.getImage(req.params.imageId, req.user, callback);
            },
            function (imageFile, image, callback) {
                res.download(imageFile, image.name + image.extension);
            }
        ],
        function (error) {
            if (error) {
                res.send({success: false, error: error.message});
            }
        }
    );
});

router.post('/send', isLoggedIn, function (req, res, next) {
    async.waterfall([
            function (callback) {
                imagesManager.sendImage(req.body.images, req.user, callback);
            },
            function (imageFile, image, callback) {
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

router.get('/:imageId', isLoggedIn, function (req, res, next) {
    async.waterfall([
            function (callback) {
                imagesManager.getImage(req.params.imageId, req.user, callback);
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

router.post('/:imageId', function (req, res, next) {
    async.waterfall([
            function (callback) {
                imagesManager.updateImage(req.params.imageId, req.body.image, req.user, callback);
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

router.delete('/:imageId', function (req, res, next) {
    async.waterfall([
            function (callback) {
                imagesManager.deleteImage(req.params.imageId, req.user, callback);
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
