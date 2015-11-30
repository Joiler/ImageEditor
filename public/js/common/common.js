'use strict';

angular
    .module('Common', [])
    .filter('getById', require('./get-by-id-filter'))
    .filter('startFrom', require('./start-from-filter'))
    .service('ImageService', require('./image-service'))
    .service('GroupService', require('./group-service'))
    .service('HistoryService', require('./history-service'))
    .service('AuthenticationService', require('./authentication-service'))
    .directive('printImages', require('./print-images-directive'));