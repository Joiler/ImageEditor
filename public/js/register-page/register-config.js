'use strict';

function config($stateProvider) {
    $stateProvider
        .state('register', {
            url: '/register',
            template: require('./register.html'),
            controller: 'RegisterController',
            resolve: {
                isUserLoggedIn: function (AuthenticationService) {
                    return AuthenticationService.isUserLoggedIn(true);
                }
            }
        });
}

module.exports = ['$stateProvider', config];