'use strict';

var HistoryModel = require('./imageEditorModel').historyModel;

var create = function () {
    return new HistoryModel();
};

var save = function (historyModel, callback) {
    return historyModel.save(callback);
};

var removeAllHistoryItemsForUserId = function (userId, callback) {
    return HistoryModel.remove({userId: userId}, callback);
};

var findHistoryItemById = function (id, callback) {
    HistoryModel.findById(id, callback);
};

var findRemovedHistoryItemByImageId = function (imageId, callback) {
    HistoryModel.findOne({imageId: imageId, isRemoved: true}, callback);
};

var findHistoryItemsByUserId = function (userId, callback) {
    HistoryModel.find({userId: userId}).sort({date: 1}).exec(callback);
};

var findAllHistoryItems = function (callback) {
    HistoryModel.find({}, callback);
};


module.exports = {
    create: create,
    save: save,
    removeAllHistoryItemsForUserId: removeAllHistoryItemsForUserId,
    findHistoryItemById: findHistoryItemById,
    findRemovedHistoryItemByImageId: findRemovedHistoryItemByImageId,
    findAllHistoryItems: findAllHistoryItems,
    findHistoryItemsByUserId: findHistoryItemsByUserId
};
