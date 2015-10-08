'use strict';

function EditController($scope, $state, $stateParams, $timeout, $q, ImageService, LoadingService) {
    //initialize logic
    $scope.currentImages = [];
    $scope.localHistory = [];
    $scope.currentHistoryIndex = 0;

    var loadImages = function () {
        var imageIds = $stateParams.id.split('&');
        var foundImage;
        for (var i = 0, i_length = imageIds.length; i < i_length; i++) {
            foundImage = ImageService.findImage(imageIds[i]);
            if (foundImage) {
                $scope.currentImages.push(angular.copy(foundImage));
            }
        }
        if ($scope.currentImages.length === 0) {
            $state.go('list');
        }
    }();

    $scope.initialImage = $scope.currentImages[0];

    //editing logic
    $scope.isSaveProportions = true;
    $scope.imageSettings = {
        imageWidth: $scope.initialImage.size.width,
        imageHeight: $scope.initialImage.size.height,
        isNotChangeSize: $scope.currentImages.length > 1,
        isSaveProportions: true,
        brightness: 0,
        contrast: 0,
        isForceUpdate: null
    };
    var backup = angular.copy($scope.imageSettings);

    $scope.isApplied = false;
    $scope.localHistory.push(angular.copy($scope.imageSettings));

    $scope.$watch('imageSettings.imageWidth', function () {
        $scope.changeProportionsSetting();
    });

    $scope.changeProportionsSetting = function () {
        if ($scope.imageSettings.isSaveProportions) {
            $scope.imageSettings.imageHeight = $scope.imageSettings.imageWidth * $scope.initialImage.size.height / $scope.initialImage.size.width;
        }
    };

    $scope.apply = function () {
        $scope.isApplied = true;
        $scope.imageSettings.isForceUpdate = true;
        $scope.localHistory.push(angular.copy($scope.imageSettings));
        $scope.currentHistoryIndex++;
    };

    $scope.$watch('imageSettings.isForceUpdate', function () {
        if ($scope.imageSettings.isForceUpdate === false) {
            backup = angular.copy($scope.imageSettings);
        }
    });

    $scope.save = function () {
        $scope.isApplied = false;
        LoadingService.showLoading();
        var promises = [];
        for (var i = 0, i_length = $scope.currentImages.length; i < i_length; i++) {
            promises.push(ImageService.updateImage($scope.currentImages[i]));
        }
        $q.all(promises).then(function () {
            LoadingService.hideLoading();
        });
    };

    $scope.isAnyChanged = function () {
        return !angular.equals($scope.imageSettings, backup);
    };

    //history logic
    $scope.nextInHistory = function () {
        if (($scope.localHistory.length - $scope.currentHistoryIndex) > 1) {
            $scope.isApplied = true;
            $scope.currentHistoryIndex++;
            $scope.imageSettings = $scope.localHistory[$scope.currentHistoryIndex];
            $scope.imageSettings.isForceUpdate = true;
        }
    };

    $scope.backInHistory = function () {
        if ($scope.currentHistoryIndex > 0) {
            $scope.isApplied = true;
            $scope.currentHistoryIndex--;
            $scope.imageSettings = $scope.localHistory[$scope.currentHistoryIndex];
            $scope.imageSettings.isForceUpdate = true;
        }
    };

    //download logic
    $scope.downloadImage = function () {
        for (var i = 0, i_length = $scope.currentImages.length; i < i_length; i++) {
            (function (i) {
                $timeout(function () {
                    var url = ImageService.getDownloadImageUrl($scope.currentImages[i]);
                    window.location = url;
                }, 200 * i);
            })(i);
        }
    };

    //removing logic
    $scope.removeImage = function (image, $event) {
        var promises = [];
        for (var i = 0, i_length = $scope.currentImages.length; i < i_length; i++) {
            promises.push(ImageService.removeImage($scope.currentImages[i]));
        }
        $q.all(promises).then(function () {
            $state.go('list');
        });
    };

    //sending email logic
    $scope.sendEmail = function () {
        ImageService.sendImagesToEmail($scope.currentImages);
    };
}

module.exports = ['$scope', '$state', '$stateParams', '$timeout', '$q', 'ImageService', 'LoadingService', EditController];