function wrapPipe(taskFn) {
    return function (done) {
        var onSuccess = function () {
            done();
        };
        var onError = function (err) {
            done(err);
        };
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

var gulp = require('gulp');
var gulpStylus = require('gulp-stylus');
var gulpPug = require('gulp-pug');
var gulpMyth = require('gulp-myth');
var browserSync = require('browser-sync').create();
var gulpSequence = require('gulp-sequence');
var gulpConcat = require('gulp-concat');
var gulpUglify = require('gulp-uglify');
var gulpCleanCss = require('gulp-clean-css');
var gulpPostcss = require('gulp-postcss');

var source_path = './src/';
var destination_path = './docs/';
var vendor_path = ['./node_modules/jquery/dist/jquery.min.js'];


gulp.task('default', ['styl', 'pug', 'js', 'vendor', 'fonts', 'images'], function () {

    browserSync.init({
        ghostMode: false,
        startPath: "index.html",
        server: {
            baseDir: destination_path
        }
    });

    gulp.watch(source_path + 'styl/*.styl', function(){
        gulpSequence('styl', 'reload')(function(){});
    });
    gulp.watch(source_path + 'pug/*.pug', function(){
        gulpSequence('pug', 'reload')(function(){});
    });
    gulp.watch(source_path + 'js/*.js', function(){
        gulpSequence('js', 'reload')(function(){});
    });
});


gulp.task('styl', wrapPipe(function (success, error) {
    return gulp.src(source_path + 'styl/*.styl')
        .pipe(gulpStylus().on('error', error))
        .pipe(gulpMyth({compress: true}).on('error', error))
        .pipe(gulpCleanCss({
            level: 2
        }).on('error', error))
        .pipe(gulp.dest(destination_path));
}));


gulp.task('pug', wrapPipe(function (success, error) {
    return gulp.src(source_path + 'pug/*.pug')
        .pipe(gulpPug().on('error', error))
        .pipe(gulp.dest(destination_path));
}));


gulp.task('js', wrapPipe(function (success, error) {
    vendor_path.push(source_path + 'js/*.js');
    return gulp.src(vendor_path)
        .pipe(gulpConcat('index.js').on('error', error))
        .pipe(gulpUglify().on('error', error))
        .pipe(gulp.dest(destination_path));
}));


gulp.task('vendor', wrapPipe(function (success, error) {
    return gulp.src(source_path + 'vendor/*.js')
        .pipe(gulp.dest(destination_path));
}));


gulp.task('fonts', wrapPipe(function (success, error) {
    return gulp.src(source_path + 'fonts/*.{ttf,woff}')
        .pipe(gulp.dest(destination_path));
}));


gulp.task('images', wrapPipe(function (success, error) {
    return gulp.src(source_path + 'images/*.{png,jpg,gif,svg}')
        .pipe(gulp.dest(destination_path));
}));


gulp.task('reload', wrapPipe(function (success, error) {
    browserSync.reload();
    success();
}));

var googleWebFonts = require('gulp-google-webfonts');

var options = {};

gulp.task('gfonts', function () {
    return gulp.src('./fonts.list')
        .pipe(googleWebFonts(options))
        .pipe(gulp.dest('./docs'));
});
