'use strict';

const gulp = require('gulp');
const bump = require('gulp-bump');
const del = require('del');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');

const dest = 'dist';
const sourceDest = dest + '/src';

const bumpSrc = './package.json';

const publicGlob = 'public/**';
const specGlob = sourceDest + '/**/*.spec.js';
const tsGlob = 'src/**/*.ts';
const viewGlob = 'views/**/*.pug';

const tsProject = ts.createProject('tsconfig.json');

const compile = () => {
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(sourceDest));
};

const lint = () => {
    return gulp
        .src(tsGlob)
        .pipe(tslint({
            formatter: 'stylish'
        }))
        .pipe(tslint.report({
            emitError: false,
            summarizeFailureOutput: true
        }));
};

const compileAndLint = gulp.series(lint, compile);

const runMocha = () => {
    return gulp.src([specGlob], {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .on('error', gutil.log);
};

const test = gulp.series(compileAndLint, runMocha);

const publicDir = () => {
    return gulp
        .src(publicGlob)
        .pipe(gulp.dest(dest + '/public'));
};

const views = () => {
    return gulp
        .src(viewGlob)
        .pipe(gulp.dest(dest + '/views'));
};

const cleanDist = () => del(dest);

const cleanTest = () => del(specGlob);

const doWatch = () => gulp.parallel(gulp.watch(publicGlob, publicDir),
    gulp.watch(tsGlob, gulp.series(compileAndLint, test)),
    gulp.watch(viewGlob, views));

const copyAndBuild = gulp.parallel(publicDir, compileAndLint, views)

const watchDev = gulp.series(cleanDist, copyAndBuild, doWatch);

const watchTest = gulp.series(cleanDist, copyAndBuild, test, doWatch);

/*
 * Handle version numbers
 */
const bumpMajor = () => {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'major'}))
        .pipe(gulp.dest('./'));
};

const bumpMinor = () => {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
};

const bumpPatch = () => {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
};

const bumpPrerelease = () => {
    gulp.src(bumpSrc)
        .pipe(bump({type: 'prerelease'}))
        .pipe(gulp.dest('./'));
};

const build = gulp.series(cleanDist, copyAndBuild, test, cleanTest)

// ==============================

exports.build = build;
exports.bumpMajor = bumpMajor;
exports.bumpMinor = bumpMinor;
exports.bumpPatch = bumpPatch;
exports.bumpPrerelease = bumpPrerelease;
exports.cleanDist = cleanDist;
exports.cleanTest = cleanTest;
exports.compileAndLint = compileAndLint;
exports.lint = lint;
exports.test = test;
exports.watchDev = watchDev;
exports.watchTest = watchTest;

exports.default = build;
