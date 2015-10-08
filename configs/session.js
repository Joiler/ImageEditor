'use strict';

var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var mStore = new mongoStore({
    mongooseConnection: require('../DAL/imageEditorModel').mongooseConnection,
    collection: 'session'
});


module.exports = {
    sessionStore: mStore,
    sessionName: 'imageEditor_sess',
    secret: 'ImageEditorSessionPassword',
    sessionDuration: 10800000
};
