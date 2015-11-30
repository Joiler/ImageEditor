var gulp = require('gulp');
var del = require('del');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concatCss = require('gulp-concat-css');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

function getVendorLibs(basePath, prod) {
    var target = '';

    if (prod) {
        target = '.min';
    }

    var scripts = [
        basePath + '/angular/angular' + target + '.js',
        basePath + '/angular-bootstrap/ui-bootstrap-tpls' + target + '.js',
        basePath + '/angular-messages/angular-messages' + target + '.js',
        basePath + '/angular-ui-router/release/angular-ui-router' + target + '.js',
        basePath + '/angularjs-slider/dist/rzslider' + target + '.js',
        basePath + '/caman/dist/caman.full' + target + '.js',
        basePath + '/ng-alertify/dist/ng-alertify.js',
        basePath + '/ng-file-upload/ng-file-upload' + target + '.js'
    ];

    return scripts;
}

function getVendorStyles(basePath, prod) {
    var target = '';

    if (prod) {
        target = '.min';
    }

    var styles = [
        basePath + '/bootstrap/dist/css/bootstrap' + target + '.css',
        basePath + '/angularjs-slider/dist/rzslider' + target + '.css',
        basePath + '/ng-alertify/dist/ng-alertify.css'
    ];

    return styles;
}

gulp.task('jshint:client', function () {
    gulp.src('./public/js/**/*.js')
        .pipe(jshint({
            'curly': true,
            'eqeqeq': true,
            'undef': true,
            'newcap': false,
            'browserify': true,
            'loopfunc': true,
            'globals': {
                'angular': true,
                'window': true,
                'Caman': true
            }
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('jshint:server', function () {
    gulp.src([
        './bin/www',
        './BLL/*.js',
        './configs/*.js',
        './DAL/*.js',
        './routes/*.js',
        './app.js',
    ])
        .pipe(jshint({
            'node': true
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('js:dev', function () {
    gulp.src(getVendorLibs('./bower_components'))
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./public/build/js'));
});

gulp.task('js:prod', function () {
    gulp.src(getVendorLibs('./bower_components', true))
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/build/js'));
});

gulp.task('browserify:dev', function () {
    gulp.src(['./public/js/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true,
            transform: ['partialify']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./public/build/js'));
});

gulp.task('browserify:prod', function () {
    gulp.src(['./public/js/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true,
            transform: ['partialify']
        }))
        .pipe(concat('app.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./public/build/js'));
});

gulp.task('less', function () {
    return gulp.src('./public/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/build/css/'));
});

gulp.task('css', function () {
    return gulp.src(getVendorStyles('./bower_components'))
        .pipe(concatCss('vendor.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/build/css/'));
});

gulp.task('watch', function () {
    gulp.watch('./public/less/*.less', ['less']);
    gulp.watch('./public/js/**/*.js', ['browserify:dev']);
});

gulp.task('clean', function () {
    del([
        'public/build/**/*'
    ]);
});

gulp.task('copyStatic', function () {
    gulp.src('./public/images/*')
        .pipe(gulp.dest('./public/build/images'));

    gulp.src('./bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('./public/build/fonts'));
});

gulp.task('test', ['jshint:client']);
gulp.task('dev', ['copyStatic', 'less', 'css', 'js:dev', 'browserify:dev', 'watch']);
gulp.task('prod', ['copyStatic', 'less', 'css', 'js:prod', 'browserify:prod']);