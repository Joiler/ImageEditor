'use strict';

angular
    .module('Login', [])
    .config(require('./login-config'))
    .controller('LoginController', require('./login-controller'));