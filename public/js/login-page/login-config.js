'use strict';

function config($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            template: require('./login.html'),
            controller: 'LoginController',
            resolve: {
                isUserLoggedIn: function (AuthenticationService) {
                    return AuthenticationService.isUserLoggedIn(true);
                }
            }
        });
}

module.exports = ['$stateProvider', config];