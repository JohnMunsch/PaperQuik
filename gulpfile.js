'use strict';

const gulp = require('gulp');

const cleanCss = require('gulp-clean-css');
const del = require('del');
const exec = require('child_process').execSync;
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev');
const usemin = require('gulp-usemin');

let target = {
  clean: [
    './dist/'
  ],
  html: [
    './app/index.html'
  ],
  src: [
    'components/**',
    'images/*',
    'favicon.ico',
    'robots.txt'
  ],
  dist: './dist/'
};

gulp.task('clean', function () {
  return del(target.clean);
});

// autoprefixer

// copy files to dist directory
gulp.task('copy', () => {
  return gulp.src(target.src, { cwd: './app/', base: './app/' })
    .pipe(gulp.dest(target.dist));
});

// usemin
// - cache busting via JS and CSS file renaming
gulp.task('usemin', gulp.series('clean', 'copy', () => {
  return gulp.src(target.html)
    .pipe(usemin({
      css: [ rev() ],
      html: [ htmlmin({ collapseWhitespace: true }) ],
//      js: [ uglify(), rev() ],
      js: [ rev() ],
//      inlinejs: [ uglify() ],
      inlinejs: [ ],
      inlinecss: [ cleanCss(), 'concat' ]
    }))
    .pipe(gulp.dest(target.dist));
}));

// Ops tasks - All of these use Ansible to do their work.
gulp.task('ops:configure', function() {
  // In gulp 4, you can return a child process to signal task completion
  return exec('ansible-playbook -b configure.yml', {
    cwd: 'ops'
  });
});

gulp.task('ops:deploy', function () {
  return exec('ansible-playbook -b deploy.yml', {
    cwd: 'ops'
  });
});

gulp.task('ops:upgrade', function () {
  return exec('ansible-playbook -b upgrade.yml', {
    cwd: 'ops'
  });
});

// gulp.task('default', gulp.parallel());
