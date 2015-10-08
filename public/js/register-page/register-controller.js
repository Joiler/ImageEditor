'use strict';

function RegisterController($scope, AuthenticationService) {
    $scope.userCridentials = {};
    $scope.isRegistrationFailed = false;

    $scope.register = function () {
        if ($scope.registerForm.$valid) {
            $scope.isRegistrationFailed = false;
            AuthenticationService.register($scope.userCridentials.username, $scope.userCridentials.password, $scope.userCridentials.email).then(function (data) {
                if (data.success === false) {
                    $scope.isRegistrationFailed = true;
                }
            });
        }
    };

    $scope.$watch(function () {
        return $scope.userCridentials;
    }, function () {
        $scope.isRegistrationFailed = false;
    }, true);

}

module.exports = ['$scope', 'AuthenticationService', RegisterController];