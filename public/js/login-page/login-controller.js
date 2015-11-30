'use strict';

function LoginController($scope, AuthenticationService) {
    $scope.userCridentials = {};
    $scope.isAutoruzedFail = false;

    $scope.signIn = function () {
        if ($scope.loginForm.$valid) {
            $scope.isAutoruzedFail = false;
            AuthenticationService.login($scope.userCridentials.username, $scope.userCridentials.password)
                .then(function (data) {
                    if (data.success === false) {
                        $scope.isAutoruzedFail = true;
                    }
                });
        }
    };

    $scope.$watch(function () {
        return $scope.userCridentials;
    }, function () {
        $scope.isAutoruzedFail = false;
    }, true);

}

module.exports = ['$scope', 'AuthenticationService', LoginController];