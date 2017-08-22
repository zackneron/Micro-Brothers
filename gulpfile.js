/* Titan Gulp Tasker Version: 2.0 ------------------------------------------ */
/*                                                                           */
/* IMPORTANT: Please install all dependencies by running:                    */
/* "$ npm install" : Installs all required node modules                      */
/* "$ bower install" : Installs all required project dependencies            */
/*                                                                           */
/* In addition, you can update your project dependencies by running:         */
/* "$ bower update" : Installs all required project dependencies             */
/*                                                                           */
/* The following tasks are available to you after dependency intallation:    */
/* gulp : Spools up a server for static HTML files                           */
/* gulp --proxy [yourproject.dev] : Proxy against your build against your    */
/*                                  local Wordpress project.                 */
/* ------------------------------------------------------------------------- */

/* Imports Node Modules ---------------------------------------------------- */
var args = require('yargs').argv,
    bootlint  = require('gulp-bootlint'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    htmlInjector = require('bs-html-injector'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    plumber = require('gulp-plumber'),
    rimraf = require('gulp-rimraf'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    utils = require('gulp-util');

/* Clean Task -------------------------------------------------------------- */
gulp.task('clean', function() {
  return gulp.src(['css', 'js'], {
      read: false
    })
    .pipe(rimraf());
});

/* Images Task ------------------------------------------------------------- */
gulp.task('images', function() {
  return gulp.src('./images/**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('./images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/* JavaScript Task --------------------------------------------------------- */
gulp.task('javascript', function() {
  return gulp.src('src/js/scripts.js')
    .pipe(plumber(function(error) {
      utils.log(utils.colors.red(error.message));
      this.emit('end');
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./js'));
});

/* Sass Task --------------------------------------------------------------- */
gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber(function(error) {
      utils.log(utils.colors.red(error.message));
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
});

/ Bootlint Task --------------------------------------------------------------- /
gulp.task('bootlint', function() {
  return gulp.src('./_html/testimonials.html')
    .pipe(bootlint({
      stoponerror: true,
      stoponwarning: true,
      loglevel: 'debug',
      disabledIds: ['W009', 'E007'],
      reportFn: function(file, lint, isError, isWarning, errorLocation) {
        var message = (isError) ? 'ERROR! - ' : 'WARN! - ';
        if (errorLocation) {
          message += file.path + ' (line:' + (errorLocation.line + 1) + ', col:' + (errorLocation.column + 1) + ') [' + lint.id + '] ' + lint.message;
        } else {
          message += file.path + ': ' + lint.id + ' ' + lint.message;
        }
        utils.log(utils.colors.red(message));
      },
      summaryReportFn: function(file, errorCount, warningCount) {
        if (errorCount > 0 || warningCount > 0) {
          console.log('please fix the ' + errorCount + ' errors and ' + warningCount + ' warnings in ' + file.path);
        } else {
          console.log('No problems found in ' + file.path);
        }
      }
    }));
});

/* Default Gulp Task ------------------------------------------------------- */
gulp.task('default', ['clean'], function() {
  gulp.start('javascript');
  gulp.start('images');
  gulp.start('sass');

  gulp.watch('src/js/**/*.js', ['javascript']);
  gulp.watch('src/scss/**/*.scss', ['sass']);

  browserSync.use(htmlInjector, {
    files: './_html/**/*.html'
  });

  $browserSync_args = {
    logFileChanges: false,
    injectChanges: true,
    port: 8010
  }

  if (args.proxy) {
    $browserSync_args.proxy = args.proxy;
  } else {
    $browserSync_args.server = {
      baseDir: './',
      directory: true
    }
  }

  if (args.host) {
    $browserSync_args.host = args.host;
  }

  browserSync.init($browserSync_args);
});
