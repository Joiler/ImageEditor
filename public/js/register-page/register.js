'use strict';

angular
    .module('Register', [])
    .config(require('./register-config'))
    .controller('RegisterController', require('./register-controller'))
    .directive('match', require('./match-directive'));