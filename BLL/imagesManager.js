'use strict';

var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var stringformat = require('stringformat');
var imageSize = require('image-size');
var imageRepository = require('../DAL/imageRepository');
var historyManager = require('./historyManager');
var emailSender = require('./emailSender');

var imageExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.bmp'];
var rootFolder = stringformat('{0}/../images/', __dirname);

var findImagesForUser = function (user, outerCallback) {
    async.waterfall([
            function (callback) {
                imageRepository.findImagesByUserId(user.id, outerCallback);
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};

var getImage = function (imageId, user, outerCallback) {
    if (!imageId) {
        outerCallback({message: 'ImageId isn\'t specified'});
        return;
    }

    async.waterfall([
            function (callback) {
                imageRepository.findImageById(imageId, callback);
            },
            function (image, callback) {
                if (!image) {
                    callback({message: 'Image isn\'t found'});
                    return;
                }
                if (!image.userId.equals(user.id)) {
                    callback({message: 'You haven\'t access to this image'});
                    return;
                }
                var fullPath = path.normalize(stringformat('{0}{1}/{2}', rootFolder, user.id, image.fileName));
                outerCallback(null, fullPath, image);
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};

var addImage = function (fileName, fileContent, user, outerCallback) {
    if (!fileName || !fileContent) {
        outerCallback({message: 'File isn\'t specified'});
        return;
    }
    var image;

    async.waterfall([
            function (callback) {
                var extension = path.extname(fileName);
                var fileNameWithoutExtension = path.basename(fileName, extension);
                if (imageExtensions.indexOf(extension) == -1) {
                    callback({message: 'Incorrect extension'});
                }
                image = imageRepository.create();
                image.name = fileNameWithoutExtension;
                image.fileName = fileName;
                image.extension = extension;
                image.size = {width: 200, height: 200};
                image.userId = user.id;
                imageRepository.save(image, callback);
            },
            function (res, numberAffected, callback) {
                image.fileName = image.id + image.extension;
                var fullPath = stringformat('{0}{1}/{2}', rootFolder, user.id, image.fileName);
                var fstream = fs.createWriteStream(fullPath);
                fileContent.pipe(fstream);
                fstream.on('close', function () {
                    imageSize(fullPath, callback);
                });
            },
            function (res, callback) {
                image.size = {width: res.width, height: res.height};
                imageRepository.save(image, outerCallback);
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};

var deleteImage = function (imageId, user, outerCallback) {
    if (!imageId) {
        outerCallback({message: 'Image isn\'t specified'});
        return;
    }
    var image;

    async.waterfall([
            function (callback) {
                getImage(imageId, user, callback);
            },
            function (path, foundImage, callback) {
                image = foundImage;
                historyManager.addHistoryItem(image, true, user, callback);
            },
            function (callback) {
                image.isRemoved = true;
                imageRepository.save(image, outerCallback);
            },
        ],
        function (error) {
            outerCallback(error);
        }
    );
};

var updateImage = function (imageId, imageDataUri, user, outerCallback) {
    if (!imageId || !imageDataUri) {
        outerCallback({message: 'Image isn\'t specified'});
        return;
    }
    var image;

    async.waterfall([
            function (callback) {
                getImage(imageId, user, callback);
            },
            function (path, foundImage, callback) {
                image = foundImage;
                historyManager.addHistoryItem(image, false, user, callback);
            },
            function (callback) {
                var fullPath = path.normalize(stringformat('{0}{1}/{2}', rootFolder, user.id, image.fileName));
                var base64Data = imageDataUri.replace(/^data:image\/png;base64,/, "");
                fs.writeFile(fullPath, base64Data, 'base64', outerCallback);
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};

var sendImage = function (imageIds, user, outerCallback) {
    async.map(imageIds, function (imageId, mapCallback) {
        async.waterfall([
                function (callback) {
                    getImage(imageId, user, callback);
                },
                function (path, image, callback) {
                    mapCallback(null, {path: path});
                }
            ],
            function (error) {
                mapCallback(error);
            });

    }, function (err, imagePathes) {
        if (err) {
            outerCallback(err);
            return;
        }
        emailSender.sendEmail(user.email, imagePathes);
        outerCallback();
    });
};


module.exports = {
    findImagesForUser: findImagesForUser,
    getImage: getImage,
    addImage: addImage,
    deleteImage: deleteImage,
    updateImage: updateImage,
    sendImage: sendImage
};
