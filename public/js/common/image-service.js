'use strict';

function ImageService($http, $filter, Upload, GroupService, Alertify) {
    var images = [];

    var load = function () {
        return $http({
            url: '/image/?' + Date.now(),
            method: 'get'
        }).then(
            function (response) {
                if (response.data.success === true) {
                    images = response.data.result;
                }
                return images;
            }, function (response) {
                printError();
            });
    };

    var addImage = function (file) {
        return Upload.upload({
            url: '/image/',
            method: 'put',
            file: file
        }).then(
            function (response) {
                if (response.data.success === true) {
                    images.push(response.data.result);
                } else {
                    printError();
                }
            }, function (response) {
                printError();
            });
    };

    var updateImage = function (image) {
        return $http({
            url: '/image/' + image._id,
            method: 'post',
            data: {
                image: image.datauri
            }
        }).then(
            function (response) {
                if (response.data.success !== true) {
                    printError();
                }
            }, function (response) {
                printError();
            });
    };

    var removeImage = function (image) {
        return $http({
            url: '/image/' + image._id,
            method: 'delete'
        }).then(
            function (response) {
                if (response.data.success === true) {
                    GroupService.removeIfImageExists(image._id);
                    var index = images.indexOf(image);
                    if (index > -1) {
                        images.splice(index, 1);
                    }
                } else {
                    printError();
                }
            }, function (response) {
                printError();
            });
    };

    var sendImagesToEmail = function (images) {
        var imageIds = images.map(function (image) {
            return image._id;
        });

        return $http({
            url: '/image/send',
            method: 'post',
            data: {
                images: imageIds
            }
        }).then(
            function (response) {
                if (response.data.success === true) {
                    Alertify.success('Message was sent to your email');
                } else {
                    printError();
                }
            }, function (response) {
                printError();
            });
    };

    var findImage = function (id) {
        return $filter('getById')(images, id);
    };

    var getImages = function () {
        return images;
    };

    var getDownloadImageUrl = function (image) {
        return '/image/download/' + image._id;
    };

    var printError = function () {
        Alertify.error('Error! Please, try again.');
    };

    return {
        load: load,
        addImage: addImage,
        updateImage: updateImage,
        removeImage: removeImage,
        sendImagesToEmail: sendImagesToEmail,
        findImage: findImage,
        getImages: getImages,
        getDownloadImageUrl: getDownloadImageUrl
    };
}

module.exports = ['$http', '$filter', 'Upload', 'GroupService', 'Alertify', ImageService];