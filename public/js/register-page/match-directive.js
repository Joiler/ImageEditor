'use strict';

function matchDirective($parse) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) {
                return;
            }

            var matchGetter = $parse(attrs.match);
            var caselessGetter = $parse(attrs.matchCaseless);

            scope.$watch(getMatchValue, function () {
                ctrl.$$parseAndValidate();
            });

            ctrl.$validators.match = function () {
                var match = getMatchValue();
                if (caselessGetter(scope) && angular.isString(match) && angular.isString(ctrl.$viewValue)) {
                    return ctrl.$viewValue.toLowerCase() === match.toLowerCase();
                }
                return ctrl.$viewValue === match;
            };

            function getMatchValue() {
                var match = matchGetter(scope);
                if (angular.isObject(match) && match.hasOwnProperty('$viewValue')) {
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
}

module.exports = ['$parse', matchDirective];