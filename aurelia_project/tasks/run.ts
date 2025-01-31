import * as gulp from 'gulp';
import * as browserSync from 'browser-sync';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import project from './project';
import build from './build';
import buildSystem from './build-system';
import { CLIOptions } from 'aurelia-cli';
import * as notify from 'gulp-notify';
import lint from './lint';

function onChange(path) {
    console.log(`File Changed: ${path}`);
}

function reload(done) {
    browserSync.reload();
    notify("Finished 'reload'");
    done();
}

let serve = gulp.series(
    build,
    done => {
        browserSync({
            online: false,
            open: false,
            port: 9000,
            logLevel: 'silent',
            server: {
                baseDir: ['.'],
                middleware: [historyApiFallback(), function (req, res, next) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    next();
                }]
            }
        }, function (err, bs) {
            let urls = bs.options.get('urls').toJS();
            console.log(`Application Available At: ${urls.local}`);
            console.log(`BrowserSync Available At: ${urls.ui}`);
            done();
        });
    }
);

let refresh = gulp.series(
    buildSystem,
    gulp.parallel(reload, lint)
);

let watch = function () {
    gulp.watch(project.transpiler.source, refresh).on('change', onChange);
    gulp.watch(project.markupProcessor.source, refresh).on('change', onChange);
    gulp.watch(project.cssProcessor.source, refresh).on('change', onChange);
}

let run;

if (CLIOptions.hasFlag('watch')) {
    run = gulp.series(
        serve,
        watch
    );
} else {
    run = serve;
}

export default run;
