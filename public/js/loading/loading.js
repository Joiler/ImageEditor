'use strict';

angular
    .module('Loading', [])
    .service('LoadingService', require('./loading-service'))
    .directive('loadingSpinner', require('./loading-spinner-directive'));