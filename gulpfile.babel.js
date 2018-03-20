'use strict';

const wrapPipe = (taskFn) => {
    return (done) => {
        const onSuccess = () => {
            done();
        };
        const onError = (err) => {
            done(err);
        };
        const outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
};

import gulp from 'gulp';
import stylus from 'gulp-stylus';

gulp.task('default', ['styl'], (cb) => {
    cb();
});

gulp.task('styl', wrapPipe((success, error) => {
    const styl_path = './ui-kit';
    return gulp.src(`${styl_path}/**/*.styl`)
        .pipe(stylus().on('error', error))
        .pipe(gulp.dest(styl_path));
}));
