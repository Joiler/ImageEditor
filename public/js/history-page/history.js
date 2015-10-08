'use strict';

angular
    .module('History', [])
    .config(require('./history-config'))
    .controller('HistoryController', require('./history-controller'));