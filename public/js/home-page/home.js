'use strict';

angular
    .module('Home', [])
    .config(require('./home-config'))
    .controller('HomeController', require('./home-controller'));