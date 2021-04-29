const { src, dest, series, parallel} = require('gulp');

function htmlTask() {
  return src('src/*.html').pipe(dest('dist/'));
}

function stylesTask() {
  return src('src/*.css').pipe(dest('dist/'));
}

function scriptsTask() {
  return src('src/*.js').pipe(dest('dist/'));
}

function imagesTask() {
  return src('src/img/*').pipe(dest('dist/img/'));
}

exports.html = htmlTask;
exports.styles = stylesTask;
exports.scripts = scriptsTask;
exports.images = imagesTask;

exports.default = series(htmlTask, stylesTask, scriptsTask, imagesTask);
