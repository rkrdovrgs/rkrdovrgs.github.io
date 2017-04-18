import * as gulp from 'gulp';
import * as touch from 'gulp-touch';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import processJsDeps from './process-js-deps';
import { CLIOptions, build } from 'aurelia-cli';
import project from './project';


export default gulp.series(
    readProjectConfiguration,
    gulp.parallel(
        transpile,
        processMarkup,
        processCSS
    ),
    writeBundles
);

function readProjectConfiguration() {
    let env = CLIOptions.getEnvironment();
    return build.src(project);
}

function writeBundles() {
    return build.dest();
}
