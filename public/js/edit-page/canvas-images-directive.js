'use strict';

function canvasImagesDirective($q, $timeout, LoadingService) {
    var backup;

    return {
        restrict: 'E',
        scope: {
            editSettings: '=editSettings',
            images: '=images'
        },

        template: '<div ng-repeat="image in images"><canvas id="canvas-img-{{image._id}}"/></div>',
        replace: true,

        link: function (scope, element, attrs) {
            scope.hash = Date.now();

            var initImages = function () {
                for (var i = 0, i_length = scope.images.length; i < i_length; i++) {
                    Caman("#canvas-img-" + scope.images[i]._id, 'image/' + scope.images[i]._id + '?' + scope.hash, function () {
                    });
                }
                backup = angular.copy(scope.editSettings);
            };

            var updateImages = function () {
                var promises = [];

                if (!angular.equals(scope.editSettings, backup)) {
                    $timeout(function () {
                        LoadingService.showLoading();
                    }, 0);

                    for (var i = 0, i_length = scope.images.length; i < i_length; i++) {
                        (function (i) {
                            var deferred = $q.defer();
                            promises.push(deferred.promise);
                            updateImage(scope.images[i], function (base64String) {
                                deferred.resolve();
                                scope.$apply(function () {
                                    scope.images[i].datauri = base64String;
                                });
                            });
                        })(i);
                    }

                    $q.all(promises).then(function () {
                        backup = angular.copy(scope.editSettings);
                        LoadingService.hideLoading();
                    });
                }
            };

            var updateImage = function (image, callback) {
                Caman("#canvas-img-" + image._id, function () {
                    this.reset();
                    if (scope.editSettings.isNotChangeSize !== true) {
                        this.resize({
                            width: scope.editSettings.imageWidth,
                            height: scope.editSettings.imageHeight
                        });
                    }
                    this.brightness(scope.editSettings.brightness);
                    this.contrast(scope.editSettings.contrast);
                    this.render(function () {
                        callback(this.toBase64());
                    });
                });
            };

            scope.$watch('editSettings.isForceUpdate', function () {
                if (scope.editSettings.isForceUpdate === true) {
                    scope.editSettings.isForceUpdate = false;
                    updateImages();
                }
            });

            angular.element(document).ready(function () {
                initImages();
            });

        }
    };
}

module.exports = ['$q', '$timeout', 'LoadingService', canvasImagesDirective];