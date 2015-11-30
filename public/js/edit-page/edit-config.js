'use strict';

function config($stateProvider) {
    $stateProvider
        .state('edit', {
            url: '/edit/:id',
            template: require('./edit.html'),
            controller: 'EditController',
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