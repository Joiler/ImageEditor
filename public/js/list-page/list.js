'use strict';

angular
    .module('List', [])
    .config(require('./list-config'))
    .controller('ListController', require('./list-controller'));