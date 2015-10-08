'use strict';

function ListController($scope, $state, filterFilter, ImageService, GroupService) {
    $scope.images = ImageService.getImages();
    $scope.groupImageIds = GroupService.getGroupImageIds();
    $scope.hash = Date.now();

    //paging logic
    $scope.entryLimit = 12;
    $scope.currentPage = 1;
    $scope.totalItems = $scope.images.length;

    $scope.updatePageSettings = function () {
        $scope.filtered = filterFilter($scope.images, $scope.searchImages);
        $scope.totalItems = $scope.filtered.length;
        $scope.currentPage = 1;
    };

    //search logic
    $scope.searchSettings = {
        imageName: "",
        extension: ""
    };

    $scope.$watch('searchSettings', function () {
        $scope.updatePageSettings();
    }, true);

    $scope.resetSearchSettings = function () {
        $scope.searchSettings = {
            imageName: "",
            extension: ""
        };
    };

    $scope.searchImages = function (image) {
        var result = true;
        if ($scope.searchSettings.extension) {
            var regexExtension = new RegExp($scope.searchSettings.extension, 'i');
            result = result && regexExtension.test(image.extension);
        }
        if ($scope.searchSettings.imageName && result) {
            var regexName = new RegExp($scope.searchSettings.imageName, 'i');
            result = result && regexName.test(image.name);
        }
        return result;
    };

    //group logic
    $scope.addToGroup = function (image, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        GroupService.addImageIdToGroup(image._id);
    };

    $scope.removeFromGroup = function (image, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        GroupService.removeImageIdFromGroup(image._id);
    };

    $scope.clearGroup = function () {
        GroupService.resetGroup();
    };

    $scope.editGroup = function () {
        $state.go('edit', {id: $scope.groupImageIds.join('&')});
    };

    //add/remove image logic
    $scope.$watch('files', function (newValue) {
        if (newValue && newValue.length > 0) {
            $scope.upload($scope.files[0]);
        }
    });

    $scope.upload = function (file) {
        ImageService.addImage(file).then(function () {
            $scope.resetSearchSettings();
            $scope.updatePageSettings();
        });
    };

    $scope.removeImage = function (image, $event) {
        $event.stopPropagation();
        $event.preventDefault();

        ImageService.removeImage(image).then(function () {
            $scope.updatePageSettings();
        });
    };

    //print logic
    $scope.printImage = function (image, $event) {
        $event.stopPropagation();
        $event.preventDefault();
    };

    //sending email logic
    $scope.sendEmail = function (image, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        ImageService.sendImagesToEmail([image]);
    };

}

module.exports = ['$scope', '$state', 'filterFilter', 'ImageService', 'GroupService', ListController];