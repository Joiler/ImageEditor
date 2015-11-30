'use strict';

var ImageModel = require('./imageEditorModel').imageModel;

var create = function () {
    return new ImageModel();
};

var save = function (imageModel, callback) {
    return imageModel.save(callback);
};

var findImageByName = function (imageName, callback) {
    ImageModel.findOne({name: imageName, isRemoved: false}, callback);
};

var findImageById = function (id, callback) {
    ImageModel.findById(id, callback);
};

var findImagesByUserId = function (userId, callback) {
    ImageModel.find({userId: userId, isRemoved: false}, callback);
};

var findRemovedImagesByUserId = function (userId, callback) {
    ImageModel.find({userId: userId, isRemoved: true}, callback);
};

var findAllImages = function (callback) {
    ImageModel.find({}, callback);
};


module.exports = {
    create: create,
    save: save,
    findImageByName: findImageByName,
    findImageById: findImageById,
    findAllImages: findAllImages,
    findImagesByUserId: findImagesByUserId,
    findRemovedImagesByUserId: findRemovedImagesByUserId
};
