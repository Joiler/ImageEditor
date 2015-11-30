'use strict';

function loadingSpinnerDirective($document) {
    return {
        restrict: 'E',

        controller: ['$scope', 'LoadingService', function ($scope, LoadingService) {
            $scope.currentState = LoadingService.currentState;
        }],

        link: function (scope, element) {
            var body = $document.find('body');

            scope.$watch('currentState.visible', function (newValue) {
                if (newValue) {
                    element.html('<div class="loading spinner">  <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div></div>').append('<div class="overlay"></div>');
                } else {
                    element.html('');
                }
            });
        }
    };
}

module.exports = ['$document', loadingSpinnerDirective];
