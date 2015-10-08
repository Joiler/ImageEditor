'use strict';

var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var passport = require('passport');
var flash = require('connect-flash');

var sessionConfig = require('./configs/session');

var app = express();

require('./configs/passport')(passport);

app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(busboy());
app.use(cookieParser());
app.use(session({
    name: sessionConfig.sessionName,
    secret: sessionConfig.secret,
    cookie: {
        maxAge: sessionConfig.sessionDuration
    },
    store: sessionConfig.sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/configure')(app);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({error: err.message, stack: err.stack});
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({error: err.message});
});

module.exports = app;
