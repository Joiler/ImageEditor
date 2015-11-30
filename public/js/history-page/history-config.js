'use strict';

function config($stateProvider) {
    $stateProvider
        .state('history', {
            url: '/history',
            template: require('./history.html'),
            controller: 'HistoryController',
            resolve: {
                data: function (HistoryService) {
                    return HistoryService.load();
                },
                isUserLoggedIn: function (AuthenticationService) {
                    return AuthenticationService.isUserLoggedIn();
                }
            }
        });
}

module.exports = ['$stateProvider', config];