import * as gulp from 'gulp';
import * as del from 'del';
import project from './project';
import buildSystem from './build-system';
import lint from './lint';

export default gulp.series(
    clean,
    gulp.parallel(lint, buildSystem)
);

function clean() {
    return del([project.platform.output, 'dist']);
}

