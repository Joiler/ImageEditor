'use strict';

var imageRoutes = require('./imageRoutes');
var userRoutes = require('./userRoutes');
var historyRoutes = require('./historyRoutes');


module.exports = function (app) {
    app.use('/image', imageRoutes);
    app.use('/user', userRoutes);
    app.use('/history', historyRoutes);
};
