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


// var gulp = require('gulp'),
//     gulpLess = require('gulp-less'),
//     gulpMyth = require('gulp-myth'),
//     gulpUtil = require('gulp-util'),
//     gulpUglify = require('gulp-uglify'),
//     gulpJade = require('gulp-jade'),
//     gulpConcat = require('gulp-concat'),
//     gulpPrompt = require('gulp-prompt'),
//     gulpFtp = require('gulp-ftp'),
//     gulpCleanCss = require('gulp-clean-css'),
//     gulpAutoprefixer = require('gulp-autoprefixer');
//
// function errorLog(err) {
//     gulpUtil.log(gulpUtil.colors.bgRed.white.bold(' Error: '), gulpUtil.colors.red(err.message))
//         .beep();
// }
//
// gulp.task('default', function () {
//     gulp.run('less', 'js', 'jade');
// });
//
// gulp.task('less', function () {
//     return gulp.src('./src/**/*.less')
//         .pipe(gulpLess())
//         .on('error', errorLog)
//         .pipe(gulpAutoprefixer())
//         .pipe(gulpCleanCss())
//         .pipe(gulp.dest('./build'));
// });
//
// gulp.task('js', function () {
//     return gulp.src(['./node_modules/jquery/dist/jquery.min.js', './src/**/*.js'])
//         .pipe(gulpConcat('index.js'))
//         .pipe(gulpUglify())
//         .on('error', errorLog)
//         .pipe(gulp.dest('./build'));
// });
//
// gulp.task('jade', function () {
//     return gulp.src('./src/**/*.jade')
//         .pipe(gulpJade())
//         .on('error', errorLog)
//         .pipe(gulp.dest('./build'));
// });
//
// gulp.task('deploy', function () {
//     return gulp.src('./build/*')
//         .pipe(gulpPrompt.prompt([{
//             type: 'input',
//             name: 'user',
//             default: 'anonymous',
//             message: 'FTP user'
//         },
//             {
//                 type: 'password',
//                 name: 'password',
//                 default: 'anonymous',
//                 message: 'FTP password'
//             }], function (res) {
//             gulp.src('./build/*')
//                 .pipe(gulpFtp({
//                     host: 'vadimhtml.ru',
//                     user: res.user,
//                     pass: res.password,
//                     remotePath: '/public_html'
//                 }));
//         }));
// });
