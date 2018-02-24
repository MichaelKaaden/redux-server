'use strict';

const gulp = require('gulp');
const bump = require('gulp-bump');
const del = require('del');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');

const dest = 'dist';
const sourceDest = dest + '/src';

const bumpSrc = './package.json';

const publicGlob = 'public/**';
const specGlob = sourceDest + '/**/*.spec.js';
const tsGlob = 'src/**/*.ts';
const viewGlob = 'views/**/*.pug';

// pull in the project's TypeScript config
const tsProject = ts.createProject('tsconfig.json');
// tsProject(ts.reporter.longReporter());

// gulp.on('stop', function () {
//     process.exit(0);
// });
// gulp.on('err', function () {
//     process.exit(1);
// });

gulp.task('sources', ['tslint'], function () {
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(sourceDest));
});

gulp.task('tslint', function () {
        return gulp
            .src(tsGlob)
            .pipe(tslint({
                formatter: 'stylish'
            }))
            .pipe(tslint.report({
                emitError: false,
                summarizeFailureOutput: true
            }));
    }
);

// gulp-mocha is known to hang, see https://github.com/netdeckyr/netdeckyr/issues/2
gulp.task('test', ['sources'], function () {
    return gulp.src([specGlob], {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .on('error', gutil.log);
});

gulp.task('public', function () {
    return gulp
        .src(publicGlob)
        .pipe(gulp.dest(dest + '/public'));
});

gulp.task('views', function () {
    return gulp
        .src(viewGlob)
        .pipe(gulp.dest(dest + '/views'));
});

gulp.task('watch:dev', function (callback) {
    runSequence(
        'clean:dist',
        ['public', 'sources', 'views'],
        callback);
    gulp.watch(publicGlob, ['public']);
    gulp.watch(tsGlob, ['sources']);
    gulp.watch(viewGlob, ['views']);
});

gulp.task('watch:test', function (callback) {
    runSequence(
        'clean:dist',
        ['public', 'sources', 'views'],
        'test',
        callback);
    gulp.watch(publicGlob, ['public']);
    gulp.watch(tsGlob, ['sources', 'test']);
    gulp.watch(viewGlob, ['views']);
});

gulp.task('clean:dist', function () {
    return del.sync(dest);
});

gulp.task('clean:test', function () {
    return del.sync(specGlob);
});

/*
 * Handle version numbers
 */
gulp.task('bump:major', function () {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'major'}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump:minor', function () {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump:patch', function () {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump:prerelease', function () {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'prerelease'}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', function (callback) {
    // without this, the 'test' task would hang indefinitely
    gulp.on('stop', function () {
        process.exit(0);
    });
    runSequence(
        'clean:dist',
        ['public', 'sources', 'views'],
        'test',
        'clean:test',
        callback);
});
