'use strict';

function AuthentificationService($http, $rootScope, $q, $state, GroupService) {

    var login = function (userName, password) {
        return $http.post('/user/logon', {
            username: userName,
            password: password
        }).then(
            function (response) {
                if (response.data.success === true) {
                    $rootScope.currentUser = {userName: userName};
                    $state.go('home');
                }
                return response.data;
            });
    };

    var logout = function () {
        $http.get('/user/logout')
            .then(function (response) {
                if (response.data.success === true) {
                    $rootScope.currentUser = null;
                    $state.go('login');
                    GroupService.resetGroup();
                }
            });
    };

    var register = function (userName, password, email) {
        return $http.post('/user/register', {
            username: userName,
            password: password,
            email: email
        }).then(
            function (result) {
                if (result.data.success === true) {
                    $rootScope.currentUser = {userName: userName};
                    $state.go('home');
                }
                return result.data;
            });
    };

    var isUserLoggedIn = function (isRedirectFromLoginOrRegisterPage) {
        var deferred = $q.defer();

        if ($rootScope.currentUser && $rootScope.currentUser.userName) {
            if (isRedirectFromLoginOrRegisterPage === true) {
                $state.go('home');
            }
            deferred.resolve();
        }
        else {
            $http.get('/user/isLoggedIn')
                .then(function (result) {
                    if (result.data.success === true) {
                        $rootScope.currentUser = {userName: result.data.username};
                        if (isRedirectFromLoginOrRegisterPage === true) {
                            $state.go('home');
                        }
                        deferred.resolve();
                    }
                    else {
                        if (!isRedirectFromLoginOrRegisterPage) {
                            $state.go('login');
                            deferred.reject();
                        }
                        else {
                            deferred.resolve();
                        }
                    }
                });
        }
        return deferred.promise;
    };

    return {
        login: login,
        logout: logout,
        register: register,
        isUserLoggedIn: isUserLoggedIn
    };
}

module.exports = ['$http', '$rootScope', '$q', '$state', 'GroupService', AuthentificationService];