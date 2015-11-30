'use strict';

function HomeController($scope, $state, ImageService) {
    $scope.hash = Date.now();
    $scope.interval = 2000;
    $scope.images = ImageService.getImages();

    $scope.goToImagePage = function (image) {
        $state.go('edit', {id: image._id});
    };

}

module.exports = ['$scope', '$state', 'ImageService', HomeController];