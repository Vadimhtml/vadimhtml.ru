var gulp = require('gulp'),
    gulpLess = require('gulp-less'),
    gulpMyth = require('gulp-myth'),
    gulpUtil = require('gulp-util'),
    gulpUglify = require('gulp-uglify'),
    gulpJade = require('gulp-jade'),
    gulpConcat = require('gulp-concat'),
    gulpPrompt = require('gulp-prompt'),
    gulpFtp = require('gulp-ftp'),
    gulpCleanCss = require('gulp-clean-css'),
    gulpAutoprefixer = require('gulp-autoprefixer');

function errorLog(err) {
    gulpUtil.log(gulpUtil.colors.bgRed.white.bold(' Error: '), gulpUtil.colors.red(err.message))
        .beep();
}

gulp.task('default', function () {
    gulp.run('less', 'js', 'jade');
});

gulp.task('less', function () {
    return gulp.src('./src/**/*.less')
        .pipe(gulpLess())
        .on('error', errorLog)
        .pipe(gulpAutoprefixer())
        .pipe(gulpCleanCss())
        .pipe(gulp.dest('./build'));
});

gulp.task('js', function () {
    return gulp.src(['./node_modules/jquery/dist/jquery.min.js', './src/**/*.js'])
        .pipe(gulpConcat('index.js'))
        .pipe(gulpUglify())
        .on('error', errorLog)
        .pipe(gulp.dest('./build'));
});

gulp.task('jade', function () {
    return gulp.src('./src/**/*.jade')
        .pipe(gulpJade())
        .on('error', errorLog)
        .pipe(gulp.dest('./build'));
});

gulp.task('deploy', function () {
    return gulp.src('./build/*')
        .pipe(gulpPrompt.prompt([{
            type: 'input',
            name: 'user',
            default: 'anonymous',
            message: 'FTP user'
        },
            {
                type: 'password',
                name: 'password',
                default: 'anonymous',
                message: 'FTP password'
            }], function (res) {
            gulp.src('./build/*')
                .pipe(gulpFtp({
                    host: 'vadimhtml.ru',
                    user: res.user,
                    pass: res.password,
                    remotePath: '/public_html'
                }));
        }));
});
