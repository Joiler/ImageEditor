'use strict';

function config($stateProvider) {
    $stateProvider
        .state('list', {
            url: '/list',
            template: require('./list.html'),
            controller: 'ListController',
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