'use strict';

angular
    .module('Edit', [])
    .config(require('./edit-config'))
    .controller('EditController', require('./edit-controller'))
    .directive('canvasImages', require('./canvas-images-directive'));