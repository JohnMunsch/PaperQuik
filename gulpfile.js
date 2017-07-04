'use strict';

const gulp = require('gulp');
const exec = require('child_process').execSync;
const del = require('del');

let target = {
  clean: [
    './dist/'
  ],
  sourceRoot: '../../app',
  dist: './dist/'
};

gulp.task('clean', function () {
  return del(target.clean);
});

// autoprefixer
// usemin
// - cache busting via JS and CSS file renaming
// copy files to dist directory

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
