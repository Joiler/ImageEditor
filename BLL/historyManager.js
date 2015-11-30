'use strict';

var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var stringformat = require('stringformat');
var historyRepository = require('../DAL/historyRepository');
var imageRepository = require('../DAL/imageRepository');

var rootFolder = stringformat('{0}/../images/', __dirname);

var getHistoryListForUser = function (user, outerCallback) {
    async.waterfall([
            function (callback) {
                historyRepository.findHistoryItemsByUserId(user.id, callback);
            },
            function (historyItems, callback) {
                async.map(historyItems, function (historyItem, mapCallback) {
                    async.waterfall([
                            function (innerCallback) {
                                imageRepository.findImageById(historyItem.imageId, innerCallback);
                            },
                            function (image, innerCallback) {
                                var item = historyItem.toObject();
                                if (image) {
                                    item.name = image.name;
                                    item.extension = image.extension;
                                }
                                mapCallback(null, item);
                            }
                        ],
                        function (error) {
                            mapCallback(error);
                        });

                }, function (err, historyItems) {
                    if (err) {
                        outerCallback(err);
                        return;
                    }
                    outerCallback(null, historyItems);
                });
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};


var getHistoryItem = function (historyItemId, user, outerCallback) {
    if (!historyItemId) {
        outerCallback({message: 'History item isn\'t specified'});
        return;
    }

    async.waterfall([
            function (callback) {
                historyRepository.findHistoryItemById(historyItemId, callback);
            },
            function (historyItem, callback) {
                if (!historyItem.userId.equals(user.id)) {
                    callback({message: 'You haven\'t access to this history item'});
                    return;
                }
                var fullPath = stringformat('{0}{1}/history/{2}', rootFolder, user.id, historyItem.fileName);
                fullPath = path.normalize(fullPath);
                outerCallback(null, fullPath, historyItem);
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};


var addHistoryItem = function (image, isRemoved, user, outerCallback) {
    var historyItem;

    async.waterfall([
            function (callback) {
                historyItem = historyRepository.create();
                historyItem.imageId = image.id;
                historyItem.fileName = image.fileName;
                historyItem.isRemoved = isRemoved;
                historyItem.date = new Date();
                historyItem.userId = user.id;
                historyRepository.save(historyItem, isRemoved === true ? outerCallback : callback);
            },
            function (res, rowsAffected, callback) {
                historyItem.fileName = historyItem.id + image.extension;
                historyRepository.save(historyItem, callback);
            },
            function (res, rowsAffected, callback) {
                var fullPath = path.normalize(stringformat('{0}{1}/{2}', rootFolder, user.id, image.fileName));
                var fullPathForHistory = path.normalize(stringformat('{0}{1}/history/{2}', rootFolder, user.id, historyItem.fileName));
                fs.move(fullPath, fullPathForHistory, outerCallback);
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};


var clearAllHistory = function (user, outerCallback) {
    async.parallel([
            function (callback) {
                deleteAllFilesFromHistoryFolder(user, callback);
            },
            function (callback) {
                historyRepository.removeAllHistoryItemsForUserId(user.id, callback);
            },
            function (callback) {
                deleteAllRemovedImagesFromHistory(user, callback);
            }
        ],
        function (err, results) {
            outerCallback(err);
        });
};

var deleteAllFilesFromHistoryFolder = function (user, outerCallback) {
    var fullPathForHistoryFolder;

    async.waterfall([
            function (callback) {
                fullPathForHistoryFolder = path.normalize(stringformat('{0}{1}/history/', rootFolder, user.id));
                fs.readdir(fullPathForHistoryFolder, callback);
            },
            function (files, callback) {
                async.map(files, function (file, mapCallback) {
                    fs.remove(fullPathForHistoryFolder + file, mapCallback);
                }, function (err) {
                    if (err) {
                        outerCallback(err);
                        return;
                    }
                    outerCallback(null);
                });
            }
        ],
        function (error) {
            outerCallback(error);
        });
};

var deleteAllRemovedImagesFromHistory = function (user, outerCallback) {
    async.waterfall([
            function (callback) {
                imageRepository.findRemovedImagesByUserId(user.id, callback);
            },
            function (images, callback) {
                async.map(images, function (image, mapCallback) {
                    async.waterfall([
                            function (innerCallback) {
                                var imageFullPath = stringformat('{0}{1}/{2}', rootFolder, user.id, image.fileName);
                                fs.remove(imageFullPath, innerCallback);
                            },
                            function (innerCallback) {
                                image.remove(mapCallback);
                            }
                        ],
                        function (error) {
                            mapCallback(error);
                        });
                }, function (err) {
                    if (err) {
                        outerCallback(err);
                        return;
                    }
                    outerCallback(null);
                });
            }
        ],
        function (error) {
            outerCallback(error);
        });
};


var rollbackHistoryItem = function (historyItemid, user, outerCallback) {
    if (!historyItemid) {
        outerCallback({message: 'History item isn\'t specified'});
        return;
    }

    var history;
    var historyItemPath;
    var image;
    var imagePath;

    async.waterfall([
            function (callback) {
                getHistoryItem(historyItemid, user, callback);
            },
            function (path, historyitem, callback) {
                history = historyitem;
                historyItemPath = path;
                require('./imagesManager').getImage(historyitem.imageId, user, callback);
            },
            function (path, foundImage, callback) {
                imagePath = path;
                image = foundImage;
                if (history.isRemoved === true) {
                    restoreRemovedImage(history, image, callback);
                }
                else {
                    if (image.isRemoved === true) {
                        replaceRemovedImage(history, historyItemPath, image, imagePath, user, callback);
                    } else {
                        replaceImage(history, historyItemPath, image, imagePath, user, callback);
                    }
                }
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};

var restoreRemovedImage = function (historyItem, image, outerCallback) {
    async.waterfall([
            function (callback) {
                image.isRemoved = false;
                imageRepository.save(image, callback);
            },
            function (res, rowsAffected, callback) {
                historyItem.remove(callback);
            },
            function (res, callback) {
                outerCallback(null);
            }
        ],
        function (error) {
            outerCallback(error);
        });
};

var replaceImage = function (historyItem, historyPath, image, imagePath, user, outerCallback) {
    async.waterfall([
            function (callback) {
                addHistoryItem(image, false, user, callback);
            },
            function (callback) {
                fs.copy(historyPath, imagePath, callback);
            },
            function (callback) {
                removeHistoryItem(historyItem, historyPath, callback);
            },
            function (callback) {
                outerCallback(null);
            }
        ],
        function (error) {
            outerCallback(error);
        });
};

var replaceRemovedImage = function (historyItem, historyPath, image, imagePath, user, outerCallback) {
    async.waterfall([
            function (callback) {
                historyRepository.findRemovedHistoryItemByImageId(image.id, callback);
            },
            function (removedHistoryItem, callback) {
                restoreRemovedImage(removedHistoryItem, image, callback);
            },
            function (callback) {
                replaceImage(historyItem, historyPath, image, imagePath, user, outerCallback);
            }
        ],
        function (error) {
            outerCallback(error);
        });
};

var removeHistoryItem = function (historyItem, path, outerCallback) {
    async.waterfall([
            function (callback) {
                fs.remove(path, callback);
            },
            function (callback) {
                historyItem.remove(callback);
            }
        ],
        function (error) {
            outerCallback(error);
        }
    );
};


module.exports = {
    getHistoryListForUser: getHistoryListForUser,
    getHistoryItem: getHistoryItem,
    addHistoryItem: addHistoryItem,
    rollbackHistoryItem: rollbackHistoryItem,
    clearAllHistory: clearAllHistory
};
