import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as plumber from 'gulp-plumber';
import * as sourcemaps from 'gulp-sourcemaps';
import * as notify from 'gulp-notify';
import * as rename from 'gulp-rename';
import * as ts from 'gulp-typescript';
import project from './project';
import { CLIOptions, build } from 'aurelia-cli';
import * as eventStream from 'event-stream';
import * as flatten from 'gulp-flatten';
import * as fs from 'fs';

function configureEnvironment() {
  let env = CLIOptions.getEnvironment();

  return gulp.src(`aurelia_project/environments/${env}.ts`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(rename('environment.ts'))
    .pipe(gulp.dest(project.paths.root));
}

function configureMain(cb) {
  fs.writeFile(`${project.paths.root}/main.js`, '', cb);
}

var typescriptCompiler = typescriptCompiler || null;

function buildTypeScript() {
  if (!typescriptCompiler) {
    typescriptCompiler = ts.createProject('tsconfig.json', {
      "typescript": require('typescript')
    });
  }

  let dts = gulp.src(project.transpiler.dtsSource);

  let src = gulp.src(project.transpiler.source);

  return eventStream.merge(dts, src)
    .pipe(plumber({ errorHandler: CLIOptions.hasFlag('notify') ? notify.onError('Error: <%= error.message %>') : undefined }))
    .pipe(sourcemaps.init())
    .pipe(ts(typescriptCompiler))
    .pipe(flatten({ includeParents: 1000 }))
    .pipe(build.bundle());
}

export default gulp.series(
  configureMain,
  configureEnvironment,
  buildTypeScript
);
