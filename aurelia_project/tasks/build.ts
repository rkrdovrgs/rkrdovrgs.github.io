import * as gulp from 'gulp';
import * as del from 'del';
import project from './project';
import buildSystem from './build-system';

export default gulp.series(
    clean,
    buildSystem
);

function clean() {
    return del([project.platform.output]);
}

