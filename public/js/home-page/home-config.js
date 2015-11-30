'use strict';

function config($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            template: require('./home.html'),
            controller: 'HomeController',
            resolve: {
                data: function (ImageService) {
                    return ImageService.load();
                },
                isUserLoggedIn: function (AuthenticationService) {
                    return AuthenticationService.isUserLoggedIn();
                }
            }
        });
}

module.exports = ['$stateProvider', config];