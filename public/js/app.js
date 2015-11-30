'use strict';

require('./home-page/home');
require('./list-page/list');
require('./edit-page/edit');
require('./history-page/history');
require('./common/common');
require('./loading/loading');
require('./login-page/login');
require('./register-page/register');

function routerConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
}

function run($rootScope, AuthenticationService) {
    $rootScope.currentUser = null;

    $rootScope.logout = function () {
        AuthenticationService.logout();
    };
}

var app = angular.module('imageEditor', [
    'ui.bootstrap',
    'ui.router',
    'ngMessages',
    'rzModule',
    'Alertify',
    'ngFileUpload',
    'Common',
    'Loading',
    'Login',
    'Register',
    'Home',
    'List',
    'Edit',
    'History'
])
    .config(['$urlRouterProvider', routerConfig])
    .run(['$rootScope', 'AuthenticationService', run]);