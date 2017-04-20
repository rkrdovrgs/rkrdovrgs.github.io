import * as gulp from 'gulp';
import * as tslint from 'gulp-tslint';
import project from './project';

export default function lint() {
    return gulp.src([project.transpiler.source, project.unitTestRunner.source])
        .pipe(tslint())
        .pipe(tslint.report('prose', {
            emitError: false
        }));
}