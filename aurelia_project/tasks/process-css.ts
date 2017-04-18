import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as sourcemaps from 'gulp-sourcemaps';
import * as less from 'gulp-less';
import * as flatten from 'gulp-flatten';
import project from './project';
import {build} from 'aurelia-cli';

function copyFonts() {
    return gulp.src(["./node_modules/font-awesome/fonts/*.*"])
        .pipe(flatten())
        .pipe(gulp.dest('./content/fonts'));
}

function processCSS() {
    return gulp.src(project.cssProcessor.source)
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(build.bundle());
}

export default gulp.parallel(
    copyFonts,
    processCSS
);
